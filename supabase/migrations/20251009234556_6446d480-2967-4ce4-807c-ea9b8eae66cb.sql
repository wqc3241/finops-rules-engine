-- Add missing columns to order_details table for complete order detail support
ALTER TABLE order_details
  ADD COLUMN IF NOT EXISTS vehicle_trade_in_trim TEXT,
  ADD COLUMN IF NOT EXISTS vehicle_trade_in_lien_holder TEXT,
  ADD COLUMN IF NOT EXISTS vehicle_trade_in_payoff_amount TEXT,
  ADD COLUMN IF NOT EXISTS sale_data JSONB,
  ADD COLUMN IF NOT EXISTS registration_data JSONB;