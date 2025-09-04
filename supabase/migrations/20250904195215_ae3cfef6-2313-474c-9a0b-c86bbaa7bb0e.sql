
-- 1) Add columns for normalized eligibility data
ALTER TABLE public.discount_rules
  ADD COLUMN IF NOT EXISTS inventory_scope text,
  ADD COLUMN IF NOT EXISTS purchase_types text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS markets_countries text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS markets_regions text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS markets_states text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS conditions_applies_to_all boolean,
  ADD COLUMN IF NOT EXISTS conditions_values text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS models_applies_to_all boolean,
  ADD COLUMN IF NOT EXISTS models_values text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS trims_applies_to_all boolean,
  ADD COLUMN IF NOT EXISTS trims_values text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS vehicle_year_applies_to_all boolean,
  ADD COLUMN IF NOT EXISTS vehicle_year_values text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS vin_list text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS config_filters jsonb NOT NULL DEFAULT '{}'::jsonb;

-- 2) One-time backfill from eligibility JSON → new columns
UPDATE public.discount_rules dr
SET
  inventory_scope = dr.eligibility->>'inventoryScope',
  purchase_types = COALESCE(ARRAY(
    SELECT jsonb_array_elements_text(dr.eligibility->'purchaseTypes')
  ), '{}'::text[]),
  markets_countries = COALESCE(ARRAY(
    SELECT jsonb_array_elements_text(dr.eligibility->'markets'->'countries')
  ), '{}'::text[]),
  markets_regions = COALESCE(ARRAY(
    SELECT jsonb_array_elements_text(dr.eligibility->'markets'->'regions')
  ), '{}'::text[]),
  markets_states = COALESCE(ARRAY(
    SELECT jsonb_array_elements_text(dr.eligibility->'markets'->'states')
  ), '{}'::text[]),
  conditions_applies_to_all = (dr.eligibility->'conditions'->>'appliesToAll')::boolean,
  conditions_values = COALESCE(ARRAY(
    SELECT jsonb_array_elements_text(dr.eligibility->'conditions'->'values')
  ), '{}'::text[]),
  models_applies_to_all = (dr.eligibility->'models'->>'appliesToAll')::boolean,
  models_values = COALESCE(ARRAY(
    SELECT jsonb_array_elements_text(dr.eligibility->'models'->'values')
  ), '{}'::text[]),
  trims_applies_to_all = (dr.eligibility->'trims'->>'appliesToAll')::boolean,
  trims_values = COALESCE(ARRAY(
    SELECT jsonb_array_elements_text(dr.eligibility->'trims'->'values')
  ), '{}'::text[]),
  vehicle_year_applies_to_all = (dr.eligibility->'vehicleYear'->>'appliesToAll')::boolean,
  vehicle_year_values = COALESCE(ARRAY(
    SELECT jsonb_array_elements_text(dr.eligibility->'vehicleYear'->'values')
  ), '{}'::text[]),
  vin_list = COALESCE(ARRAY(
    SELECT jsonb_array_elements_text(dr.eligibility->'vinList')
  ), '{}'::text[]),
  config_filters = COALESCE(dr.eligibility->'configFilters', '{}'::jsonb);

-- 3) Triggers to keep both representations in sync

