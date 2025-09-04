
-- 1) Add flattened eligibility columns
ALTER TABLE public.discount_rules
  ADD COLUMN IF NOT EXISTS inventory_scope                text,
  ADD COLUMN IF NOT EXISTS purchase_types                 text[]              DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS markets_countries              text[]              DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS markets_regions                text[]              DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS markets_states                 text[]              DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS conditions_applies_to_all      boolean             DEFAULT false,
  ADD COLUMN IF NOT EXISTS conditions_values              text[]              DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS models_applies_to_all          boolean             DEFAULT false,
  ADD COLUMN IF NOT EXISTS models_values                  text[]              DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS trims_applies_to_all           boolean             DEFAULT false,
  ADD COLUMN IF NOT EXISTS trims_values                   text[]              DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS vehicle_year_applies_to_all    boolean             DEFAULT false,
  ADD COLUMN IF NOT EXISTS vehicle_year_values            integer[]           DEFAULT ARRAY[]::integer[],
  ADD COLUMN IF NOT EXISTS vin_list                       text[]              DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS config_filters                 jsonb               DEFAULT '{}'::jsonb;

-- 2) Backfill new columns from existing eligibility JSON
UPDATE public.discount_rules
SET
  inventory_scope             = (eligibility->'inventory'->>'scope'),
  purchase_types              = COALESCE(ARRAY(
                                     SELECT jsonb_array_elements_text(eligibility->'purchaseTypes')
                                   ), ARRAY[]::text[]),
  markets_countries           = COALESCE(ARRAY(
                                     SELECT jsonb_array_elements_text(eligibility->'markets'->'countries')
                                   ), ARRAY[]::text[]),
  markets_regions             = COALESCE(ARRAY(
                                     SELECT jsonb_array_elements_text(eligibility->'markets'->'regions')
                                   ), ARRAY[]::text[]),
  markets_states              = COALESCE(ARRAY(
                                     SELECT jsonb_array_elements_text(eligibility->'markets'->'states')
                                   ), ARRAY[]::text[]),
  conditions_applies_to_all   = COALESCE((eligibility->'conditions'->>'appliesToAll')::boolean, false),
  conditions_values           = COALESCE(ARRAY(
                                     SELECT jsonb_array_elements_text(eligibility->'conditions'->'values')
                                   ), ARRAY[]::text[]),
  models_applies_to_all       = COALESCE((eligibility->'models'->>'appliesToAll')::boolean, false),
  models_values               = COALESCE(ARRAY(
                                     SELECT jsonb_array_elements_text(eligibility->'models'->'values')
                                   ), ARRAY[]::text[]),
  trims_applies_to_all        = COALESCE((eligibility->'trims'->>'appliesToAll')::boolean, false),
  trims_values                = COALESCE(ARRAY(
                                     SELECT jsonb_array_elements_text(eligibility->'trims'->'values')
                                   ), ARRAY[]::text[]),
  vehicle_year_applies_to_all = COALESCE((eligibility->'vehicleYear'->>'appliesToAll')::boolean, false),
  vehicle_year_values         = COALESCE(ARRAY(
                                     SELECT (jsonb_array_elements_text(eligibility->'vehicleYear'->'values'))::integer
                                   ), ARRAY[]::integer[]),
  vin_list                    = COALESCE(ARRAY(
                                     SELECT jsonb_array_elements_text(eligibility->'vinList')
                                   ), ARRAY[]::text[]),
  config_filters              = COALESCE(eligibility->'configFilters', '{}'::jsonb)
WHERE eligibility IS NOT NULL;

-- 3) Trigger to sync flat columns from JSON
CREATE OR REPLACE FUNCTION public.discount_rules_sync_flat_from_json()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.eligibility IS NULL THEN
    RETURN NEW;
  END IF;

  NEW.inventory_scope             := NEW.eligibility->'inventory'->>'scope';
  NEW.purchase_types              := COALESCE(ARRAY(
                                           SELECT jsonb_array_elements_text(NEW.eligibility->'purchaseTypes')
                                         ), ARRAY[]::text[]);
  NEW.markets_countries           := COALESCE(ARRAY(
                                           SELECT jsonb_array_elements_text(NEW.eligibility->'markets'->'countries')
                                         ), ARRAY[]::text[]);
  NEW.markets_regions             := COALESCE(ARRAY(
                                           SELECT jsonb_array_elements_text(NEW.eligibility->'markets'->'regions')
                                         ), ARRAY[]::text[]);
  NEW.markets_states              := COALESCE(ARRAY(
                                           SELECT jsonb_array_elements_text(NEW.eligibility->'markets'->'states')
                                         ), ARRAY[]::text[]);
  NEW.conditions_applies_to_all   := COALESCE((NEW.eligibility->'conditions'->>'appliesToAll')::boolean, false);
  NEW.conditions_values           := COALESCE(ARRAY(
                                           SELECT jsonb_array_elements_text(NEW.eligibility->'conditions'->'values')
                                         ), ARRAY[]::text[]);
  NEW.models_applies_to_all       := COALESCE((NEW.eligibility->'models'->>'appliesToAll')::boolean, false);
  NEW.models_values               := COALESCE(ARRAY(
                                           SELECT jsonb_array_elements_text(NEW.eligibility->'models'->'values')
                                         ), ARRAY[]::text[]);
  NEW.trims_applies_to_all        := COALESCE((NEW.eligibility->'trims'->>'appliesToAll')::boolean, false);
  NEW.trims_values                := COALESCE(ARRAY(
                                           SELECT jsonb_array_elements_text(NEW.eligibility->'trims'->'values')
                                         ), ARRAY[]::text[]);
  NEW.vehicle_year_applies_to_all := COALESCE((NEW.eligibility->'vehicleYear'->>'appliesToAll')::boolean, false);
  NEW.vehicle_year_values         := COALESCE(ARRAY(
                                           SELECT (jsonb_array_elements_text(NEW.eligibility->'vehicleYear'->'values'))::integer
                                         ), ARRAY[]::integer[]);
  NEW.vin_list                    := COALESCE(ARRAY(
                                           SELECT jsonb_array_elements_text(NEW.eligibility->'vinList')
                                         ), ARRAY[]::text[]);
  NEW.config_filters              := COALESCE(NEW.eligibility->'configFilters', '{}'::jsonb);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_discount_rules_json_to_flat ON public.discount_rules;

