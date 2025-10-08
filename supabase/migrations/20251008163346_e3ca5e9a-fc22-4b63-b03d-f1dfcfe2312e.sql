-- Create pending_advertised_offers table
CREATE TABLE public.pending_advertised_offers (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  offer_name text NOT NULL,
  financial_program_code text NOT NULL,
  order_type text NOT NULL,
  term integer NOT NULL,
  down_payment numeric,
  credit_score_min integer,
  credit_score_max integer,
  annual_mileage integer,
  loan_amount_per_10k text,
  total_cost_of_credit text,
  monthly_payment numeric,
  apr numeric,
  disclosure text,
  marketing_description text,
  offer_start_date timestamp with time zone,
  offer_end_date timestamp with time zone,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  lender text,
  applicable_discounts text[],
  request_id uuid NOT NULL REFERENCES public.change_requests(id) ON DELETE CASCADE,
  original_offer_id uuid
);

-- Enable RLS
ALTER TABLE public.pending_advertised_offers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "FS_OPS can insert pending offers"
ON public.pending_advertised_offers FOR INSERT
WITH CHECK (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

CREATE POLICY "FS_OPS can view pending offers"
ON public.pending_advertised_offers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid() 
    AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
  )
);

CREATE POLICY "FS_ADMIN can delete pending offers"
ON public.pending_advertised_offers FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid() 
    AND role IN ('FS_ADMIN', 'admin')
  )
);

-- Index for performance
CREATE INDEX idx_pending_advertised_offers_request_id 
ON public.pending_advertised_offers(request_id);