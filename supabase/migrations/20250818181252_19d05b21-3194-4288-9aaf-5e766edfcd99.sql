-- CRITICAL SECURITY FIXES - Phase 1: Emergency Data Protection (Fixed)

-- 1. Secure Customer Data (applicant_info table)
DROP POLICY IF EXISTS "Allow all operations" ON public.applicant_info;

CREATE POLICY "FS_OPS can view applicant info" 
ON public.applicant_info 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

CREATE POLICY "FS_OPS can create applicant info" 
ON public.applicant_info 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

CREATE POLICY "FS_OPS can update applicant info" 
ON public.applicant_info 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

CREATE POLICY "FS_ADMIN can delete applicant info" 
ON public.applicant_info 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_ADMIN', 'admin')
  )
);

-- 2. Secure Employee Data (user_profiles table) - Drop and recreate existing policies
DROP POLICY IF EXISTS "Allow all operations" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "System can insert profiles" ON public.user_profiles;

CREATE POLICY "Users can view own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.user_profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.user_id = auth.uid() 
    AND up.role IN ('FS_ADMIN', 'admin')
  )
);

CREATE POLICY "Users can update own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all profiles" 
ON public.user_profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.user_id = auth.uid() 
    AND up.role IN ('FS_ADMIN', 'admin')
  )
);

CREATE POLICY "System can insert profiles" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (true);

-- 3. Secure Application Data
DROP POLICY IF EXISTS "Allow all operations" ON public.applications;

CREATE POLICY "FS_OPS can view applications" 
ON public.applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

CREATE POLICY "FS_OPS can create applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

CREATE POLICY "FS_OPS can update applications" 
ON public.applications 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

CREATE POLICY "FS_ADMIN can delete applications" 
ON public.applications 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_ADMIN', 'admin')
  )
);

-- 4. Secure Application Details
DROP POLICY IF EXISTS "Allow all operations" ON public.application_details;

CREATE POLICY "FS_OPS can view application details" 
ON public.application_details 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

CREATE POLICY "FS_OPS can create application details" 
ON public.application_details 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

CREATE POLICY "FS_OPS can update application details" 
ON public.application_details 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

-- 5. Secure Application History
DROP POLICY IF EXISTS "Allow all operations" ON public.application_history;

CREATE POLICY "FS_OPS can view application history" 
ON public.application_history 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

CREATE POLICY "FS_OPS can create application history" 
ON public.application_history 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

-- 6. Secure Application Notes
DROP POLICY IF EXISTS "Allow all operations" ON public.application_notes;

CREATE POLICY "FS_OPS can view application notes" 
ON public.application_notes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

CREATE POLICY "FS_OPS can create application notes" 
ON public.application_notes 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

CREATE POLICY "FS_OPS can update application notes" 
ON public.application_notes 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);