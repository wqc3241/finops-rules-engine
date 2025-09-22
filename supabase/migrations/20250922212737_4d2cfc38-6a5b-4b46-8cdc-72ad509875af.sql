-- Create document templates table
CREATE TABLE public.document_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('docusign', 'lucid_html')),
  template_id TEXT NOT NULL UNIQUE,
  template_content TEXT,
  docusign_template_id TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "FS_ADMIN can manage all templates" 
ON public.document_templates 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_ADMIN', 'admin')
  )
);

CREATE POLICY "FS_OPS can view templates" 
ON public.document_templates 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_document_templates_updated_at
  BEFORE UPDATE ON public.document_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate template ID
CREATE OR REPLACE FUNCTION public.generate_template_id()
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- Add template_id foreign key to document_types table
ALTER TABLE public.document_types 
ADD COLUMN template_id UUID REFERENCES public.document_templates(id);

-- Create index for better performance
CREATE INDEX idx_document_templates_template_id ON public.document_templates(template_id);
CREATE INDEX idx_document_templates_type ON public.document_templates(template_type);
CREATE INDEX idx_document_types_template_id ON public.document_types(template_id);