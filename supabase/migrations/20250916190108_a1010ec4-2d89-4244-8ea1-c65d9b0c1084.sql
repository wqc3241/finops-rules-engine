-- Fix the function search path issue for security
CREATE OR REPLACE FUNCTION public.user_can_manage_category(category_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    CASE 
      WHEN array_length(dc.allowed_teams, 1) IS NULL OR array_length(dc.allowed_teams, 1) = 0 THEN true
      ELSE EXISTS (
        SELECT 1 
        FROM user_profiles up 
        WHERE up.user_id = auth.uid() 
        AND (up.role::text = ANY(dc.allowed_teams) OR up.role IN ('FS_ADMIN', 'admin'))
      )
    END
  FROM document_categories dc 
  WHERE dc.id = category_id;
$$;