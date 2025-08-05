-- Insert mock fee rules data
INSERT INTO fee_rules (fee_name, fee_type, amount, is_active) VALUES
('Documentation Fee', 'Fixed', 299, true),
('Processing Fee', 'Fixed', 150, true),
('Origination Fee', 'Percentage', 1.5, true),
('Title Fee', 'Fixed', 75, true),
('Lien Fee', 'Fixed', 45, true),
('Electronic Filing Fee', 'Fixed', 25, true),
('Dealer Handling Fee', 'Fixed', 199, true),
('Extended Warranty Fee', 'Fixed', 1299, false),
('GAP Insurance Fee', 'Fixed', 599, true),
('Service Contract Fee', 'Fixed', 899, false);

-- Insert mock tax rules data  
INSERT INTO tax_rules (tax_name, tax_type, rate, geo_code, is_active) VALUES
('Sales Tax', 'Percentage', 8.25, 'US-CA', true),
('Registration Tax', 'Fixed', 25, 'US-CA', true),
('License Fee', 'Fixed', 50, 'US-CA', true),
('Smog Fee', 'Fixed', 30, 'US-CA', true),
('VIN Verification Fee', 'Fixed', 15, 'US-CA', true),
('State Sales Tax', 'Percentage', 6.25, 'US-TX', true),
('County Tax', 'Percentage', 2.0, 'US-TX', true),
('Title Tax', 'Fixed', 33, 'US-TX', true),
('Registration Fee', 'Fixed', 75, 'US-TX', true),
('Inspection Fee', 'Fixed', 40, 'US-TX', true),
('Federal Excise Tax', 'Percentage', 0.5, 'US', true),
('Luxury Tax', 'Percentage', 5.0, 'US', false);