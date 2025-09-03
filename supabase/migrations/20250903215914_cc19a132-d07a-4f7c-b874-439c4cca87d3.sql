-- Create document_types table for the new hierarchy
CREATE TABLE public.document_types (
  id UUID NOT NULL DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.document_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_required BOOLEAN DEFAULT false,
  requires_signature BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create document_acceptable_files table for acceptable file types per document type
CREATE TABLE public.document_acceptable_files (
  id UUID NOT NULL DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  document_type_id UUID NOT NULL REFERENCES public.document_types(id) ON DELETE CASCADE,
  file_extension TEXT NOT NULL,
  max_file_size_mb INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_acceptable_files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for document_types
CREATE POLICY "FS_ADMIN can manage document types" 
ON public.document_types 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_profiles.user_id = auth.uid() 
  AND user_profiles.role = ANY(ARRAY['FS_ADMIN'::user_role, 'admin'::user_role])
));

CREATE POLICY "FS_OPS can view document types" 
ON public.document_types 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_profiles.user_id = auth.uid() 
  AND user_profiles.role = ANY(ARRAY['FS_OPS'::user_role, 'FS_ADMIN'::user_role, 'admin'::user_role])
));

-- Create RLS policies for document_acceptable_files
CREATE POLICY "FS_ADMIN can manage acceptable files" 
ON public.document_acceptable_files 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_profiles.user_id = auth.uid() 
  AND user_profiles.role = ANY(ARRAY['FS_ADMIN'::user_role, 'admin'::user_role])
));

CREATE POLICY "FS_OPS can view acceptable files" 
ON public.document_acceptable_files 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_profiles.user_id = auth.uid() 
  AND user_profiles.role = ANY(ARRAY['FS_OPS'::user_role, 'FS_ADMIN'::user_role, 'admin'::user_role])
));

-- Create indexes for better performance
CREATE INDEX idx_document_types_category_id ON public.document_types(category_id);
CREATE INDEX idx_document_types_sort_order ON public.document_types(sort_order);
CREATE INDEX idx_document_acceptable_files_type_id ON public.document_acceptable_files(document_type_id);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_document_types_updated_at
  BEFORE UPDATE ON public.document_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();