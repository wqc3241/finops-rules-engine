-- Function to get primary keys for a table
CREATE OR REPLACE FUNCTION get_primary_keys(table_name_param TEXT)
RETURNS TABLE(column_name TEXT) 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT kcu.column_name::TEXT
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name 
    AND tc.table_schema = kcu.table_schema
  WHERE tc.constraint_type = 'PRIMARY KEY' 
    AND tc.table_name = table_name_param
    AND tc.table_schema = 'public'
  ORDER BY kcu.ordinal_position;
END;
$$;

-- Function to get column information for a table
CREATE OR REPLACE FUNCTION get_table_columns(table_name_param TEXT)
RETURNS TABLE(
  column_name TEXT,
  data_type TEXT,
  is_nullable TEXT,
  column_default TEXT
) 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::TEXT,
    c.data_type::TEXT,
    c.is_nullable::TEXT,
    c.column_default::TEXT
  FROM information_schema.columns c
  WHERE c.table_name = table_name_param
    AND c.table_schema = 'public'
  ORDER BY c.ordinal_position;
END;
$$;