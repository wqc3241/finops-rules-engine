-- Create pending_bulletin_pricing table to store uploaded records before approval
CREATE TABLE public.pending_bulletin_pricing (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid NOT NULL,
  bulletin_id text NOT NULL,
  financial_program_code text,
  pricing_type text,
  pricing_config text,
  credit_profile text,
  pricing_value numeric,
  lender_list text,
  geo_code text,
  advertised boolean DEFAULT false,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  upload_date timestamp with time zone DEFAULT now()
);

-- Enable RLS on pending_bulletin_pricing
ALTER TABLE public.pending_bulletin_pricing ENABLE ROW LEVEL SECURITY;

-- Create policies for pending_bulletin_pricing
CREATE POLICY "FS_OPS can view pending bulletin pricing" 
ON public.pending_bulletin_pricing 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_id = auth.uid() 
  AND role = ANY (ARRAY['FS_OPS'::user_role, 'FS_ADMIN'::user_role, 'admin'::user_role])
));

CREATE POLICY "System can insert pending bulletin pricing" 
ON public.pending_bulletin_pricing 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "FS_ADMIN can delete pending bulletin pricing" 
ON public.pending_bulletin_pricing 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_id = auth.uid() 
  AND role = ANY (ARRAY['FS_ADMIN'::user_role, 'admin'::user_role])
));

-- Create pending_financial_program_configs table
CREATE TABLE public.pending_financial_program_configs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id uuid NOT NULL,
  program_code text NOT NULL,
  vehicle_style_id text,
  financing_vehicle_condition text,
  financial_product_id text,
  program_start_date text,
  program_end_date text,
  is_active text,
  advertised text,
  version integer DEFAULT 1,
  priority integer,
  order_types text,
  template_metadata jsonb DEFAULT '{}'::jsonb,
  clone_from text,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on pending_financial_program_configs
ALTER TABLE public.pending_financial_program_configs ENABLE ROW LEVEL SECURITY;

-- Create policies for pending_financial_program_configs
CREATE POLICY "FS_OPS can view pending financial program configs" 
ON public.pending_financial_program_configs 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_id = auth.uid() 
  AND role = ANY (ARRAY['FS_OPS'::user_role, 'FS_ADMIN'::user_role, 'admin'::user_role])
));

CREATE POLICY "FS_OPS can insert pending financial program configs" 
ON public.pending_financial_program_configs 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_id = auth.uid() 
  AND role = ANY (ARRAY['FS_OPS'::user_role, 'FS_ADMIN'::user_role, 'admin'::user_role])
));

CREATE POLICY "FS_ADMIN can delete pending financial program configs" 
ON public.pending_financial_program_configs 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_id = auth.uid() 
  AND role = ANY (ARRAY['FS_ADMIN'::user_role, 'admin'::user_role])
));

-- Add table_schema_id column to change_requests to support different table types
ALTER TABLE public.change_requests ADD COLUMN IF NOT EXISTS table_schema_ids text[] DEFAULT '{}';

-- Update bulletin_upload_sessions to track approval workflow
ALTER TABLE public.bulletin_upload_sessions ADD COLUMN IF NOT EXISTS change_request_id uuid;
ALTER TABLE public.bulletin_upload_sessions ADD COLUMN IF NOT EXISTS approval_status text DEFAULT 'pending';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_pending_bulletin_pricing_session_id ON public.pending_bulletin_pricing(session_id);
CREATE INDEX IF NOT EXISTS idx_pending_financial_program_configs_request_id ON public.pending_financial_program_configs(request_id);
CREATE INDEX IF NOT EXISTS idx_bulletin_upload_sessions_change_request_id ON public.bulletin_upload_sessions(change_request_id);