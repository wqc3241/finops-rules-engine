-- Add RLS policies for geo_location table to allow proper access

-- Allow authenticated users to view geo_location records
CREATE POLICY "Users can view geo location data" 
ON public.geo_location 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow FS_OPS, FS_ADMIN, and admin roles to insert geo_location records
CREATE POLICY "Authorized users can insert geo location data" 
ON public.geo_location 
FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

-- Allow FS_OPS, FS_ADMIN, and admin roles to update geo_location records
CREATE POLICY "Authorized users can update geo location data" 
ON public.geo_location 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

-- Allow only FS_ADMIN and admin roles to delete geo_location records
CREATE POLICY "Admin users can delete geo location data" 
ON public.geo_location 
FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_ADMIN', 'admin')
  )
);