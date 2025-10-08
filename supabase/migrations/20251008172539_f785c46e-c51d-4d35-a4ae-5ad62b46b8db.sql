-- Step 1.1: Drop lender column from pending_advertised_offers
ALTER TABLE public.pending_advertised_offers 
DROP COLUMN IF EXISTS lender;

-- Step 1.2: Change applicable_discounts to JSONB in advertised_offers
ALTER TABLE public.advertised_offers 
ALTER COLUMN applicable_discounts TYPE jsonb USING 
  CASE 
    WHEN applicable_discounts IS NULL THEN NULL
    ELSE to_jsonb(applicable_discounts)
  END;

-- Step 1.3: Change applicable_discounts to JSONB in pending_advertised_offers
ALTER TABLE public.pending_advertised_offers 
ALTER COLUMN applicable_discounts TYPE jsonb USING 
  CASE 
    WHEN applicable_discounts IS NULL THEN NULL
    ELSE to_jsonb(applicable_discounts)
  END;

-- Step 6: Clean up stuck pending records that were failing due to lender column
DELETE FROM public.pending_advertised_offers 
WHERE request_id IN ('dc10b0c3-4f53-4522-b507-e3c94b1a34db', 'c18b2d5b-6588-4bcd-ae84-affbe4e60734');