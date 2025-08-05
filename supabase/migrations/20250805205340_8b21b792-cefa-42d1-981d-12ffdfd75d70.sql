-- Add new columns to fee_rules table to support comprehensive fee structure
ALTER TABLE public.fee_rules 
ADD COLUMN created_by text,
ADD COLUMN fee_active boolean DEFAULT true,
ADD COLUMN fee_country text,
ADD COLUMN fee_currency text DEFAULT 'USD',
ADD COLUMN fee_state text,
ADD COLUMN fee_taxable boolean DEFAULT false,
ADD COLUMN is_deleted boolean DEFAULT false,
ADD COLUMN self_reg boolean DEFAULT false,
ADD COLUMN updated_at timestamp with time zone DEFAULT now(),
ADD COLUMN updated_by text,
ADD COLUMN fee_range_type text,
ADD COLUMN fee_ranges jsonb,
ADD COLUMN end_date timestamp with time zone,
ADD COLUMN start_date timestamp with time zone,
ADD COLUMN type text,
ADD COLUMN name text,
ADD COLUMN category text,
ADD COLUMN pay_type text,
ADD COLUMN provider text,
ADD COLUMN subcategory text,
ADD COLUMN capitalize_type text,
ADD COLUMN purchase_type_values text[],
ADD COLUMN purchase_type_applies_to_all boolean DEFAULT false,
ADD COLUMN vehicle_model_values text[],
ADD COLUMN vehicle_model_applies_to_all boolean DEFAULT false,
ADD COLUMN title_status_values text[],
ADD COLUMN title_status_applies_to_all boolean DEFAULT false,
ADD COLUMN vehicle_year_values text[],
ADD COLUMN vehicle_year_applies_to_all boolean DEFAULT false,
ADD COLUMN description text,
ADD COLUMN fee_tax_rate numeric,
ADD COLUMN pricing_version text,
ADD COLUMN migration text,
ADD COLUMN version_number integer DEFAULT 0,
ADD COLUMN is_new_experience boolean DEFAULT false,
ADD COLUMN fr_ca_translation text;

-- Create trigger for automatic updated_at timestamp
CREATE TRIGGER update_fee_rules_updated_at
    BEFORE UPDATE ON public.fee_rules
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();