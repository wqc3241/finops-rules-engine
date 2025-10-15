-- Create standard_reports table
CREATE TABLE public.standard_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  report_type TEXT NOT NULL CHECK (report_type IN ('status', 'application', 'timeline', 'financial')),
  report_data JSONB NOT NULL,
  generated_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.standard_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "FS_OPS can view standard reports"
  ON public.standard_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('FS_OPS', 'FS_ADMIN', 'admin')
    )
  );

CREATE POLICY "FS_OPS can create standard reports"
  ON public.standard_reports FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
    AND EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('FS_OPS', 'FS_ADMIN', 'admin')
    )
  );

CREATE POLICY "FS_OPS can update standard reports"
  ON public.standard_reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('FS_OPS', 'FS_ADMIN', 'admin')
    )
  );

CREATE POLICY "FS_ADMIN can delete standard reports"
  ON public.standard_reports FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('FS_ADMIN', 'admin')
    )
  );

-- Indexes for performance
CREATE INDEX idx_standard_reports_type ON public.standard_reports(report_type);
CREATE INDEX idx_standard_reports_created_by ON public.standard_reports(created_by);
CREATE INDEX idx_standard_reports_generated_date ON public.standard_reports(generated_date DESC);