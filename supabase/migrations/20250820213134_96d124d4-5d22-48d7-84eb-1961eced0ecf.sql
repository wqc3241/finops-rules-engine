-- Add RLS policies for bulletin_pricing table
ALTER TABLE public.bulletin_pricing ENABLE ROW LEVEL SECURITY;

-- FS_OPS can view bulletin pricing
CREATE POLICY "FS_OPS can view bulletin pricing" 
ON public.bulletin_pricing 
FOR SELECT 
USING (EXISTS ( 
  SELECT 1
  FROM user_profiles
  WHERE user_profiles.user_id = auth.uid() 
    AND user_profiles.role = ANY (ARRAY['FS_OPS'::user_role, 'FS_ADMIN'::user_role, 'admin'::user_role])
));

-- FS_OPS can insert bulletin pricing
CREATE POLICY "FS_OPS can insert bulletin pricing" 
ON public.bulletin_pricing 
FOR INSERT 
WITH CHECK (EXISTS ( 
  SELECT 1
  FROM user_profiles
  WHERE user_profiles.user_id = auth.uid() 
    AND user_profiles.role = ANY (ARRAY['FS_OPS'::user_role, 'FS_ADMIN'::user_role, 'admin'::user_role])
));

-- FS_OPS can update bulletin pricing
CREATE POLICY "FS_OPS can update bulletin pricing" 
ON public.bulletin_pricing 
FOR UPDATE 
USING (EXISTS ( 
  SELECT 1
  FROM user_profiles
  WHERE user_profiles.user_id = auth.uid() 
    AND user_profiles.role = ANY (ARRAY['FS_OPS'::user_role, 'FS_ADMIN'::user_role, 'admin'::user_role])
));

-- FS_ADMIN can delete bulletin pricing
CREATE POLICY "FS_ADMIN can delete bulletin pricing" 
ON public.bulletin_pricing 
FOR DELETE 
USING (EXISTS ( 
  SELECT 1
  FROM user_profiles
  WHERE user_profiles.user_id = auth.uid() 
    AND user_profiles.role = ANY (ARRAY['FS_ADMIN'::user_role, 'admin'::user_role])
));