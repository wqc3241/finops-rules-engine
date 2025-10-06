-- Convert discount_rules.discount_geo to standard geo_code format

-- Convert 'ALL' to 'NA-US'
UPDATE discount_rules
SET discount_geo = 'NA-US'
WHERE discount_geo = 'ALL';

-- Convert 2-letter state codes to 'NA-US-{STATE}' format
UPDATE discount_rules
SET discount_geo = 'NA-US-' || discount_geo
WHERE discount_geo IS NOT NULL 
  AND discount_geo != 'NA-US' 
  AND length(discount_geo) = 2;

-- Handle NULL values - set to 'NA-US'
UPDATE discount_rules
SET discount_geo = 'NA-US'
WHERE discount_geo IS NULL;