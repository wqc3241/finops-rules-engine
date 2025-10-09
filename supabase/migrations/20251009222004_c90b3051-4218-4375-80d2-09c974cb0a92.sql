-- Phase 1: Database Schema Enhancement

-- Add missing columns to applications table
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'US',
  ADD COLUMN IF NOT EXISTS original_application_id UUID,
  ADD COLUMN IF NOT EXISTS parent_application_id UUID;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_type ON applications(type);
CREATE INDEX IF NOT EXISTS idx_applications_state ON applications(state);
CREATE INDEX IF NOT EXISTS idx_applications_country ON applications(country);
CREATE INDEX IF NOT EXISTS idx_applications_date ON applications(date DESC);
CREATE INDEX IF NOT EXISTS idx_applications_parent ON applications(parent_application_id);

-- Add foreign key for reapplication chain
ALTER TABLE public.applications
  ADD CONSTRAINT fk_parent_application
  FOREIGN KEY (parent_application_id)
  REFERENCES applications(id)
  ON DELETE SET NULL;

-- Create user preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  sort_option TEXT DEFAULT 'date',
  sort_direction TEXT DEFAULT 'desc' CHECK (sort_direction IN ('asc', 'desc')),
  status_filters JSONB DEFAULT '[]',
  type_filters JSONB DEFAULT '[]',
  state_filters JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on user_preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Auto-update timestamp for user_preferences
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for key tables
ALTER TABLE applications REPLICA IDENTITY FULL;
ALTER TABLE application_notes REPLICA IDENTITY FULL;
ALTER TABLE application_history REPLICA IDENTITY FULL;