-- Fix product_id values with trailing newline characters in financial_products table
UPDATE financial_products 
SET product_id = replace(product_id, E'\n', '')
WHERE product_id LIKE '%' || E'\n';