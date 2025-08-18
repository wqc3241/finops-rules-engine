-- Create table_locks table to support approval workflow
CREATE TABLE IF NOT EXISTS public.table_locks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schema_id text NOT NULL,
  request_id uuid NOT NULL,
  locked_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Helpful index to avoid duplicate locks per schema/request
CREATE UNIQUE INDEX IF NOT EXISTS table_locks_unique_lock 
  ON public.table_locks (schema_id, request_id);

-- Foreign key to change_requests so locks are tied to a request
ALTER TABLE public.table_locks
  ADD CONSTRAINT table_locks_request_fk
  FOREIGN KEY (request_id)
  REFERENCES public.change_requests(id)
  ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE public.table_locks ENABLE ROW LEVEL SECURITY;

-- Policies
-- Anyone can read locks (the app needs to know which tables are locked)
DROP POLICY IF EXISTS "Users can view table locks" ON public.table_locks;
CREATE POLICY "Users can view table locks"
ON public.table_locks
FOR SELECT
USING (true);

-- FS_OPS/FS_ADMIN/admin can create locks for their own requests
DROP POLICY IF EXISTS "Authorized users can create table locks" ON public.table_locks;
CREATE POLICY "Authorized users can create table locks"
ON public.table_locks
FOR INSERT
WITH CHECK (
  -- user must be FS_OPS/FS_ADMIN/admin
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.user_id = auth.uid()
      AND up.role IN ('FS_OPS','FS_ADMIN','admin')
  )
  AND locked_by = auth.uid()
);

-- Admins can delete any lock; owners can delete their own locks (e.g., on finalize)
DROP POLICY IF EXISTS "Admins or owners can delete table locks" ON public.table_locks;
CREATE POLICY "Admins or owners can delete table locks"
ON public.table_locks
FOR DELETE
USING (
  -- Owner of the lock
  locked_by = auth.uid()
  OR
  -- Or admin
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.user_id = auth.uid()
      AND up.role IN ('FS_ADMIN','admin')
  )
);

-- Optional: allow admins to update locks if needed (not typically used)
DROP POLICY IF EXISTS "Admins can update table locks" ON public.table_locks;
CREATE POLICY "Admins can update table locks"
ON public.table_locks
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.user_id = auth.uid()
      AND up.role IN ('FS_ADMIN','admin')
  )
);
