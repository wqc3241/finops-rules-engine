-- Populate all tables with mock data

-- Insert Lenders
INSERT INTO public.lenders (id, lender_name) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Bank of America'),
('550e8400-e29b-41d4-a716-446655440002', 'Wells Fargo'),
('550e8400-e29b-41d4-a716-446655440003', 'JPMorgan Chase'),
('550e8400-e29b-41d4-a716-446655440004', 'Citi'),
('550e8400-e29b-41d4-a716-446655440005', 'Capital One');

-- Insert Gateways
INSERT INTO public.gateways (id, gateway_name) VALUES 
('660e8400-e29b-41d4-a716-446655440001', 'RouteOne'),
('660e8400-e29b-41d4-a716-446655440002', 'DealerTrack'),
('660e8400-e29b-41d4-a716-446655440003', 'LFS Gateway');

-- Insert Dealers
INSERT INTO public.dealers (id, dealer_name) VALUES 
('770e8400-e29b-41d4-a716-446655440001', 'Lucid Studio Beverly Hills'),
('770e8400-e29b-41d4-a716-446655440002', 'Lucid Studio Manhattan'),
('770e8400-e29b-41d4-a716-446655440003', 'Lucid Studio Palo Alto');

-- Insert Countries
INSERT INTO public.countries (id, country_name, country_code) VALUES 
('880e8400-e29b-41d4-a716-446655440001', 'United States', 'US'),
('880e8400-e29b-41d4-a716-446655440002', 'Canada', 'CA'),
('880e8400-e29b-41d4-a716-446655440003', 'Germany', 'DE'),
('880e8400-e29b-41d4-a716-446655440004', 'Netherlands', 'NL'),
('880e8400-e29b-41d4-a716-446655440005', 'Saudi Arabia', 'KSA'),
('880e8400-e29b-41d4-a716-446655440006', 'United Arab Emirates', 'UAE');

