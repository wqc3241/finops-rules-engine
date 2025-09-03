-- Add new columns to document_types table first
ALTER TABLE document_types 
ADD COLUMN IF NOT EXISTS is_internal_only boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS product_types text[] DEFAULT '{}';

-- Migrate existing data from categories to their associated document types
UPDATE document_types 
SET 
  is_internal_only = COALESCE(dc.is_internal_only, false),
  product_types = COALESCE(dc.product_types, '{}')
FROM document_categories dc 
WHERE document_types.category_id = dc.id;

-- Remove the columns from document_categories table
ALTER TABLE document_categories 
DROP COLUMN IF EXISTS is_required,
DROP COLUMN IF EXISTS requires_signature, 
DROP COLUMN IF EXISTS is_internal_only,
DROP COLUMN IF EXISTS product_types;