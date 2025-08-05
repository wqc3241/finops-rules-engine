-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE application_status AS ENUM (
  'Pending', 'Submitted', 'Approved', 'Conditionally Approved', 
  'Declined', 'Booked', 'Funded', 'Pending Signature', 'Pending Reapply'
);

CREATE TYPE application_type AS ENUM ('Lease', 'Loan');
CREATE TYPE financial_type AS ENUM ('Lease', 'Loan');
CREATE TYPE deal_status AS ENUM ('requested', 'approved', 'customer');
CREATE TYPE app_role AS ENUM ('admin', 'user', 'manager');

-- Core Applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  status application_status NOT NULL DEFAULT 'Pending',
  type application_type NOT NULL,
  amount DECIMAL(12,2),
  state TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reapply_enabled BOOLEAN DEFAULT FALSE,
  reapplication_sequence INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Application Details table
CREATE TABLE public.application_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  order_number TEXT,
  model TEXT,
  edition TEXT,
  ordered_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applicant Info table
CREATE TABLE public.applicant_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  is_co_applicant BOOLEAN DEFAULT FALSE,
  relationship TEXT,
  first_name TEXT,
  middle_name TEXT,
  last_name TEXT,
  email_address TEXT,
  contact_number TEXT,
  dob TEXT,
  residence_type TEXT,
  housing_payment_amount TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  employment_type TEXT,
  employer_name TEXT,
  job_title TEXT,
  income_amount TEXT,
  other_source_of_income TEXT,
  other_income_amount TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicle Data table
CREATE TABLE public.vehicle_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  vin TEXT,
  trim TEXT,
  year TEXT,
  model TEXT,
  msrp TEXT,
  gcc_cash_price TEXT,
  applicable_discounts TEXT,
  total_discount_amount TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- App DT References table
