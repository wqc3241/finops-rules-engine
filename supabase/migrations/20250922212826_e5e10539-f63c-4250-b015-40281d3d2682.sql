-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.generate_template_id()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id TEXT;
  counter INTEGER;
  year_suffix TEXT;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  -- Get the next sequential number for this year
  SELECT COALESCE(MAX(
    CASE 
      WHEN template_id ~ ('^TPL_' || year_suffix || '_[0-9]{3}$') 
      THEN CAST(SUBSTRING(template_id FROM '[0-9]{3}$') AS INTEGER)
      ELSE 0
    END
  ), 0) + 1
  INTO counter
  FROM public.document_templates;
  
  -- Format as TPL_YYYY_XXX
  new_id := 'TPL_' || year_suffix || '_' || LPAD(counter::TEXT, 3, '0');
  
  RETURN new_id;
END;
$$;