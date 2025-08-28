-- Update pricing_types table to properly support financial products relationships
-- First ensure the column exists and is properly typed
ALTER TABLE pricing_types 
ADD COLUMN IF NOT EXISTS financial_products_list text[];

-- Add some sample data to demonstrate the relationships
-- This shows which financial products each pricing type supports
UPDATE pricing_types 
SET financial_products_list = ARRAY['USLN', 'USLE'] 
WHERE type_code = 'STDAPR';

UPDATE pricing_types 
SET financial_products_list = ARRAY['USLN'] 
WHERE type_code = 'BUYRATE';

UPDATE pricing_types 
SET financial_products_list = ARRAY['USLE'] 
WHERE type_code = 'RESIDUAL';

-- Ensure all pricing types have at least an empty array
UPDATE pricing_types 
SET financial_products_list = ARRAY[]::text[] 
WHERE financial_products_list IS NULL;