-- Insert States
INSERT INTO public.states (id, country_id, state_name, state_code) VALUES 
('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'California', 'CA'),
('990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', 'New York', 'NY'),
('990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440001', 'Texas', 'TX');

-- Insert Location Geo
INSERT INTO public.location_geo (id, geo_code, location_name) VALUES 
('aa0e8400-e29b-41d4-a716-446655440001', 'NA-US', 'North America - United States'),
('aa0e8400-e29b-41d4-a716-446655440002', 'NA-CA', 'North America - Canada'),
('aa0e8400-e29b-41d4-a716-446655440003', 'EU-DE', 'Europe - Germany'),
('aa0e8400-e29b-41d4-a716-446655440004', 'EU-NL', 'Europe - Netherlands'),
('aa0e8400-e29b-41d4-a716-446655440005', 'ME-KSA', 'Middle East - Saudi Arabia'),
('aa0e8400-e29b-41d4-a716-446655440006', 'ME-UAE', 'Middle East - UAE');

-- Insert Pricing Types
INSERT INTO public.pricing_types (id, type_code, type_name) VALUES 
('bb0e8400-e29b-41d4-a716-446655440001', 'STDAPR', 'Standard APR'),
('bb0e8400-e29b-41d4-a716-446655440002', 'SUBAPR', 'Subvented APR'),
('bb0e8400-e29b-41d4-a716-446655440003', 'MINDWPAY', 'Min Down Payment'),
('bb0e8400-e29b-41d4-a716-446655440004', 'SPR', 'Special Rate'),
('bb0e8400-e29b-41d4-a716-446655440005', 'INR', 'Interest Rate'),
('bb0e8400-e29b-41d4-a716-446655440006', 'ENHRV', 'Enhanced Residual Value'),
('bb0e8400-e29b-41d4-a716-446655440007', 'SUBMF', 'Subvented Money Factor'),
('bb0e8400-e29b-41d4-a716-446655440008', 'MAXBDAPR', 'Max Base Down APR'),
('bb0e8400-e29b-41d4-a716-446655440009', 'MAXMUAPR', 'Max Markup APR'),
('bb0e8400-e29b-41d4-a716-446655440010', 'ADF', 'Additional Dealer Fee');

-- Insert Financial Products
INSERT INTO public.financial_products (id, product_type, product_subtype, geo_code, category) VALUES 
('cc0e8400-e29b-41d4-a716-446655440001', 'Loan', NULL, 'NA-US', 'Personal'),
('cc0e8400-e29b-41d4-a716-446655440002', 'Lease', NULL, 'NA-US', 'Personal'),
('cc0e8400-e29b-41d4-a716-446655440003', 'Loan', NULL, 'EU-DE', 'Personal'),
('cc0e8400-e29b-41d4-a716-446655440004', 'Loan', NULL, 'EU-DE', 'Commercial'),
('cc0e8400-e29b-41d4-a716-446655440005', 'Balloon', 'Monthly', 'ME-KSA', 'Personal'),
('cc0e8400-e29b-41d4-a716-446655440006', 'Balloon', 'Annual', 'ME-KSA', 'Personal');

-- Insert Vehicle Conditions
INSERT INTO public.vehicle_conditions (id, condition) VALUES 
('dd0e8400-e29b-41d4-a716-446655440001', 'New'),
('dd0e8400-e29b-41d4-a716-446655440002', 'Used'),
('dd0e8400-e29b-41d4-a716-446655440003', 'Demo'),
('dd0e8400-e29b-41d4-a716-446655440004', 'CPO');

-- Insert Vehicle Options
INSERT INTO public.vehicle_options (id, option_name) VALUES 
('ee0e8400-e29b-41d4-a716-446655440001', 'AWD Drivetrain'),
('ee0e8400-e29b-41d4-a716-446655440002', 'RWD Drivetrain'),
('ee0e8400-e29b-41d4-a716-446655440003', '22" Wheels'),
('ee0e8400-e29b-41d4-a716-446655440004', '21" Wheels'),
('ee0e8400-e29b-41d4-a716-446655440005', 'Glass Roof'),
('ee0e8400-e29b-41d4-a716-446655440006', 'Pro ADAS'),
('ee0e8400-e29b-41d4-a716-446655440007', 'Pro Sound System');

-- Insert Vehicle Style Coding
INSERT INTO public.vehicle_style_coding (id, code, description) VALUES 
('ff0e8400-e29b-41d4-a716-446655440001', 'L25A1', '2025 Lucid Air Grand Touring'),
('ff0e8400-e29b-41d4-a716-446655440002', 'L25A2', '2025 Lucid Air Pure'),
('ff0e8400-e29b-41d4-a716-446655440003', 'L25A3', '2025 Lucid Air Pure Alternative'),
('ff0e8400-e29b-41d4-a716-446655440004', 'KSA25A1', '2025 Lucid Air Pure KSA');

-- Insert Order Types
INSERT INTO public.order_types (id, type_name, type_code) VALUES 
('110e8400-e29b-41d4-a716-446655440001', 'Standard Order', 'STD'),
('110e8400-e29b-41d4-a716-446655440002', 'Express Order', 'EXP'),
('110e8400-e29b-41d4-a716-446655440003', 'Custom Order', 'CST');

-- Insert Routing Rules
INSERT INTO public.routing_rules (id, rule_name) VALUES 
('220e8400-e29b-41d4-a716-446655440001', 'Primary Routing Rule'),
('220e8400-e29b-41d4-a716-446655440002', 'Secondary Routing Rule'),
('220e8400-e29b-41d4-a716-446655440003', 'Fallback Routing Rule');

-- Insert Stipulations
INSERT INTO public.stipulations (id, stipulation_name) VALUES 
('330e8400-e29b-41d4-a716-446655440001', 'Income Verification'),
('330e8400-e29b-41d4-a716-446655440002', 'Employment Verification'),
('330e8400-e29b-41d4-a716-446655440003', 'Residence Verification');

-- Insert Fee Rules
INSERT INTO public.fee_rules (id, fee_name, fee_type, amount) VALUES 
('440e8400-e29b-41d4-a716-446655440001', 'Documentation Fee', 'Fixed', 299.00),
('440e8400-e29b-41d4-a716-446655440002', 'Processing Fee', 'Fixed', 150.00),
('440e8400-e29b-41d4-a716-446655440003', 'Acquisition Fee', 'Percentage', 2.5);

-- Insert Tax Rules
INSERT INTO public.tax_rules (id, tax_name, tax_type, rate, geo_code) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Sales Tax', 'Percentage', 8.75, 'NA-US'),
('550e8400-e29b-41d4-a716-446655440002', 'VAT', 'Percentage', 19.0, 'EU-DE'),
('550e8400-e29b-41d4-a716-446655440003', 'Import Tax', 'Fixed', 5000.00, 'ME-KSA');

-- Insert Document Categories
INSERT INTO public.document_categories (id, name) VALUES 
('660e8400-e29b-41d4-a716-446655440001', 'Order Documents'),
('660e8400-e29b-41d4-a716-446655440002', 'Registration Documents'),
('660e8400-e29b-41d4-a716-446655440003', 'Customer Documents'),
('660e8400-e29b-41d4-a716-446655440004', 'Stipulation Documents'),
('660e8400-e29b-41d4-a716-446655440005', 'Compliance Documents'),
('660e8400-e29b-41d4-a716-446655440006', 'Supporting Documents');

-- Insert Credit Profiles
INSERT INTO public.credit_profiles (id, employment_type, priority, min_credit_score, max_credit_score, min_income, max_income, min_age, max_age, min_pti, max_pti, min_dti, max_dti) VALUES 
('770e8400-e29b-41d4-a716-446655440001', 'Full-time', 1, 700, 850, 50000, 500000, 18, 75, 0.1, 0.4, 0.1, 0.45),
('770e8400-e29b-41d4-a716-446655440002', 'Self-employed', 2, 650, 850, 75000, 1000000, 21, 70, 0.15, 0.5, 0.15, 0.5),
('770e8400-e29b-41d4-a716-446655440003', 'Part-time', 3, 600, 750, 25000, 100000, 18, 65, 0.2, 0.6, 0.2, 0.6);

-- Insert Pricing Configs
INSERT INTO public.pricing_configs (id, min_ltv, max_ltv, min_term, max_term, min_lease_mileage, max_lease_mileage, priority) VALUES 
('880e8400-e29b-41d4-a716-446655440001', 0.8, 1.0, 24, 84, 10000, 15000, 1),
('880e8400-e29b-41d4-a716-446655440002', 0.7, 0.95, 36, 72, 12000, 20000, 2),
('880e8400-e29b-41d4-a716-446655440003', 0.6, 0.9, 48, 96, 8000, 25000, 3);

-- Insert Financial Program Configs
INSERT INTO public.financial_program_configs (id, program_code, financial_product_id, product_type, vehicle_style_id, financing_vehicle_condition, program_start_date, program_end_date, order_types, priority) VALUES 
('990e8400-e29b-41d4-a716-446655440001', 'USLN001', 'cc0e8400-e29b-41d4-a716-446655440001', 'Loan', 'L25A1', 'New', '2024-01-01', '2024-12-31', 'STD,EXP', 1),
('990e8400-e29b-41d4-a716-446655440002', 'USLE001', 'cc0e8400-e29b-41d4-a716-446655440002', 'Lease', 'L25A2', 'New', '2024-01-01', '2024-12-31', 'STD,CST', 2),
('990e8400-e29b-41d4-a716-446655440003', 'DELE001', 'cc0e8400-e29b-41d4-a716-446655440003', 'Loan', 'L25A3', 'New', '2024-01-01', '2024-12-31', 'STD', 3);

-- Insert Bulletin Pricing
INSERT INTO public.bulletin_pricing (id, financial_program_code, program_id, pricing_config, geo_code, lender_name, pricing_type, pricing_value, advertised, upload_date) VALUES 
('aa1e8400-e29b-41d4-a716-446655440001', 'USLN001', 'PROG001', 'CONFIG1', 'NA-US', 'Bank of America', 'STDAPR', 4.5, true, '2024-01-15'),
('aa1e8400-e29b-41d4-a716-446655440002', 'USLE001', 'PROG002', 'CONFIG2', 'NA-US', 'Wells Fargo', 'SUBMF', 0.00125, false, '2024-01-15'),
('aa1e8400-e29b-41d4-a716-446655440003', 'DELE001', 'PROG003', 'CONFIG3', 'EU-DE', 'JPMorgan Chase', 'INR', 3.2, true, '2024-01-15');

-- Insert Advertised Offers
INSERT INTO public.advertised_offers (id, bulletin_pricing_id, disclosure, loan_amount_per_10k, total_cost_of_credit) VALUES 
('bb1e8400-e29b-41d4-a716-446655440001', 'aa1e8400-e29b-41d4-a716-446655440001', 'Subject to credit approval', '$220.50', '$15,876'),
('bb1e8400-e29b-41d4-a716-446655440002', 'aa1e8400-e29b-41d4-a716-446655440002', 'Qualified buyers only', '$189.99', '$12,450'),
('bb1e8400-e29b-41d4-a716-446655440003', 'aa1e8400-e29b-41d4-a716-446655440003', 'Limited time offer', '$198.75', '$13,250');

-- Insert Lease Configs
INSERT INTO public.lease_configs (id, config_name) VALUES 
('cc1e8400-e29b-41d4-a716-446655440001', 'Standard Lease Configuration'),
('cc1e8400-e29b-41d4-a716-446655440002', 'Premium Lease Configuration'),
('cc1e8400-e29b-41d4-a716-446655440003', 'Corporate Lease Configuration');

-- Insert Applications
INSERT INTO public.applications (id, name, type, status, amount, date, state, reapply_enabled, reapplication_sequence) VALUES 
('dd1e8400-e29b-41d4-a716-446655440001', 'Bandit Heeler', 'Lease', 'Approved', 125000, '2024-08-11 10:30:00', 'CA', false, 1),
('dd1e8400-e29b-41d4-a716-446655440002', 'Chilli Heeler', 'Loan', 'Pending', 115000, '2024-08-10 14:15:00', 'NY', true, 1),
('dd1e8400-e29b-41d4-a716-446655440003', 'Bingo Heeler', 'Lease', 'Conditionally Approved', 95000, '2024-08-09 09:45:00', 'TX', false, 1),
('dd1e8400-e29b-41d4-a716-446655440004', 'Bluey Heeler', 'Loan', 'Declined', 135000, '2024-08-08 16:20:00', 'FL', true, 1),
('dd1e8400-e29b-41d4-a716-446655440005', 'Stripe Heeler', 'Lease', 'Funded', 105000, '2024-08-07 11:00:00', 'WA', false, 1);

-- Insert Application Details for each application
INSERT INTO public.application_details (id, application_id, order_number, model, edition, ordered_by) VALUES 
('ee1e8400-e29b-41d4-a716-446655440001', 'dd1e8400-e29b-41d4-a716-446655440001', 'AD 24567-17246', 'Air Dream Edition (GT)', 'Dream Edition', 'Bandit Heeler'),
('ee1e8400-e29b-41d4-a716-446655440002', 'dd1e8400-e29b-41d4-a716-446655440002', 'AD 24568-17247', 'Air Pure', 'Pure', 'Chilli Heeler'),
('ee1e8400-e29b-41d4-a716-446655440003', 'dd1e8400-e29b-41d4-a716-446655440003', 'AD 24569-17248', 'Air Touring', 'Touring', 'Bingo Heeler'),
('ee1e8400-e29b-41d4-a716-446655440004', 'dd1e8400-e29b-41d4-a716-446655440004', 'AD 24570-17249', 'Air Grand Touring', 'Grand Touring', 'Bluey Heeler'),
('ee1e8400-e29b-41d4-a716-446655440005', 'dd1e8400-e29b-41d4-a716-446655440005', 'AD 24571-17250', 'Air Sapphire', 'Sapphire', 'Stripe Heeler');

-- Insert Applicant Info (Primary applicants)
INSERT INTO public.applicant_info (id, application_id, is_co_applicant, relationship, first_name, middle_name, last_name, email_address, contact_number, dob, residence_type, housing_payment_amount, address, city, state, zip_code, employment_type, employer_name, job_title, income_amount, other_source_of_income, other_income_amount) VALUES 
('ff1e8400-e29b-41d4-a716-446655440001', 'dd1e8400-e29b-41d4-a716-446655440001', false, 'Self', 'Bandit', 'Jules', 'Heeler', 'bjheeler@gmail.com', '(650) 888-8888', '03/12/1990', 'Mortgage', '$7,000.00', '211 Surfbird Isle', 'Foster City', 'CA', '94404', 'Self-employed', 'Ludo Studio', 'Actor', '$83,333.33', 'Consultant', '$10,000.00'),
('ff1e8400-e29b-41d4-a716-446655440002', 'dd1e8400-e29b-41d4-a716-446655440002', false, 'Self', 'Chilli', 'K', 'Heeler', 'chilliheeler@gmail.com', '(650) 777-7777', '06/11/1988', 'Mortgage', '$7,000.00', '211 Surfbird Isle', 'Foster City', 'CA', '94404', 'Self-employed', 'Ludo Studio', 'Actress', '$83,333.33', 'Consultant', '$10,000.00'),
('ff1e8400-e29b-41d4-a716-446655440003', 'dd1e8400-e29b-41d4-a716-446655440003', false, 'Self', 'Bingo', 'M', 'Heeler', 'bingoheeler@gmail.com', '(650) 666-6666', '05/15/2015', 'Rent', '$2,000.00', '211 Surfbird Isle', 'Foster City', 'CA', '94404', 'Student', 'School', 'Student', '$0.00', 'Allowance', '$500.00'),
('ff1e8400-e29b-41d4-a716-446655440004', 'dd1e8400-e29b-41d4-a716-446655440004', false, 'Self', 'Bluey', 'N', 'Heeler', 'blueyheeler@gmail.com', '(650) 555-5555', '08/20/2017', 'Rent', '$2,000.00', '211 Surfbird Isle', 'Foster City', 'CA', '94404', 'Student', 'School', 'Student', '$0.00', 'Allowance', '$300.00'),
('ff1e8400-e29b-41d4-a716-446655440005', 'dd1e8400-e29b-41d4-a716-446655440005', false, 'Self', 'Stripe', 'P', 'Heeler', 'stripeheeler@gmail.com', '(650) 444-4444', '02/28/1992', 'Own', '$0.00', '211 Surfbird Isle', 'Foster City', 'CA', '94404', 'Full-time', 'Tech Company', 'Engineer', '$120,000.00', 'Freelance', '$15,000.00');

-- Insert Vehicle Data for each application
INSERT INTO public.vehicle_data (id, application_id, vin, trim, year, model, msrp, gcc_cash_price, applicable_discounts, total_discount_amount) VALUES 
('111e8400-e29b-41d4-a716-446655440001', 'dd1e8400-e29b-41d4-a716-446655440001', '50EA1PGA9RA004169', 'Grand Touring AWD', '2025', 'Air', '$125,000.00', '$115,000.00', 'On-site, Referral, etc.', '$10,000.00'),
('111e8400-e29b-41d4-a716-446655440002', 'dd1e8400-e29b-41d4-a716-446655440002', '50EA1PGA9RA004170', 'Pure RWD', '2025', 'Air', '$95,000.00', '$90,000.00', 'Early Bird', '$5,000.00'),
('111e8400-e29b-41d4-a716-446655440003', 'dd1e8400-e29b-41d4-a716-446655440003', '50EA1PGA9RA004171', 'Touring AWD', '2025', 'Air', '$110,000.00', '$105,000.00', 'Loyalty', '$5,000.00'),
('111e8400-e29b-41d4-a716-446655440004', 'dd1e8400-e29b-41d4-a716-446655440004', '50EA1PGA9RA004172', 'Grand Touring AWD', '2025', 'Air', '$135,000.00', '$130,000.00', 'VIP', '$5,000.00'),
('111e8400-e29b-41d4-a716-446655440005', 'dd1e8400-e29b-41d4-a716-446655440005', '50EA1PGA9RA004173', 'Sapphire AWD', '2025', 'Air', '$180,000.00', '$175,000.00', 'Launch Edition', '$5,000.00');

-- Insert App DT References for each application
INSERT INTO public.app_dt_references (id, application_id, dt_portal_state, dt_id, application_date) VALUES 
('222e8400-e29b-41d4-a716-446655440001', 'dd1e8400-e29b-41d4-a716-446655440001', '50EA1PGA9RA004169', '600001', '08/11/2024'),
('222e8400-e29b-41d4-a716-446655440002', 'dd1e8400-e29b-41d4-a716-446655440002', '50EA1PGA9RA004170', '600002', '08/10/2024'),
('222e8400-e29b-41d4-a716-446655440003', 'dd1e8400-e29b-41d4-a716-446655440003', '50EA1PGA9RA004171', '600003', '08/09/2024'),
('222e8400-e29b-41d4-a716-446655440004', 'dd1e8400-e29b-41d4-a716-446655440004', '50EA1PGA9RA004172', '600004', '08/08/2024'),
('222e8400-e29b-41d4-a716-446655440005', 'dd1e8400-e29b-41d4-a716-446655440005', '50EA1PGA9RA004173', '600005', '08/07/2024');

-- Insert Order Details for each application
INSERT INTO public.order_details (id, application_id, delivery_date, vehicle_trade_in_year, vehicle_trade_in_make, vehicle_trade_in_model, vehicle_trade_in_mileage, vehicle_trade_in_value) VALUES 
('333e8400-e29b-41d4-a716-446655440001', 'dd1e8400-e29b-41d4-a716-446655440001', '09/15/2024', '2020', 'Tesla', 'Model S', '45000', '$35,000.00'),
('333e8400-e29b-41d4-a716-446655440002', 'dd1e8400-e29b-41d4-a716-446655440002', '09/20/2024', '2019', 'BMW', 'i3', '32000', '$18,000.00'),
('333e8400-e29b-41d4-a716-446655440003', 'dd1e8400-e29b-41d4-a716-446655440003', '09/25/2024', '2021', 'Audi', 'e-tron', '25000', '$45,000.00'),
('333e8400-e29b-41d4-a716-446655440004', 'dd1e8400-e29b-41d4-a716-446655440004', '09/30/2024', '2018', 'Mercedes', 'EQS', '55000', '$25,000.00'),
('333e8400-e29b-41d4-a716-446655440005', 'dd1e8400-e29b-41d4-a716-446655440005', '10/05/2024', NULL, NULL, NULL, NULL, NULL);

-- Insert Order Sale Data (Invoice Summary)
INSERT INTO public.order_sale_data (id, order_detail_id, label, value) VALUES 
('444e8400-e29b-41d4-a716-446655440001', '333e8400-e29b-41d4-a716-446655440001', 'Vehicle Price', '$115,000.00'),
('444e8400-e29b-41d4-a716-446655440002', '333e8400-e29b-41d4-a716-446655440001', 'Options', '$5,000.00'),
('444e8400-e29b-41d4-a716-446655440003', '333e8400-e29b-41d4-a716-446655440001', 'Accessories', '$2,500.00'),
('444e8400-e29b-41d4-a716-446655440004', '333e8400-e29b-41d4-a716-446655440001', 'Sub Total', '$122,500.00');

-- Insert Order Credits Data
INSERT INTO public.order_credits_data (id, order_detail_id, label, value) VALUES 
('555e8400-e29b-41d4-a716-446655440001', '333e8400-e29b-41d4-a716-446655440001', 'Trade-in Credit', '$35,000.00'),
('555e8400-e29b-41d4-a716-446655440002', '333e8400-e29b-41d4-a716-446655440001', 'Manufacturer Rebate', '$2,500.00'),
('555e8400-e29b-41d4-a716-446655440003', '333e8400-e29b-41d4-a716-446655440001', 'Sub Total', '$37,500.00');

-- Insert Order Tax Fee Data
INSERT INTO public.order_tax_fee_data (id, order_detail_id, label, value) VALUES 
('666e8400-e29b-41d4-a716-446655440001', '333e8400-e29b-41d4-a716-446655440001', 'Sales Tax', '$7,437.50'),
('666e8400-e29b-41d4-a716-446655440002', '333e8400-e29b-41d4-a716-446655440001', 'DMV Fee', '$450.00'),
('666e8400-e29b-41d4-a716-446655440003', '333e8400-e29b-41d4-a716-446655440001', 'Documentation Fee', '$299.00'),
('666e8400-e29b-41d4-a716-446655440004', '333e8400-e29b-41d4-a716-446655440001', 'Sub Total', '$8,186.50');

-- Insert Order Registration Data
INSERT INTO public.order_registration_data (id, order_detail_id, label, value) VALUES 
('777e8400-e29b-41d4-a716-446655440001', '333e8400-e29b-41d4-a716-446655440001', 'Title', '$25.00'),
('777e8400-e29b-41d4-a716-446655440002', '333e8400-e29b-41d4-a716-446655440001', 'Registration', '$200.00'),
('777e8400-e29b-41d4-a716-446655440003', '333e8400-e29b-41d4-a716-446655440001', 'License Plates', '$50.00'),
('777e8400-e29b-41d4-a716-446655440004', '333e8400-e29b-41d4-a716-446655440001', 'Sub Total', '$275.00');

-- Insert Application Notes
INSERT INTO public.application_notes (id, application_id, content, author, date) VALUES 
('888e8400-e29b-41d4-a716-446655440001', 'dd1e8400-e29b-41d4-a716-446655440001', 'Customer prefers blue exterior color', 'John Smith', '2024-08-11 10:45:00'),
('888e8400-e29b-41d4-a716-446655440002', 'dd1e8400-e29b-41d4-a716-446655440001', 'Delivery scheduled for September 15th', 'Jane Doe', '2024-08-11 14:30:00'),
('888e8400-e29b-41d4-a716-446655440003', 'dd1e8400-e29b-41d4-a716-446655440002', 'Waiting for income verification documents', 'Mike Johnson', '2024-08-10 15:20:00');

-- Insert Application History
INSERT INTO public.application_history (id, application_id, action, description, user_name, date) VALUES 
('999e8400-e29b-41d4-a716-446655440001', 'dd1e8400-e29b-41d4-a716-446655440001', 'Application Submitted', 'Initial application submitted by customer', 'System', '2024-08-11 10:30:00'),
('999e8400-e29b-41d4-a716-446655440002', 'dd1e8400-e29b-41d4-a716-446655440001', 'Credit Check Completed', 'Credit check completed successfully', 'Auto Finance', '2024-08-11 11:15:00'),
('999e8400-e29b-41d4-a716-446655440003', 'dd1e8400-e29b-41d4-a716-446655440001', 'Application Approved', 'Application approved by underwriter', 'Sarah Wilson', '2024-08-11 16:45:00');