-- Move configuration parameters from document_categories to document_types

-- First, migrate existing data from categories to their associated document types
UPDATE document_types 
SET 
  is_internal_only = dc.is_internal_only,
  product_types = dc.product_types
FROM document_categories dc 
WHERE document_types.category_id = dc.id;

-- Remove the columns from document_categories table
ALTER TABLE document_categories 
DROP COLUMN IF EXISTS is_required,
DROP COLUMN IF EXISTS requires_signature, 
DROP COLUMN IF EXISTS is_internal_only,
DROP COLUMN IF EXISTS product_types;

-- Add the missing columns to document_types table if they don't exist
-- (is_required and requires_signature already exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'document_types' AND column_name = 'is_internal_only') THEN
    ALTER TABLE document_types ADD COLUMN is_internal_only boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'document_types' AND column_name = 'product_types') THEN
    ALTER TABLE document_types ADD COLUMN product_types text[] DEFAULT '{}';
  END IF;
END $$;