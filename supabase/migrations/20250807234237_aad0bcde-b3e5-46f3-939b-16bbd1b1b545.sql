-- Add RLS policies for discount_rules table to allow proper access

-- Allow authenticated users to view discount_rules records
CREATE POLICY "Authenticated users can view discount rules" 
ON public.discount_rules 
FOR SELECT 
TO authenticated 
USING (auth.role() = 'authenticated');

-- Allow FS_OPS, FS_ADMIN, and admin roles to insert discount_rules records
CREATE POLICY "FS_OPS can insert discount rules" 
ON public.discount_rules 
FOR INSERT 
TO authenticated 
WITH CHECK (
  auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

-- Allow FS_OPS, FS_ADMIN, and admin roles to update discount_rules records
CREATE POLICY "FS_OPS can update discount rules" 
ON public.discount_rules 
FOR UPDATE 
TO authenticated 
USING (
  auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

-- Allow only FS_ADMIN and admin roles to delete discount_rules records
CREATE POLICY "FS_ADMIN can delete discount rules" 
ON public.discount_rules 
FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_ADMIN', 'admin')
  )
);