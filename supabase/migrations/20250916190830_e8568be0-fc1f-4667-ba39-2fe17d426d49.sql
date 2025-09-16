-- First, let's see what foreign keys exist on the documents table
SELECT 
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'documents' AND constraint_type = 'FOREIGN KEY';

-- Add CASCADE delete to the foreign key constraint so when a category is deleted, 
-- its associated documents are also deleted
ALTER TABLE documents 
DROP CONSTRAINT IF EXISTS documents_category_id_fkey;

ALTER TABLE documents 
ADD CONSTRAINT documents_category_id_fkey 
FOREIGN KEY (category_id) 
REFERENCES document_categories(id) 
ON DELETE CASCADE;

-- Also handle document_types foreign key constraint
ALTER TABLE document_types 
DROP CONSTRAINT IF EXISTS document_types_category_id_fkey;

ALTER TABLE document_types 
ADD CONSTRAINT document_types_category_id_fkey 
FOREIGN KEY (category_id) 
REFERENCES document_categories(id) 
ON DELETE CASCADE;