-- Add applicable_discounts column to advertised_offers table
ALTER TABLE public.advertised_offers 
ADD COLUMN applicable_discounts text[] DEFAULT NULL;

COMMENT ON COLUMN public.advertised_offers.applicable_discounts IS 'Array of discount rule IDs applicable to this advertised offer';