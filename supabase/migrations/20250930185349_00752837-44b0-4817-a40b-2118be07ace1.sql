-- Add is_lender_specific column to pricing_types table
ALTER TABLE public.pricing_types 
ADD COLUMN IF NOT EXISTS is_lender_specific BOOLEAN NOT NULL DEFAULT true;

-- Add comment to explain the column
COMMENT ON COLUMN public.pricing_types.is_lender_specific IS 
'Determines if pricing type requires lender-specific configuration. If false, applies to all lenders without lender column in bulletin templates.';

-- Update existing pricing types to be lender-specific by default
UPDATE public.pricing_types SET is_lender_specific = true WHERE is_lender_specific IS NULL;