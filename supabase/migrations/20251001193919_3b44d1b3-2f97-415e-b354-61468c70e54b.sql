-- Drop existing advertised_offers table and recreate with comprehensive schema
DROP TABLE IF EXISTS public.advertised_offers CASCADE;

CREATE TABLE public.advertised_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  offer_name text NOT NULL,
  financial_program_code text NOT NULL,
  lender text,
  
  -- Offer Configuration  
  order_type text NOT NULL,
  term integer NOT NULL,
  down_payment numeric,
  credit_score_min integer,
  credit_score_max integer,
  annual_mileage integer,
  
  -- Financial Details (calculated/derived)
  loan_amount_per_10k text,
  total_cost_of_credit text,
  monthly_payment numeric,
  apr numeric,
  
  -- Disclosure & Marketing
  disclosure text,
  marketing_description text,
  
  -- Time Range
  offer_start_date timestamp with time zone,
  offer_end_date timestamp with time zone,
  
  -- Status & Metadata
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.advertised_offers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "FS_OPS can view advertised offers"
ON public.advertised_offers FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

CREATE POLICY "FS_OPS can create advertised offers"
ON public.advertised_offers FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

CREATE POLICY "FS_OPS can update advertised offers"
ON public.advertised_offers FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

CREATE POLICY "FS_ADMIN can delete advertised offers"
ON public.advertised_offers FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND role IN ('FS_ADMIN', 'admin')
  )
);

-- Add updated_at trigger
CREATE TRIGGER update_advertised_offers_updated_at
BEFORE UPDATE ON public.advertised_offers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();