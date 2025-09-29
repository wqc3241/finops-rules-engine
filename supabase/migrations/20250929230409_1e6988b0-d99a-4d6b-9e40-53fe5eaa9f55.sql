-- Create deployment_versions table
CREATE TABLE deployment_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_number TEXT NOT NULL UNIQUE,
  deployed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deployed_by UUID REFERENCES auth.users(id),
  deployment_type TEXT NOT NULL CHECK (deployment_type IN ('auto', 'manual')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'deployed', 'active', 'reverted')),
  change_request_ids JSONB DEFAULT '[]'::jsonb,
  snapshot_metadata JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  is_rollback BOOLEAN DEFAULT false,
  parent_version_id UUID REFERENCES deployment_versions(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on deployment_versions
ALTER TABLE deployment_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deployment_versions
CREATE POLICY "FS_ADMIN can manage versions" ON deployment_versions
  FOR ALL USING (is_admin());

CREATE POLICY "FS_OPS can view versions" ON deployment_versions
  FOR SELECT USING (is_fs_ops_or_admin());

-- Create deployment_schedule table
CREATE TABLE deployment_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_time TIME NOT NULL DEFAULT '23:59:00',
  timezone TEXT NOT NULL DEFAULT 'America/Los_Angeles',
  is_enabled BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default schedule
INSERT INTO deployment_schedule (schedule_time, timezone, is_enabled)
VALUES ('23:59:00', 'America/Los_Angeles', true);

-- Enable RLS on deployment_schedule
ALTER TABLE deployment_schedule ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deployment_schedule
CREATE POLICY "FS_ADMIN can manage schedule" ON deployment_schedule
  FOR ALL USING (is_admin());

CREATE POLICY "FS_OPS can view schedule" ON deployment_schedule
  FOR SELECT USING (is_fs_ops_or_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_deployment_schedule_updated_at
  BEFORE UPDATE ON deployment_schedule
  FOR EACH ROW
  EXECUTE FUNCTION tg_set_updated_at();

-- Update change_requests table with deployment columns
ALTER TABLE change_requests 
  ADD COLUMN deployment_version_id UUID REFERENCES deployment_versions(id),
  ADD COLUMN deployed_at TIMESTAMPTZ;

-- Create index for faster lookups
CREATE INDEX idx_change_requests_deployment ON change_requests(deployment_version_id);
CREATE INDEX idx_deployment_versions_deployed_at ON deployment_versions(deployed_at DESC);
CREATE INDEX idx_deployment_versions_status ON deployment_versions(status);