-- 3a) When eligibility JSON changes, update the column fields first
CREATE OR REPLACE FUNCTION public.sync_discount_rules_columns_from_eligibility()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.inventory_scope := NEW.eligibility->>'inventoryScope';

  NEW.purchase_types := COALESCE(ARRAY(
    SELECT jsonb_array_elements_text(NEW.eligibility->'purchaseTypes')
  ), '{}'::text[]);

  NEW.markets_countries := COALESCE(ARRAY(
    SELECT jsonb_array_elements_text(NEW.eligibility->'markets'->'countries')
  ), '{}'::text[]);

  NEW.markets_regions := COALESCE(ARRAY(
    SELECT jsonb_array_elements_text(NEW.eligibility->'markets'->'regions')
  ), '{}'::text[]);

  NEW.markets_states := COALESCE(ARRAY(
    SELECT jsonb_array_elements_text(NEW.eligibility->'markets'->'states')
  ), '{}'::text[]);

  NEW.conditions_applies_to_all := (NEW.eligibility->'conditions'->>'appliesToAll')::boolean;
  NEW.conditions_values := COALESCE(ARRAY(
    SELECT jsonb_array_elements_text(NEW.eligibility->'conditions'->'values')
  ), '{}'::text[]);

  NEW.models_applies_to_all := (NEW.eligibility->'models'->>'appliesToAll')::boolean;
  NEW.models_values := COALESCE(ARRAY(
    SELECT jsonb_array_elements_text(NEW.eligibility->'models'->'values')
  ), '{}'::text[]);

  NEW.trims_applies_to_all := (NEW.eligibility->'trims'->>'appliesToAll')::boolean;
  NEW.trims_values := COALESCE(ARRAY(
    SELECT jsonb_array_elements_text(NEW.eligibility->'trims'->'values')
  ), '{}'::text[]);

  NEW.vehicle_year_applies_to_all := (NEW.eligibility->'vehicleYear'->>'appliesToAll')::boolean;
  NEW.vehicle_year_values := COALESCE(ARRAY(
    SELECT jsonb_array_elements_text(NEW.eligibility->'vehicleYear'->'values')
  ), '{}'::text[]);

  NEW.vin_list := COALESCE(ARRAY(
    SELECT jsonb_array_elements_text(NEW.eligibility->'vinList')
  ), '{}'::text[]);

  NEW.config_filters := COALESCE(NEW.eligibility->'configFilters', '{}'::jsonb);

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_01_sync_discount_rules_columns_from_eligibility ON public.discount_rules;

CREATE TRIGGER trg_01_sync_discount_rules_columns_from_eligibility
BEFORE INSERT OR UPDATE OF eligibility
ON public.discount_rules
FOR EACH ROW
EXECUTE FUNCTION public.sync_discount_rules_columns_from_eligibility();

-- 3b) When the normalized columns change, rebuild eligibility JSON from them
CREATE OR REPLACE FUNCTION public.rebuild_discount_rules_eligibility()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.eligibility :=
    jsonb_build_object(
      'conditions', jsonb_build_object(
        'appliesToAll', COALESCE(NEW.conditions_applies_to_all, false),
        'values', to_jsonb(COALESCE(NEW.conditions_values, '{}'::text[]))
      ),
      'configFilters', COALESCE(NEW.config_filters, '{}'::jsonb),
      'inventoryScope', NEW.inventory_scope,
      'markets', jsonb_build_object(
        'countries', to_jsonb(COALESCE(NEW.markets_countries, '{}'::text[])),
        'regions', to_jsonb(COALESCE(NEW.markets_regions, '{}'::text[])),
        'states', to_jsonb(COALESCE(NEW.markets_states, '{}'::text[]))
      ),
      'models', jsonb_build_object(
        'appliesToAll', COALESCE(NEW.models_applies_to_all, false),
        'values', to_jsonb(COALESCE(NEW.models_values, '{}'::text[]))
      ),
      'purchaseTypes', to_jsonb(COALESCE(NEW.purchase_types, '{}'::text[])),
      'trims', jsonb_build_object(
        'appliesToAll', COALESCE(NEW.trims_applies_to_all, false),
        'values', to_jsonb(COALESCE(NEW.trims_values, '{}'::text[]))
      ),
      'vehicleYear', jsonb_build_object(
        'appliesToAll', COALESCE(NEW.vehicle_year_applies_to_all, false),
        'values', to_jsonb(COALESCE(NEW.vehicle_year_values, '{}'::text[]))
      ),
      'vinList', to_jsonb(COALESCE(NEW.vin_list, '{}'::text[]))
    );

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_02_rebuild_discount_rules_eligibility ON public.discount_rules;

CREATE TRIGGER trg_02_rebuild_discount_rules_eligibility
BEFORE INSERT OR UPDATE OF inventory_scope, purchase_types, markets_countries, markets_regions, markets_states, 
  conditions_applies_to_all, conditions_values, models_applies_to_all, models_values, 
  trims_applies_to_all, trims_values, vehicle_year_applies_to_all, vehicle_year_values, vin_list, config_filters
ON public.discount_rules
FOR EACH ROW
EXECUTE FUNCTION public.rebuild_discount_rules_eligibility();
