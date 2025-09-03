-- Add missing columns to documents table
ALTER TABLE public.documents 
ADD COLUMN IF NOT EXISTS document_type_id UUID REFERENCES public.document_types(id),
ADD COLUMN IF NOT EXISTS file_name TEXT,
ADD COLUMN IF NOT EXISTS uploaded_by TEXT,
ADD COLUMN IF NOT EXISTS last_modified TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS expiration_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add foreign key constraint to link documents to categories through document_types
-- (already exists through document_type_id -> document_types -> category_id)

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_document_type_id ON public.documents(document_type_id);
CREATE INDEX IF NOT EXISTS idx_documents_application_id ON public.documents(application_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);

-- Add unique constraint to document_categories name
ALTER TABLE public.document_categories 
ADD CONSTRAINT IF NOT EXISTS unique_category_name UNIQUE (name);

-- Add unique constraint to document_types name within category
ALTER TABLE public.document_types 
ADD CONSTRAINT IF NOT EXISTS unique_type_name_per_category UNIQUE (name, category_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS update_documents_updated_at_trigger
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION update_documents_updated_at();