-- Add new team roles to the user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'SALES';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'ORDER_OPS';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'SERVICE';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'REMARKETING';

-- Add allowed_teams column to document_categories table
ALTER TABLE public.document_categories 
ADD COLUMN allowed_teams user_role[] DEFAULT '{}';

-- Create index for better performance on team filtering
CREATE INDEX IF NOT EXISTS idx_document_categories_allowed_teams 
ON public.document_categories USING GIN(allowed_teams);

-- Create function to check if user belongs to allowed teams for a category
CREATE OR REPLACE FUNCTION public.user_can_manage_category(category_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE 
      WHEN array_length(dc.allowed_teams, 1) IS NULL OR array_length(dc.allowed_teams, 1) = 0 THEN true
      ELSE EXISTS (
        SELECT 1 
        FROM user_profiles up 
        WHERE up.user_id = auth.uid() 
        AND (up.role = ANY(dc.allowed_teams) OR up.role IN ('FS_ADMIN', 'admin'))
      )
    END
  FROM document_categories dc 
  WHERE dc.id = category_id;
$$;

-- Update RLS policies for document_categories to include team checks
DROP POLICY IF EXISTS "FS_ADMIN can manage categories" ON public.document_categories;
DROP POLICY IF EXISTS "FS_OPS can view categories" ON public.document_categories;

CREATE POLICY "Users can view categories they have access to"
ON public.document_categories
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM user_profiles
    WHERE user_id = auth.uid()
    AND role = ANY(ARRAY['FS_OPS'::user_role, 'FS_ADMIN'::user_role, 'admin'::user_role, 'SALES'::user_role, 'ORDER_OPS'::user_role, 'SERVICE'::user_role, 'REMARKETING'::user_role])
  )
);

CREATE POLICY "Admins can manage all categories"
ON public.document_categories
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM user_profiles
    WHERE user_id = auth.uid()
    AND role = ANY(ARRAY['FS_ADMIN'::user_role, 'admin'::user_role])
  )
);

CREATE POLICY "Team members can manage their categories"
ON public.document_categories
FOR ALL
USING (
  public.user_can_manage_category(id)
);

-- Update document_types RLS to respect category team permissions
DROP POLICY IF EXISTS "FS_OPS can insert document types" ON public.document_types;
DROP POLICY IF EXISTS "FS_OPS can update document types" ON public.document_types;
DROP POLICY IF EXISTS "FS_OPS can delete document types" ON public.document_types;

CREATE POLICY "Users can manage document types for their categories"
ON public.document_types
FOR ALL
USING (
  public.user_can_manage_category(category_id) OR
  EXISTS (
    SELECT 1
    FROM user_profiles
    WHERE user_id = auth.uid()
    AND role = ANY(ARRAY['FS_ADMIN'::user_role, 'admin'::user_role])
  )
);