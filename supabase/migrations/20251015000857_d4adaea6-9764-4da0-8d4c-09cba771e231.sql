-- Phase 1: Complete Database Schema for LFS Dashboards Module

-- 1.1 Create dashboard_folders table
CREATE TABLE IF NOT EXISTS dashboard_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  access_roles JSONB DEFAULT '[]'::jsonb,
  parent_id UUID REFERENCES dashboard_folders(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on dashboard_folders
ALTER TABLE dashboard_folders ENABLE ROW LEVEL SECURITY;

-- RLS: Users see folders matching their role
CREATE POLICY "Users see folders matching their role"
  ON dashboard_folders FOR SELECT
  USING (
    access_roles IS NULL 
    OR access_roles = '[]'::jsonb
    OR EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role::text = ANY(
        SELECT jsonb_array_elements_text(access_roles)
      )
    )
  );

-- RLS: Admins can manage all folders
CREATE POLICY "Admins can manage all folders"
  ON dashboard_folders FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS: Users can create folders
CREATE POLICY "Users can create folders"
  ON dashboard_folders FOR INSERT
  WITH CHECK (auth.uid() = created_by AND is_fs_ops_or_admin());

-- 1.2 Update custom_dashboards table with new columns
ALTER TABLE custom_dashboards
  ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES dashboard_folders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS run_as TEXT DEFAULT 'viewer' CHECK (run_as IN ('viewer', 'owner')),
  ADD COLUMN IF NOT EXISTS filters JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS last_refreshed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing RLS policies for folder-based access
DROP POLICY IF EXISTS "Users can view their own custom dashboards" ON custom_dashboards;
DROP POLICY IF EXISTS "Users can delete their own custom dashboards" ON custom_dashboards;
DROP POLICY IF EXISTS "Users can update their own custom dashboards" ON custom_dashboards;
DROP POLICY IF EXISTS "Users can create their own custom dashboards" ON custom_dashboards;

CREATE POLICY "Users can view dashboards in accessible folders"
  ON custom_dashboards FOR SELECT
  USING (
    created_by = auth.uid()
    OR folder_id IS NULL
    OR EXISTS (
      SELECT 1 FROM dashboard_folders df
      WHERE df.id = folder_id
      AND (
        df.access_roles IS NULL 
        OR df.access_roles = '[]'::jsonb
        OR EXISTS (
          SELECT 1 FROM user_profiles up
          WHERE up.user_id = auth.uid()
          AND up.role::text = ANY(
            SELECT jsonb_array_elements_text(df.access_roles)
          )
        )
      )
    )
  );

CREATE POLICY "Users can create their own dashboards"
  ON custom_dashboards FOR INSERT
  WITH CHECK (auth.uid() = created_by AND is_fs_ops_or_admin());

CREATE POLICY "Users can update their own dashboards"
  ON custom_dashboards FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own dashboards"
  ON custom_dashboards FOR DELETE
  USING (auth.uid() = created_by);

-- 1.3 Create dashboard_components table
CREATE TABLE IF NOT EXISTS dashboard_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id UUID REFERENCES custom_dashboards(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('chart', 'table', 'metric', 'gauge')),
  title TEXT NOT NULL,
  data_source TEXT,
  visualization_config JSONB DEFAULT '{}'::jsonb,
  filter_bindings JSONB DEFAULT '[]'::jsonb,
  position JSONB DEFAULT '{"x":0,"y":0,"w":4,"h":2}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE dashboard_components ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view components of accessible dashboards
CREATE POLICY "Users can view components of accessible dashboards"
  ON dashboard_components FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM custom_dashboards d
      WHERE d.id = dashboard_id
      AND (
        d.created_by = auth.uid()
        OR d.folder_id IS NULL
        OR EXISTS (
          SELECT 1 FROM dashboard_folders df
          WHERE df.id = d.folder_id
          AND (
            df.access_roles IS NULL 
            OR df.access_roles = '[]'::jsonb
            OR EXISTS (
              SELECT 1 FROM user_profiles up
              WHERE up.user_id = auth.uid()
              AND up.role::text = ANY(
                SELECT jsonb_array_elements_text(df.access_roles)
              )
            )
          )
        )
      )
    )
  );

-- RLS: Users can manage components of their dashboards
CREATE POLICY "Users can manage components of their dashboards"
  ON dashboard_components FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM custom_dashboards
      WHERE id = dashboard_id AND created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM custom_dashboards
      WHERE id = dashboard_id AND created_by = auth.uid()
    )
  );

-- 1.4 Create dashboard_audit_log table
CREATE TABLE IF NOT EXISTS dashboard_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id UUID REFERENCES custom_dashboards(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'refresh', 'view')),
  details JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE dashboard_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS: Admins can view all audit logs
CREATE POLICY "Admins can view all audit logs"
  ON dashboard_audit_log FOR SELECT
  USING (is_admin());

-- RLS: Users can view their own actions
CREATE POLICY "Users can view their own actions"
  ON dashboard_audit_log FOR SELECT
  USING (user_id = auth.uid());

-- RLS: System can insert audit logs
CREATE POLICY "System can insert audit logs"
  ON dashboard_audit_log FOR INSERT
  WITH CHECK (true);

-- 1.5 Create audit trigger function
CREATE OR REPLACE FUNCTION log_dashboard_action()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO dashboard_audit_log (dashboard_id, user_id, action, details)
  VALUES (
    COALESCE(NEW.id, OLD.id),
    auth.uid(),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'create'
      WHEN TG_OP = 'UPDATE' THEN 'update'
      WHEN TG_OP = 'DELETE' THEN 'delete'
    END,
    jsonb_build_object(
      'operation', TG_OP,
      'table', TG_TABLE_NAME,
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    )
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger on custom_dashboards
DROP TRIGGER IF EXISTS audit_dashboard_changes ON custom_dashboards;
CREATE TRIGGER audit_dashboard_changes
  AFTER INSERT OR UPDATE OR DELETE ON custom_dashboards
  FOR EACH ROW EXECUTE FUNCTION log_dashboard_action();

-- Create trigger on dashboard_components
DROP TRIGGER IF EXISTS audit_component_changes ON dashboard_components;
CREATE TRIGGER audit_component_changes
  AFTER INSERT OR UPDATE OR DELETE ON dashboard_components
  FOR EACH ROW EXECUTE FUNCTION log_dashboard_action();

-- Create trigger on dashboard_folders
DROP TRIGGER IF EXISTS audit_folder_changes ON dashboard_folders;
CREATE TRIGGER audit_folder_changes
  AFTER INSERT OR UPDATE OR DELETE ON dashboard_folders
  FOR EACH ROW EXECUTE FUNCTION log_dashboard_action();

-- Add updated_at triggers
CREATE TRIGGER update_dashboard_folders_updated_at
  BEFORE UPDATE ON dashboard_folders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_components_updated_at
  BEFORE UPDATE ON dashboard_components
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();