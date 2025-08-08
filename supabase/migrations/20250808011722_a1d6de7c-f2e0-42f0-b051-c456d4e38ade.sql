-- Re-apply with conditional policy creation (no IF NOT EXISTS)

-- Helper functions (idempotent)
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

-- Drop recursive policies if present
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_profiles'
      AND policyname = 'Admins can manage all profiles'
  ) THEN
    EXECUTE 'DROP POLICY "Admins can manage all profiles" ON public.user_profiles';
  END IF;
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

-- Create safe policies leveraging helper functions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='user_profiles' AND policyname='Admins can update all profiles'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can update all profiles" ON public.user_profiles FOR UPDATE USING (public.is_admin())';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='user_profiles' AND policyname='Admins can delete profiles'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can delete profiles" ON public.user_profiles FOR DELETE USING (public.is_admin())';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='change_requests' AND policyname='Admins can update change requests'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can update change requests" ON public.change_requests FOR UPDATE USING (public.is_admin())';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='change_details' AND policyname='Admins can update change details'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can update change details" ON public.change_details FOR UPDATE USING (public.is_admin())';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='table_locks' AND policyname='Admins can manage table locks'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can manage table locks" ON public.table_locks FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin())';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='change_requests' AND policyname='FS_OPS can create change requests'
  ) THEN
    EXECUTE 'CREATE POLICY "FS_OPS can create change requests" ON public.change_requests FOR INSERT WITH CHECK (public.is_fs_ops_or_admin())';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='table_locks' AND policyname='FS_OPS can create table locks'
  ) THEN
    EXECUTE 'CREATE POLICY "FS_OPS can create table locks" ON public.table_locks FOR INSERT WITH CHECK (public.is_fs_ops_or_admin())';
  END IF;
END $$;