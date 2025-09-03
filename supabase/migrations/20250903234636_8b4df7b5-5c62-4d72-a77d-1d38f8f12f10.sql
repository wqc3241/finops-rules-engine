-- Change application_id from UUID to TEXT to support both mock string IDs and real UUIDs
ALTER TABLE documents ALTER COLUMN application_id TYPE TEXT USING application_id::TEXT;