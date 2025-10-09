-- Create analytics_events table for tracking user actions
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  properties JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for querying
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event ON public.analytics_events(event);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON public.analytics_events(timestamp);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own events
CREATE POLICY "Users can view own analytics"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: System can insert events
CREATE POLICY "System can insert analytics"
  ON public.analytics_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all analytics
CREATE POLICY "Admins can view all analytics"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND role IN ('FS_ADMIN', 'admin')
    )
  );

-- Create feature_flags table for system-wide toggles
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  use_supabase_applications BOOLEAN DEFAULT true,
  enable_realtime_sync BOOLEAN DEFAULT true,
  enable_date_range_filter BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default row
INSERT INTO public.feature_flags (id) 
VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read
CREATE POLICY "Everyone can read feature flags"
  ON public.feature_flags
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only admins can update
CREATE POLICY "Admins can update feature flags"
  ON public.feature_flags
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND role IN ('FS_ADMIN', 'admin')
    )
  );