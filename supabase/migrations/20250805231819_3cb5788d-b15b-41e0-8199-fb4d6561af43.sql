-- Fix RLS policies for fee_rules table
-- Add comprehensive RLS policies for fee_rules
CREATE POLICY "Authenticated users can view fee rules" ON public.fee_rules FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "FS_OPS can insert fee rules" ON public.fee_rules FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);
CREATE POLICY "FS_OPS can update fee rules" ON public.fee_rules FOR UPDATE USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);
CREATE POLICY "FS_ADMIN can delete fee rules" ON public.fee_rules FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role IN ('FS_ADMIN', 'admin')
  )
);

-- Add comprehensive RLS policies for tax_rules
CREATE POLICY "Authenticated users can view tax rules" ON public.tax_rules FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "FS_OPS can insert tax rules" ON public.tax_rules FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);
CREATE POLICY "FS_OPS can update tax rules" ON public.tax_rules FOR UPDATE USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);
CREATE POLICY "FS_ADMIN can delete tax rules" ON public.tax_rules FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role IN ('FS_ADMIN', 'admin')
  )
);