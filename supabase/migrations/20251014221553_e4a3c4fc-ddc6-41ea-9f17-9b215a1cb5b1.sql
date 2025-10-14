-- Create custom_dashboards table for persistent storage
CREATE TABLE public.custom_dashboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  widgets jsonb DEFAULT '[]'::jsonb,
  layout_config jsonb
);

-- Enable RLS
ALTER TABLE public.custom_dashboards ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own custom dashboards"
  ON public.custom_dashboards FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own custom dashboards"
  ON public.custom_dashboards FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own custom dashboards"
  ON public.custom_dashboards FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own custom dashboards"
  ON public.custom_dashboards FOR DELETE
  USING (auth.uid() = created_by);

-- Add updated_at trigger
CREATE TRIGGER update_custom_dashboards_updated_at
  BEFORE UPDATE ON public.custom_dashboards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();