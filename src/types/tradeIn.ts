
export interface TradeIn {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  vin: string;
  valuation_odometer: number;
  lien_holder: string | null;
  final_offer: number;
  net_trade_in: number;
  equity_payout_amount: number;
  payoff_amount: number;
  application_id: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}
