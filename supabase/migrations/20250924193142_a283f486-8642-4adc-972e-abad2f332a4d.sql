-- Add INSERT policy for FS_OPS users to create document templates
CREATE POLICY "FS_OPS can create templates" 
ON public.document_templates 
FOR INSERT 
WITH CHECK (
  (auth.uid() = created_by) AND 
  (EXISTS ( 
    SELECT 1 
    FROM user_profiles 
    WHERE (
      (user_profiles.user_id = auth.uid()) AND 
      (user_profiles.role = ANY (ARRAY['FS_OPS'::user_role, 'FS_ADMIN'::user_role, 'admin'::user_role]))
    )
  ))
);