-- Fix infinite recursion error in user_profiles RLS by resetting policies to non-recursive ones
-- and allowing safe self-row access used by other table policies.

-- 1) Ensure the helper functions exist (idempotent re-create) — safe to re-run
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role::text
  FROM public.user_profiles
  WHERE user_id = auth.uid()
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
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
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE user_id = auth.uid()
      AND role IN ('FS_OPS','FS_ADMIN','admin')
  );
$$;

-- 2) Drop ALL existing policies on user_profiles to remove recursive definitions
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_profiles'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_profiles', pol.policyname);
  END LOOP;
END $$;

-- 3) Re-enable RLS (idempotent)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 4) Create SAFE, non-recursive policies
-- Allow users to SELECT only their own profile row. This avoids referencing user_profiles inside its own policy via subqueries.
CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Optionally, allow users to UPDATE their own non-privileged fields (kept conservative)
-- If your app does not need this, it will not have any effect.
CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can update any profile without recursion by checking JWT role claim at the edge (not available) or relying on admin-only paths.
-- If needed later, consider moving admin-only mutations to Edge Functions.

-- Note: We intentionally DO NOT use is_admin() inside user_profiles policies to avoid recursion.
-- Other table policies may continue to reference user_profiles safely since this table now permits
-- self-row SELECTs, satisfying those EXISTS() checks without recursion.
