-- Create function to get foreign key relationships
CREATE OR REPLACE FUNCTION public.get_foreign_keys(table_name_param text)
RETURNS TABLE(
  source_column text,
  foreign_table text,
  foreign_column text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    kcu.column_name::TEXT as source_column,
    ccu.table_name::TEXT as foreign_table,
    ccu.column_name::TEXT as foreign_column
  FROM information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
  WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public'
    AND tc.table_name = table_name_param
  ORDER BY kcu.ordinal_position;
END;
$$;

-- Add report_config column to standard_reports table
ALTER TABLE standard_reports 
ADD COLUMN IF NOT EXISTS report_config JSONB;