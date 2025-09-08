-- Create AI generated reports table
CREATE TABLE public.ai_generated_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  query_parameters JSONB,
  report_data JSONB,
  chart_config JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI generated dashboards table
CREATE TABLE public.ai_generated_dashboards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  layout_config JSONB,
  widgets JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_generated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generated_dashboards ENABLE ROW LEVEL SECURITY;

-- Create policies for AI generated reports
CREATE POLICY "Users can view their own AI reports" 
ON public.ai_generated_reports 
FOR SELECT 
USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own AI reports" 
ON public.ai_generated_reports 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own AI reports" 
ON public.ai_generated_reports 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own AI reports" 
ON public.ai_generated_reports 
FOR DELETE 
USING (auth.uid() = created_by);

-- Create policies for AI generated dashboards
CREATE POLICY "Users can view their own AI dashboards" 
ON public.ai_generated_dashboards 
FOR SELECT 
USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own AI dashboards" 
ON public.ai_generated_dashboards 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own AI dashboards" 
ON public.ai_generated_dashboards 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own AI dashboards" 
ON public.ai_generated_dashboards 
FOR DELETE 
USING (auth.uid() = created_by);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_ai_generated_reports_updated_at
BEFORE UPDATE ON public.ai_generated_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_generated_dashboards_updated_at
BEFORE UPDATE ON public.ai_generated_dashboards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();