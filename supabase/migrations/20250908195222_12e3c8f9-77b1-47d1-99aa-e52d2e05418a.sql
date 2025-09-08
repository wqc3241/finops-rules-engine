-- Allow FS_OPS (and admins) to manage acceptable files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'document_acceptable_files' 
      AND polname = 'FS_OPS can manage acceptable files'
  ) THEN
    CREATE POLICY "FS_OPS can manage acceptable files"
    ON public.document_acceptable_files
    FOR ALL
    USING (public.is_fs_ops_or_admin())
    WITH CHECK (public.is_fs_ops_or_admin());
  END IF;
END $$;