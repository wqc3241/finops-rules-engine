
WITH bp AS (
  SELECT
    b.financial_program_code AS program_code,
    NULLIF(UPPER(TRIM(b.geo_code)), '') AS geo_code,
    NULLIF(UPPER(TRIM(b.pricing_type)), '') AS pricing_type,
    NULLIF(UPPER(TRIM(b.credit_profile)), '') AS credit_profile,
    NULLIF(UPPER(TRIM(b.pricing_config)), '') AS pricing_config,
    b.lender_list
  FROM public.bulletin_pricing b
  WHERE b.financial_program_code IS NOT NULL
),
-- Split comma-separated lender_list into individual lenders
lenders AS (
  SELECT
    bp.program_code,
    NULLIF(UPPER(TRIM(token)), '') AS lender
  FROM bp
  CROSS JOIN LATERAL unnest(string_to_array(COALESCE(bp.lender_list, ''), ',')) AS token
),
agg_lenders AS (
  SELECT program_code, COALESCE(array_agg(DISTINCT lender ORDER BY lender), ARRAY[]::text[]) AS lenders
  FROM lenders
  WHERE lender IS NOT NULL
  GROUP BY program_code
),
agg_geos AS (
  SELECT program_code, COALESCE(array_agg(DISTINCT geo_code ORDER BY geo_code), ARRAY[]::text[]) AS geo_codes
  FROM bp
  WHERE geo_code IS NOT NULL
  GROUP BY program_code
),
agg_types AS (
  SELECT program_code, COALESCE(array_agg(DISTINCT pricing_type ORDER BY pricing_type), ARRAY[]::text[]) AS pricing_types
  FROM bp
  WHERE pricing_type IS NOT NULL
  GROUP BY program_code
),
pt_cfg AS (
  SELECT
    program_code,
    pricing_type,
    COALESCE(array_agg(DISTINCT credit_profile ORDER BY credit_profile), ARRAY[]::text[]) AS credit_profiles,
    COALESCE(array_agg(DISTINCT pricing_config ORDER BY pricing_config), ARRAY[]::text[]) AS pricing_configs
  FROM bp
  WHERE pricing_type IS NOT NULL
  GROUP BY program_code, pricing_type
),
pt_cfg_json AS (
  SELECT
    program_code,
    jsonb_object_agg(
      pricing_type,
      jsonb_build_object(
        'creditProfiles', to_jsonb(credit_profiles),
        'pricingConfigs', to_jsonb(pricing_configs)
      )
    ) AS pricingTypeConfigs
  FROM pt_cfg
  GROUP BY program_code
),
template AS (
  SELECT
    t.program_code,
    jsonb_strip_nulls(
      jsonb_build_object(
        'lenders', to_jsonb(COALESCE(al.lenders, ARRAY[]::text[])),
        'geoCodes', to_jsonb(COALESCE(ag.geo_codes, ARRAY[]::text[])),
        'pricingTypes', to_jsonb(COALESCE(at.pricing_types, ARRAY[]::text[])),
        'pricingTypeConfigs', COALESCE(pc.pricingTypeConfigs, '{}'::jsonb)
      )
    ) AS template_metadata
  FROM (SELECT DISTINCT program_code FROM bp) t
  LEFT JOIN agg_lenders al USING (program_code)
  LEFT JOIN agg_geos ag USING (program_code)
  LEFT JOIN agg_types at USING (program_code)
  LEFT JOIN pt_cfg_json pc USING (program_code)
)
UPDATE public.financial_program_configs f
SET template_metadata = template.template_metadata
FROM template
WHERE f.program_code = template.program_code;
