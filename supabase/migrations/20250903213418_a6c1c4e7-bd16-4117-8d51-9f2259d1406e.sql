-- Enhance document_categories table
ALTER TABLE public.document_categories 
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS icon text DEFAULT 'FileText',
ADD COLUMN IF NOT EXISTS is_required boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_signature boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_internal_only boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS product_types text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Create document_file_types table
CREATE TABLE IF NOT EXISTS public.document_file_types (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid NOT NULL REFERENCES public.document_categories(id) ON DELETE CASCADE,
  file_extension text NOT NULL,
  max_file_size_mb integer DEFAULT 10,
  created_at timestamp with time zone DEFAULT now()
);

-- Create document_statuses table
CREATE TABLE IF NOT EXISTS public.document_statuses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid NOT NULL REFERENCES public.document_categories(id) ON DELETE CASCADE,
  status_name text NOT NULL,
  status_color text DEFAULT '#6b7280',
  is_default boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Enhance documents table
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS file_extension text,
ADD COLUMN IF NOT EXISTS file_size_mb numeric,
ADD COLUMN IF NOT EXISTS requires_signature boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS signature_status text,
ADD COLUMN IF NOT EXISTS is_required boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS product_type text;

-- Enable RLS on new tables
ALTER TABLE public.document_file_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_statuses ENABLE ROW LEVEL SECURITY;

-- RLS policies for document_file_types
CREATE POLICY "FS_ADMIN can manage file types" ON public.document_file_types
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_ADMIN', 'admin')
  )
);

CREATE POLICY "FS_OPS can view file types" ON public.document_file_types
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

-- RLS policies for document_statuses
CREATE POLICY "FS_ADMIN can manage statuses" ON public.document_statuses
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_ADMIN', 'admin')
  )
);

CREATE POLICY "FS_OPS can view statuses" ON public.document_statuses
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

-- Update existing document_categories RLS to allow admin management
DROP POLICY IF EXISTS "Allow all operations" ON public.document_categories;

CREATE POLICY "FS_ADMIN can manage categories" ON public.document_categories
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_ADMIN', 'admin')
  )
);

CREATE POLICY "FS_OPS can view categories" ON public.document_categories
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

-- Create trigger for updated_at on document_categories
CREATE OR REPLACE FUNCTION public.update_document_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_document_categories_updated_at
  BEFORE UPDATE ON public.document_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_document_categories_updated_at();

-- Insert default statuses for existing categories
INSERT INTO public.document_statuses (category_id, status_name, status_color, is_default, sort_order)
SELECT id, 'Pending', '#f59e0b', true, 1
FROM public.document_categories
WHERE NOT EXISTS (
  SELECT 1 FROM public.document_statuses 
  WHERE category_id = document_categories.id
);

INSERT INTO public.document_statuses (category_id, status_name, status_color, is_default, sort_order)
SELECT id, 'Approved', '#10b981', false, 2
FROM public.document_categories
WHERE NOT EXISTS (
  SELECT 1 FROM public.document_statuses 
  WHERE category_id = document_categories.id AND status_name = 'Approved'
);

INSERT INTO public.document_statuses (category_id, status_name, status_color, is_default, sort_order)
SELECT id, 'Rejected', '#ef4444', false, 3
FROM public.document_categories
WHERE NOT EXISTS (
  SELECT 1 FROM public.document_statuses 
  WHERE category_id = document_categories.id AND status_name = 'Rejected'
);