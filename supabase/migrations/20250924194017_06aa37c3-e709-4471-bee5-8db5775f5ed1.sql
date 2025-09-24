-- Add document versioning support
ALTER TABLE public.documents 
ADD COLUMN version_number INTEGER DEFAULT 1,
ADD COLUMN parent_document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
ADD COLUMN generation_count INTEGER DEFAULT 1,
ADD COLUMN is_generated BOOLEAN DEFAULT false,
ADD COLUMN generated_from_template_id UUID REFERENCES public.document_templates(id) ON DELETE SET NULL;

-- Create index for better performance on version queries
CREATE INDEX idx_documents_parent_document_id ON public.documents(parent_document_id);
CREATE INDEX idx_documents_application_type ON public.documents(application_id, document_type_id);

-- Clean up duplicate documents (keeping the most recent one for each document type per application)
WITH ranked_docs AS (
  SELECT id, 
         ROW_NUMBER() OVER (
           PARTITION BY application_id, document_type_id 
           ORDER BY created_at DESC, updated_at DESC NULLS LAST
         ) as rn
  FROM public.documents
  WHERE application_id IS NOT NULL 
    AND document_type_id IS NOT NULL
)
DELETE FROM public.documents 
WHERE id IN (
  SELECT id FROM ranked_docs WHERE rn > 1
);

-- Add constraint to prevent duplicate document types per application for new documents (excluding versions)
CREATE UNIQUE INDEX unique_document_type_per_application 
ON public.documents(application_id, document_type_id) 
WHERE parent_document_id IS NULL;