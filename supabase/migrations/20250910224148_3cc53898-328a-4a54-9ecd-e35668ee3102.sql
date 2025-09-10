-- Add DocuSign Template ID column to document_types table
ALTER TABLE document_types 
ADD COLUMN docusign_template_id TEXT;

-- Add comment to explain the column purpose
COMMENT ON COLUMN document_types.docusign_template_id IS 'DocuSign template ID for electronic document signing. When set, document uses DocuSign instead of file uploads.';