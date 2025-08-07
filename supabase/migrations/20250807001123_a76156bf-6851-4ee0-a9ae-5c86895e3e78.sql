-- Add PRIMARY KEY constraint to geo_location table
ALTER TABLE geo_location ADD CONSTRAINT geo_location_pkey PRIMARY KEY (geo_code);