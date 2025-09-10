-- Enable FS_OPS (and admins) to manage document types
-- Insert
CREATE POLICY "FS_OPS can insert document types"
ON public.document_types
FOR INSERT
WITH CHECK (is_fs_ops_or_admin());

-- Update
CREATE POLICY "FS_OPS can update document types"
ON public.document_types
FOR UPDATE
USING (is_fs_ops_or_admin());

-- Delete
CREATE POLICY "FS_OPS can delete document types"
ON public.document_types
FOR DELETE
USING (is_fs_ops_or_admin());