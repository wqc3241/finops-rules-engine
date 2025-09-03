-- First check for foreign key constraints on documents table
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
      AND tc.table_name='documents'
      AND tc.table_schema='public';

-- Drop the foreign key constraint if it exists
ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_application_id_fkey;

-- Change application_id from UUID to TEXT to support both mock string IDs and real UUIDs
ALTER TABLE documents ALTER COLUMN application_id TYPE TEXT USING application_id::TEXT;