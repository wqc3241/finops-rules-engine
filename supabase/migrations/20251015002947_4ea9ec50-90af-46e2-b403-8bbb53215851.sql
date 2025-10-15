-- Fix the log_dashboard_action trigger to use correct dashboard_id for different tables
CREATE OR REPLACE FUNCTION public.log_dashboard_action()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_dashboard_id UUID;
BEGIN
  -- Determine the correct dashboard_id based on the table
  IF TG_TABLE_NAME = 'dashboard_components' THEN
    target_dashboard_id := COALESCE(NEW.dashboard_id, OLD.dashboard_id);
  ELSIF TG_TABLE_NAME = 'custom_dashboards' THEN
    target_dashboard_id := COALESCE(NEW.id, OLD.id);
  ELSE
    -- For dashboard_folders or other tables, no dashboard_id
    target_dashboard_id := NULL;
  END IF;

  INSERT INTO dashboard_audit_log (dashboard_id, user_id, action, details)
  VALUES (
    target_dashboard_id,
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