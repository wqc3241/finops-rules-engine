-- Create enums for approval workflow
CREATE TYPE approval_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'IN_REVIEW');
CREATE TYPE user_role AS ENUM ('FS_OPS', 'FS_ADMIN', 'admin');

-- Create user profiles table
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'FS_OPS',
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create change requests table
CREATE TABLE public.change_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status approval_status NOT NULL DEFAULT 'PENDING',
  version_id TEXT NOT NULL,
  comment TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create change details table
CREATE TABLE public.change_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.change_requests(id) ON DELETE CASCADE,
  table_name TEXT NOT NULL,
  rule_key TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  status approval_status NOT NULL DEFAULT 'PENDING',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rule versions table for audit trail
CREATE TABLE public.rule_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  rule_key TEXT NOT NULL,
  value JSONB NOT NULL,
  version_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Create table locks for managing locked states during review
CREATE TABLE public.table_locks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  schema_id TEXT NOT NULL,
  locked_by UUID NOT NULL REFERENCES auth.users(id),
  locked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  request_id UUID NOT NULL REFERENCES public.change_requests(id) ON DELETE CASCADE,
  UNIQUE(schema_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rule_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.table_locks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all profiles" ON public.user_profiles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'FS_ADMIN')
  )
);

-- RLS Policies for change_requests
CREATE POLICY "Users can view all change requests" ON public.change_requests FOR SELECT USING (true);
CREATE POLICY "FS_OPS can create change requests" ON public.change_requests FOR INSERT WITH CHECK (
  auth.uid() = created_by AND 
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);
CREATE POLICY "Admins can update change requests" ON public.change_requests FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role IN ('FS_ADMIN', 'admin')
  )
);

-- RLS Policies for change_details
CREATE POLICY "Users can view all change details" ON public.change_details FOR SELECT USING (true);
CREATE POLICY "System can insert change details" ON public.change_details FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update change details" ON public.change_details FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role IN ('FS_ADMIN', 'admin')
  )
);

-- RLS Policies for rule_versions
CREATE POLICY "Users can view all rule versions" ON public.rule_versions FOR SELECT USING (true);
CREATE POLICY "System can insert rule versions" ON public.rule_versions FOR INSERT WITH CHECK (true);

-- RLS Policies for table_locks
CREATE POLICY "Users can view all table locks" ON public.table_locks FOR SELECT USING (true);
CREATE POLICY "Admins can manage table locks" ON public.table_locks FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role IN ('FS_ADMIN', 'admin')
  )
);

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, role, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    'FS_OPS'::user_role,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();