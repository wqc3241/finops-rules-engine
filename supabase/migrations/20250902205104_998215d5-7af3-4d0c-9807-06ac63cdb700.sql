-- Upsert NL_GDE26_0825_1 into financial_program_configs using separate CTEs per statement

-- 1) Update if exists
WITH bp AS (
  SELECT
    COALESCE(lender_list, '') AS lender_list,
    COALESCE(geo_code, '')    AS geo_code,
    COALESCE(pricing_type, '') AS pricing_type,
    COALESCE(credit_profile, '') AS credit_profile,
    COALESCE(pricing_config, '') AS pricing_config
  FROM public.bulletin_pricing
  WHERE financial_program_code = 'NL_GDE26_0825_1'
),
meta AS (
  SELECT jsonb_build_object(
    'lenders', to_jsonb(COALESCE((
      SELECT array_agg(DISTINCT trim(both ' ' FROM lender) ORDER BY trim(both ' ' FROM lender))
      FROM (
        SELECT unnest(regexp_split_to_array(lender_list, ',')) AS lender
        FROM bp
      ) lr
      WHERE trim(both ' ' FROM lender) <> ''
    ), ARRAY[]::text[])),
    'geoCodes', to_jsonb(COALESCE((
      SELECT array_agg(DISTINCT trim(both ' ' FROM geo_code) ORDER BY trim(both ' ' FROM geo_code))
      FROM bp
      WHERE trim(both ' ' FROM geo_code) <> ''
    ), ARRAY[]::text[])),
    'pricingTypes', to_jsonb(COALESCE((
      SELECT array_agg(DISTINCT trim(both ' ' FROM pricing_type) ORDER BY trim(both ' ' FROM pricing_type))
      FROM bp
      WHERE trim(both ' ' FROM pricing_type) <> ''
    ), ARRAY[]::text[])),
    'pricingTypeConfigs', COALESCE((
      SELECT jsonb_object_agg(
        t.pricing_type,
        jsonb_build_object(
          'creditProfiles', to_jsonb(t.credit_profiles),
          'pricingConfigs', to_jsonb(t.pricing_configs)
        )
      )
      FROM (
        SELECT
          trim(both ' ' FROM pricing_type) AS pricing_type,
          array_agg(DISTINCT trim(both ' ' FROM credit_profile) ORDER BY trim(both ' ' FROM credit_profile)) AS credit_profiles,
          array_agg(DISTINCT trim(both ' ' FROM pricing_config) ORDER BY trim(both ' ' FROM pricing_config)) AS pricing_configs
        FROM bp
        WHERE trim(both ' ' FROM pricing_type) <> ''
        GROUP BY trim(both ' ' FROM pricing_type)
      ) t
    ), '{}'::jsonb)
  ) AS tm
)
UPDATE public.financial_program_configs fpc
SET template_metadata = meta.tm,
    updated = now()
FROM meta
WHERE fpc.program_code = 'NL_GDE26_0825_1'
  AND EXISTS (SELECT 1 FROM bp);

-- 2) Insert if missing
WITH bp AS (
  SELECT
    COALESCE(lender_list, '') AS lender_list,
    COALESCE(geo_code, '')    AS geo_code,
    COALESCE(pricing_type, '') AS pricing_type,
    COALESCE(credit_profile, '') AS credit_profile,
    COALESCE(pricing_config, '') AS pricing_config
  FROM public.bulletin_pricing
  WHERE financial_program_code = 'NL_GDE26_0825_1'
),
meta AS (
  SELECT jsonb_build_object(
    'lenders', to_jsonb(COALESCE((
      SELECT array_agg(DISTINCT trim(both ' ' FROM lender) ORDER BY trim(both ' ' FROM lender))
      FROM (
        SELECT unnest(regexp_split_to_array(lender_list, ',')) AS lender
        FROM bp
      ) lr
      WHERE trim(both ' ' FROM lender) <> ''
    ), ARRAY[]::text[])),
    'geoCodes', to_jsonb(COALESCE((
      SELECT array_agg(DISTINCT trim(both ' ' FROM geo_code) ORDER BY trim(both ' ' FROM geo_code))
      FROM bp
      WHERE trim(both ' ' FROM geo_code) <> ''
    ), ARRAY[]::text[])),
    'pricingTypes', to_jsonb(COALESCE((
      SELECT array_agg(DISTINCT trim(both ' ' FROM pricing_type) ORDER BY trim(both ' ' FROM pricing_type))
      FROM bp
      WHERE trim(both ' ' FROM pricing_type) <> ''
    ), ARRAY[]::text[])),
    'pricingTypeConfigs', COALESCE((
      SELECT jsonb_object_agg(
        t.pricing_type,
        jsonb_build_object(
          'creditProfiles', to_jsonb(t.credit_profiles),
          'pricingConfigs', to_jsonb(t.pricing_configs)
        )
      )
      FROM (
        SELECT
          trim(both ' ' FROM pricing_type) AS pricing_type,
          array_agg(DISTINCT trim(both ' ' FROM credit_profile) ORDER BY trim(both ' ' FROM credit_profile)) AS credit_profiles,
          array_agg(DISTINCT trim(both ' ' FROM pricing_config) ORDER BY trim(both ' ' FROM pricing_config)) AS pricing_configs
        FROM bp
        WHERE trim(both ' ' FROM pricing_type) <> ''
        GROUP BY trim(both ' ' FROM pricing_type)
      ) t
    ), '{}'::jsonb)
  ) AS tm
)
INSERT INTO public.financial_program_configs (program_code, template_metadata, created_at, updated)
SELECT 'NL_GDE26_0825_1', meta.tm, now(), now()
FROM meta
WHERE NOT EXISTS (
  SELECT 1 FROM public.financial_program_configs WHERE program_code = 'NL_GDE26_0825_1'
)
AND EXISTS (SELECT 1 FROM bp);