CREATE TABLE public.app_dt_references (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  dt_portal_state TEXT,
  dt_id TEXT,
  application_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Details table
CREATE TABLE public.order_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  delivery_date TEXT,
  vehicle_trade_in_year TEXT,
  vehicle_trade_in_make TEXT,
  vehicle_trade_in_model TEXT,
  vehicle_trade_in_mileage TEXT,
  vehicle_trade_in_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Details Registration Data
CREATE TABLE public.order_registration_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_detail_id UUID REFERENCES public.order_details(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Details Sale Data
CREATE TABLE public.order_sale_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_detail_id UUID REFERENCES public.order_details(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Details Tax and Fee Data
CREATE TABLE public.order_tax_fee_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_detail_id UUID REFERENCES public.order_details(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Details Credits Data
CREATE TABLE public.order_credits_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_detail_id UUID REFERENCES public.order_details(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Application History table
CREATE TABLE public.application_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Application Notes table
CREATE TABLE public.application_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Summaries table
CREATE TABLE public.financial_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  type financial_type NOT NULL,
  active_tab TEXT DEFAULT 'Approved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Summary Data table (for requested, approved, customer tabs)
CREATE TABLE public.financial_summary_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  financial_summary_id UUID REFERENCES public.financial_summaries(id) ON DELETE CASCADE,
  tab_type TEXT NOT NULL, -- 'requested', 'approved', 'customer'
  data_key TEXT NOT NULL,
  data_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deal Structure table
CREATE TABLE public.deal_structures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deal Structure Offers table
CREATE TABLE public.deal_structure_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_structure_id UUID REFERENCES public.deal_structures(id) ON DELETE CASCADE,
  lender_name TEXT NOT NULL,
  status deal_status NOT NULL DEFAULT 'requested',
  decision TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deal Structure Parameters table
CREATE TABLE public.deal_structure_parameters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_offer_id UUID REFERENCES public.deal_structure_offers(id) ON DELETE CASCADE,
  parameter_key TEXT NOT NULL,
  parameter_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deal Stipulations table
CREATE TABLE public.deal_stipulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_offer_id UUID REFERENCES public.deal_structure_offers(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document Categories table
CREATE TABLE public.document_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.document_categories(id),
  name TEXT NOT NULL,
  uploaded_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'Pending',
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lenders table
CREATE TABLE public.lenders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lender_name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gateways table
CREATE TABLE public.gateways (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gateway_name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dealers table
CREATE TABLE public.dealers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Countries table
CREATE TABLE public.countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_name TEXT NOT NULL,
  country_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- States table
CREATE TABLE public.states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state_name TEXT NOT NULL,
  state_code TEXT,
  country_id UUID REFERENCES public.countries(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Location Geo table
CREATE TABLE public.location_geo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_name TEXT NOT NULL,
  geo_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pricing Types table
CREATE TABLE public.pricing_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type_code TEXT NOT NULL UNIQUE,
  type_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Products table
CREATE TABLE public.financial_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_type TEXT NOT NULL,
  product_subtype TEXT,
  geo_code TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit Profiles table
CREATE TABLE public.credit_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  priority INTEGER,
  min_credit_score INTEGER,
  max_credit_score INTEGER,
  min_income DECIMAL(12,2),
  max_income DECIMAL(12,2),
  min_age INTEGER,
  max_age INTEGER,
  min_pti DECIMAL(5,2),
  max_pti DECIMAL(5,2),
  min_dti DECIMAL(5,2),
  max_dti DECIMAL(5,2),
  employment_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pricing Configs table
CREATE TABLE public.pricing_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  min_ltv DECIMAL(5,2),
  max_ltv DECIMAL(5,2),
  min_term INTEGER,
  max_term INTEGER,
  min_lease_mileage INTEGER,
  max_lease_mileage INTEGER,
  priority INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Program Configs table
CREATE TABLE public.financial_program_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_code TEXT NOT NULL,
  clone_from TEXT,
  priority INTEGER,
  financial_product_id TEXT,
  product_type TEXT,
  vehicle_style_id TEXT,
  financing_vehicle_condition TEXT,
  program_start_date TEXT,
  program_end_date TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  order_types TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bulletin Pricing table
CREATE TABLE public.bulletin_pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  financial_program_code TEXT,
  program_id TEXT,
  pricing_config TEXT,
  geo_code TEXT,
  lender_name TEXT,
  advertised BOOLEAN DEFAULT FALSE,
  pricing_type TEXT,
  pricing_value DECIMAL(10,4),
  upload_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Advertised Offers table
CREATE TABLE public.advertised_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bulletin_pricing_id TEXT,
  disclosure TEXT,
  loan_amount_per_10k TEXT,
  total_cost_of_credit TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lease Configs table
CREATE TABLE public.lease_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicle Conditions table
CREATE TABLE public.vehicle_conditions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  condition TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicle Options table
CREATE TABLE public.vehicle_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  option_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicle Style Coding table
CREATE TABLE public.vehicle_style_coding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Types table
CREATE TABLE public.order_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type_name TEXT NOT NULL,
  type_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Routing Rules table
CREATE TABLE public.routing_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stipulations table
CREATE TABLE public.stipulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stipulation_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fee Rules table
CREATE TABLE public.fee_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fee_name TEXT NOT NULL,
  fee_type TEXT NOT NULL,
  amount DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tax Rules table
CREATE TABLE public.tax_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tax_name TEXT NOT NULL,
  tax_type TEXT NOT NULL,
  rate DECIMAL(5,2),
  geo_code TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applicant_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_dt_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_registration_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_sale_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_tax_fee_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_credits_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_summary_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_structure_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_structure_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_stipulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_geo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_program_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulletin_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertised_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lease_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_style_coding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stipulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_rules ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - can be refined later)
CREATE POLICY "Allow all operations" ON public.applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.application_details FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.applicant_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.vehicle_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.app_dt_references FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.order_details FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.order_registration_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.order_sale_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.order_tax_fee_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.order_credits_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.application_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.application_notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.financial_summaries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.financial_summary_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.deal_structures FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.deal_structure_offers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.deal_structure_parameters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.deal_stipulations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.document_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.lenders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.gateways FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.dealers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.countries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.states FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.location_geo FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.pricing_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.financial_products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.credit_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.pricing_configs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.financial_program_configs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.bulletin_pricing FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.advertised_offers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.lease_configs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.vehicle_conditions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.vehicle_options FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.vehicle_style_coding FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.order_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.routing_rules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.stipulations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.fee_rules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.tax_rules FOR ALL USING (true) WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamp
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_application_details_updated_at
  BEFORE UPDATE ON public.application_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applicant_info_updated_at
  BEFORE UPDATE ON public.applicant_info
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicle_data_updated_at
  BEFORE UPDATE ON public.vehicle_data
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_app_dt_references_updated_at
  BEFORE UPDATE ON public.app_dt_references
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_order_details_updated_at
  BEFORE UPDATE ON public.order_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financial_summaries_updated_at
  BEFORE UPDATE ON public.financial_summaries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deal_structures_updated_at
  BEFORE UPDATE ON public.deal_structures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deal_structure_offers_updated_at
  BEFORE UPDATE ON public.deal_structure_offers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();