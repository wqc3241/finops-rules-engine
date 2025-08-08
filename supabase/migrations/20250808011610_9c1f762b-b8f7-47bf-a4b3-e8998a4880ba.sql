-- Fix recursive RLS policies by introducing SECURITY DEFINER helpers and updating policies

-- 1) Helper functions to check roles without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text
  FROM public.user_profiles
  WHERE user_id = auth.uid()
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE user_id = auth.uid()
      AND role IN ('admin','FS_ADMIN')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_fs_ops_or_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE user_id = auth.uid()
      AND role IN ('FS_OPS','FS_ADMIN','admin')
  );
$$;

-- 2) Update user_profiles policies to remove recursive subquery
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_profiles'
      AND policyname = 'Admins can manage all profiles'
  ) THEN
    EXECUTE 'DROP POLICY "Admins can manage all profiles" ON public.user_profiles';
  END IF;
END $$;

-- Allow admins to update/delete any profile without recursion
CREATE POLICY IF NOT EXISTS "Admins can update all profiles"
ON public.user_profiles
FOR UPDATE
USING (public.is_admin());

CREATE POLICY IF NOT EXISTS "Admins can delete profiles"
ON public.user_profiles
FOR DELETE
USING (public.is_admin());

-- 3) Update approval workflow table policies to use helper functions (remove recursive subqueries)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'change_requests'
      AND policyname = 'Admins can update change requests'
  ) THEN
    EXECUTE 'DROP POLICY "Admins can update change requests" ON public.change_requests';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'change_details'
      AND policyname = 'Admins can update change details'
  ) THEN
    EXECUTE 'DROP POLICY "Admins can update change details" ON public.change_details';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'table_locks'
      AND policyname = 'Admins can manage table locks'
  ) THEN
    EXECUTE 'DROP POLICY "Admins can manage table locks" ON public.table_locks';
  END IF;
END $$;

CREATE POLICY IF NOT EXISTS "Admins can update change requests"
ON public.change_requests
FOR UPDATE
USING (public.is_admin());

CREATE POLICY IF NOT EXISTS "Admins can update change details"
ON public.change_details
FOR UPDATE
USING (public.is_admin());

-- Allow admins to fully manage table locks
CREATE POLICY IF NOT EXISTS "Admins can manage table locks"
ON public.table_locks
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Optionally ensure FS_OPS can create change requests and create locks when submitting
-- (Keep existing INSERT policies but add WITH CHECK guard if they were missing)
CREATE POLICY IF NOT EXISTS "FS_OPS can create change requests"
ON public.change_requests
FOR INSERT
WITH CHECK (public.is_fs_ops_or_admin());

CREATE POLICY IF NOT EXISTS "FS_OPS can create table locks"
ON public.table_locks
FOR INSERT
WITH CHECK (public.is_fs_ops_or_admin());
