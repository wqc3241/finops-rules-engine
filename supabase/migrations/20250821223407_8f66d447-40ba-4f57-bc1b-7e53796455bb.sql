-- Add template metadata to financial program configs
ALTER TABLE public.financial_program_configs 
ADD COLUMN template_metadata JSONB DEFAULT '{}';

-- Create bulletin upload sessions table
CREATE TABLE public.bulletin_upload_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  program_code TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  upload_status TEXT NOT NULL DEFAULT 'processing',
  validation_status TEXT NOT NULL DEFAULT 'pending',
  total_records INTEGER DEFAULT 0,
  valid_records INTEGER DEFAULT 0,
  invalid_records INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  validation_completed_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id)
);

-- Create bulletin upload errors table
CREATE TABLE public.bulletin_upload_errors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.bulletin_upload_sessions(id) ON DELETE CASCADE,
  sheet_name TEXT NOT NULL,
  row_number INTEGER,
  column_name TEXT,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  field_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add approval status to bulletin pricing
ALTER TABLE public.bulletin_pricing 
ADD COLUMN upload_session_id UUID REFERENCES public.bulletin_upload_sessions(id),
ADD COLUMN approval_status TEXT DEFAULT 'approved',
ADD COLUMN created_by UUID REFERENCES auth.users(id),
ADD COLUMN approved_by UUID REFERENCES auth.users(id),
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;

-- Enable RLS on new tables
ALTER TABLE public.bulletin_upload_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulletin_upload_errors ENABLE ROW LEVEL SECURITY;

-- RLS policies for bulletin upload sessions
CREATE POLICY "FS_OPS can view upload sessions" 
ON public.bulletin_upload_sessions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_id = auth.uid() 
  AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
));

CREATE POLICY "FS_OPS can create upload sessions" 
ON public.bulletin_upload_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = uploaded_by AND EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_id = auth.uid() 
  AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
));

CREATE POLICY "FS_ADMIN can update upload sessions" 
ON public.bulletin_upload_sessions 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_id = auth.uid() 
  AND role IN ('FS_ADMIN', 'admin')
));

-- RLS policies for bulletin upload errors
CREATE POLICY "FS_OPS can view upload errors" 
ON public.bulletin_upload_errors 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_id = auth.uid() 
  AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
));

CREATE POLICY "System can insert upload errors" 
ON public.bulletin_upload_errors 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_bulletin_upload_sessions_program_code ON public.bulletin_upload_sessions(program_code);
CREATE INDEX idx_bulletin_upload_sessions_status ON public.bulletin_upload_sessions(upload_status, validation_status);
CREATE INDEX idx_bulletin_upload_errors_session_id ON public.bulletin_upload_errors(session_id);
CREATE INDEX idx_bulletin_pricing_upload_session ON public.bulletin_pricing(upload_session_id);
CREATE INDEX idx_bulletin_pricing_approval_status ON public.bulletin_pricing(approval_status);