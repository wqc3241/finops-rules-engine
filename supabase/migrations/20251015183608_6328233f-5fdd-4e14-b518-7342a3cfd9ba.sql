-- Phase 1: Update dashboard_components schema to support dynamic data sources

-- Change data_source from TEXT to JSONB to store structured configuration
ALTER TABLE dashboard_components 
ALTER COLUMN data_source TYPE jsonb USING 
  CASE 
    WHEN data_source IS NULL THEN NULL
    WHEN data_source = '' THEN NULL
    ELSE jsonb_build_object('type', 'legacy', 'value', data_source)
  END;

-- Create function to get all public tables
CREATE OR REPLACE FUNCTION get_all_tables()
RETURNS TABLE(table_name text, table_type text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT t.table_name::text, t.table_type::text
  FROM information_schema.tables t
  WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
  ORDER BY t.table_name;
END;
$$;