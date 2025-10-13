-- Create trade_ins table
CREATE TABLE public.trade_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Vehicle Information
  year INTEGER NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  trim TEXT,
  vin TEXT UNIQUE NOT NULL,
  
  -- Valuation Information
  valuation_odometer INTEGER NOT NULL,
  final_offer NUMERIC(10, 2) NOT NULL,
  
  -- Financial Information
  lien_holder TEXT,
  payoff_amount NUMERIC(10, 2) DEFAULT 0,
  net_trade_in NUMERIC(10, 2) NOT NULL,
  equity_payout_amount NUMERIC(10, 2) DEFAULT 0,
  
  -- Link to application
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Add indexes
CREATE INDEX idx_trade_ins_vin ON public.trade_ins(vin);
CREATE INDEX idx_trade_ins_application_id ON public.trade_ins(application_id);

-- Enable RLS
ALTER TABLE public.trade_ins ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "FS_OPS can view trade-ins"
  ON public.trade_ins
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
    )
  );

CREATE POLICY "FS_OPS can create trade-ins"
  ON public.trade_ins
  FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
    AND EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
    )
  );

CREATE POLICY "FS_OPS can update trade-ins"
  ON public.trade_ins
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND role IN ('FS_OPS', 'FS_ADMIN', 'admin')
    )
  );

CREATE POLICY "FS_ADMIN can delete trade-ins"
  ON public.trade_ins
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND role IN ('FS_ADMIN', 'admin')
    )
  );

-- Add trigger for updated_at
CREATE TRIGGER update_trade_ins_updated_at
  BEFORE UPDATE ON public.trade_ins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO public.trade_ins (
  year, make, model, trim, vin, valuation_odometer,
  lien_holder, final_offer, net_trade_in, equity_payout_amount, payoff_amount
) VALUES
  (2021, 'BMW', 'X5', 'xDrive45e', '5UXTA6C07M9D46767', 72533, 
   'BMW Financial Services', 26680.00, 18297.11, 0.00, 8382.89),
   
  (2020, 'Tesla', 'Model 3', 'Long Range AWD', '5YJ3E1EB1LF123456', 45230,
   'Tesla Finance', 32500.00, 32500.00, 5200.00, 0.00),
   
  (2019, 'Mercedes-Benz', 'GLE', 'GLE 350', 'WDCGG8JB1KF234567', 68940,
   'Mercedes-Benz Financial', 28750.00, 15230.50, 0.00, 13519.50),
   
  (2022, 'Audi', 'Q5', 'Premium Plus', 'WA1AAAF5XN2345678', 32100,
   'Audi Finance', 38900.00, 28450.00, 0.00, 10450.00),
   
  (2018, 'Porsche', 'Cayenne', 'S', 'WP1AB2A57JLA456789', 85670,
   'Porsche Financial Services', 35200.00, 35200.00, 12800.00, 0.00),
   
  (2021, 'Lexus', 'RX', 'RX 350', '2T2BZMCA1MC567890', 28450,
   NULL, 42100.00, 42100.00, 42100.00, 0.00),
   
  (2020, 'BMW', '3 Series', '330i', 'WBA5A7C04LD678901', 54320,
   'Chase Auto Finance', 24800.00, 18650.25, 0.00, 6149.75),
   
  (2019, 'Volvo', 'XC90', 'T6 Inscription', 'YV4A22PL5K1789012', 72100,
   'Volvo Car Financial', 30500.00, 22300.00, 0.00, 8200.00),
   
  (2022, 'Genesis', 'GV80', '3.5T Advanced', 'KMUHBDSB5NU890123', 18900,
   'Genesis Finance', 48200.00, 38750.00, 0.00, 9450.00),
   
  (2020, 'Range Rover', 'Sport', 'HSE', 'SALWS2FE9LA901234', 61200,
   'Land Rover Financial', 42300.00, 28100.50, 0.00, 14199.50),
   
  (2021, 'Acura', 'MDX', 'Technology', '5J8YD4H86ML012345', 39870,
   'Honda Financial Services', 35600.00, 35600.00, 8920.00, 0.00),
   
  (2019, 'Infiniti', 'QX60', 'Pure', '5N1DL0MM8KC123456', 78450,
   'Nissan Motor Acceptance', 22800.00, 16500.00, 0.00, 6300.00),
   
  (2023, 'Lucid', 'Air', 'Touring', '7SAYGDEF6PF234567', 12500,
   NULL, 62500.00, 62500.00, 62500.00, 0.00),
   
  (2020, 'Cadillac', 'Escalade', 'Luxury', '1GYS4CKJ3LR345678', 55800,
   'GM Financial', 52000.00, 36200.00, 0.00, 15800.00),
   
  (2018, 'Lincoln', 'Navigator', 'Reserve', '5LMJJ3LT6JEL456789', 92300,
   'Ford Credit', 28900.00, 28900.00, 3450.00, 0.00);