CREATE TRIGGER trg_discount_rules_json_to_flat
BEFORE INSERT OR UPDATE OF eligibility ON public.discount_rules
FOR EACH ROW
EXECUTE FUNCTION public.discount_rules_sync_flat_from_json();

-- 4) Trigger to rebuild JSON from flat columns when they change
CREATE OR REPLACE FUNCTION public.discount_rules_sync_json_from_flat()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Build eligibility JSON if it's NULL or if flat columns were explicitly updated
  IF NEW.eligibility IS NULL OR TG_OP = 'INSERT' THEN
    NEW.eligibility :=
      jsonb_build_object(
        'inventory', jsonb_build_object('scope', to_jsonb(NEW.inventory_scope)),
        'purchaseTypes', to_jsonb(COALESCE(NEW.purchase_types, ARRAY[]::text[])),
        'markets', jsonb_build_object(
          'countries', to_jsonb(COALESCE(NEW.markets_countries, ARRAY[]::text[])),
          'regions',   to_jsonb(COALESCE(NEW.markets_regions, ARRAY[]::text[])),
          'states',    to_jsonb(COALESCE(NEW.markets_states, ARRAY[]::text[]))
        ),
        'conditions', jsonb_build_object(
          'appliesToAll', to_jsonb(COALESCE(NEW.conditions_applies_to_all, false)),
          'values',       to_jsonb(COALESCE(NEW.conditions_values, ARRAY[]::text[]))
        ),
        'models', jsonb_build_object(
          'appliesToAll', to_jsonb(COALESCE(NEW.models_applies_to_all, false)),
          'values',       to_jsonb(COALESCE(NEW.models_values, ARRAY[]::text[]))
        ),
        'trims', jsonb_build_object(
          'appliesToAll', to_jsonb(COALESCE(NEW.trims_applies_to_all, false)),
          'values',       to_jsonb(COALESCE(NEW.trims_values, ARRAY[]::text[]))
        ),
        'vehicleYear', jsonb_build_object(
          'appliesToAll', to_jsonb(COALESCE(NEW.vehicle_year_applies_to_all, false)),
          'values',       to_jsonb(COALESCE(NEW.vehicle_year_values, ARRAY[]::integer[]))
        ),
        'vinList',       to_jsonb(COALESCE(NEW.vin_list, ARRAY[]::text[])),
        'configFilters', COALESCE(NEW.config_filters, '{}'::jsonb)
      );
  ELSE
    NEW.eligibility :=
      jsonb_build_object(
        'inventory', jsonb_build_object('scope', to_jsonb(NEW.inventory_scope)),
        'purchaseTypes', to_jsonb(COALESCE(NEW.purchase_types, ARRAY[]::text[])),
        'markets', jsonb_build_object(
          'countries', to_jsonb(COALESCE(NEW.markets_countries, ARRAY[]::text[])),
          'regions',   to_jsonb(COALESCE(NEW.markets_regions, ARRAY[]::text[])),
          'states',    to_jsonb(COALESCE(NEW.markets_states, ARRAY[]::text[]))
        ),
        'conditions', jsonb_build_object(
          'appliesToAll', to_jsonb(COALESCE(NEW.conditions_applies_to_all, false)),
          'values',       to_jsonb(COALESCE(NEW.conditions_values, ARRAY[]::text[]))
        ),
        'models', jsonb_build_object(
          'appliesToAll', to_jsonb(COALESCE(NEW.models_applies_to_all, false)),
          'values',       to_jsonb(COALESCE(NEW.models_values, ARRAY[]::text[]))
        ),
        'trims', jsonb_build_object(
          'appliesToAll', to_jsonb(COALESCE(NEW.trims_applies_to_all, false)),
          'values',       to_jsonb(COALESCE(NEW.trims_values, ARRAY[]::text[]))
        ),
        'vehicleYear', jsonb_build_object(
          'appliesToAll', to_jsonb(COALESCE(NEW.vehicle_year_applies_to_all, false)),
          'values',       to_jsonb(COALESCE(NEW.vehicle_year_values, ARRAY[]::integer[]))
        ),
        'vinList',       to_jsonb(COALESCE(NEW.vin_list, ARRAY[]::text[])),
        'configFilters', COALESCE(NEW.config_filters, '{}'::jsonb)
      );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_discount_rules_flat_to_json ON public.discount_rules;

CREATE TRIGGER trg_discount_rules_flat_to_json
BEFORE INSERT OR UPDATE OF
  inventory_scope,
  purchase_types,
  markets_countries,
  markets_regions,
  markets_states,
  conditions_applies_to_all,
  conditions_values,
  models_applies_to_all,
  models_values,
  trims_applies_to_all,
  trims_values,
  vehicle_year_applies_to_all,
  vehicle_year_values,
  vin_list,
  config_filters
ON public.discount_rules
FOR EACH ROW
EXECUTE FUNCTION public.discount_rules_sync_json_from_flat();
