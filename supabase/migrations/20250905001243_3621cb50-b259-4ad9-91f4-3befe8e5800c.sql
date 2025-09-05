
-- Ensure RLS is enabled (safe to run even if already enabled)
ALTER TABLE public.discount_rules ENABLE ROW LEVEL SECURITY;

-- Clean up any prior policies (optional, uncomment if you want a reset)
-- DROP POLICY IF EXISTS "Authenticated users can view discount rules" ON public.discount_rules;
-- DROP POLICY IF EXISTS "FS_OPS can insert discount rules" ON public.discount_rules;
-- DROP POLICY IF EXISTS "FS_OPS can update discount rules" ON public.discount_rules;
-- DROP POLICY IF EXISTS "FS_ADMIN can delete discount rules" ON public.discount_rules;

-- 1) SELECT: Allow any authenticated user to view discount rules
CREATE POLICY "Authenticated users can view discount rules"
ON public.discount_rules
FOR SELECT
USING (auth.role() = 'authenticated');

-- 2) INSERT: Allow FS_OPS, FS_ADMIN, admin to insert
CREATE POLICY "FS_OPS can insert discount rules"
ON public.discount_rules
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

-- 3) UPDATE: Allow FS_OPS, FS_ADMIN, admin to update
CREATE POLICY "FS_OPS can update discount rules"
ON public.discount_rules
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

-- 4) DELETE: Allow FS_ADMIN, admin to delete
CREATE POLICY "FS_ADMIN can delete discount rules"
ON public.discount_rules
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('FS_ADMIN', 'admin')
  )
);

-- Keep updated_at in sync on edits
DROP TRIGGER IF EXISTS set_discount_rules_updated_at ON public.discount_rules;
CREATE TRIGGER set_discount_rules_updated_at
BEFORE UPDATE ON public.discount_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
