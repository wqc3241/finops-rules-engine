export interface DiscountInfo {
  id: string;
  name: string;
  amount: number;
}

export interface AdvertisedOfferConfig {
  financial_program_code: string;
  order_type: string;
  term: number;
  base_price?: number;
  down_payment?: number;
  credit_score_min?: number;
  credit_score_max?: number;
  annual_mileage?: number;
  applicable_discounts?: DiscountInfo[];
}

export interface AdvertisedOfferWizardData {
  offer_start_date: string;
  offer_end_date: string;
  selected_programs: string[];
  program_configs: Record<string, AdvertisedOfferConfig>;
  offer_details: Record<string, {
    offer_name?: string;
    marketing_description?: string;
    disclosure?: string;
    monthly_payment?: number;
    apr?: number;
    loan_amount_per_10k?: string;
    total_cost_of_credit?: string;
  }>;
}

export interface FinancialProgramOption {
  program_code: string;
  vehicle_style_id: string;
  financing_vehicle_condition: string;
  financial_product_id: string;
  program_start_date: string;
  program_end_date: string;
  order_types?: string;
  lenders?: string[];
  min_term?: number;
  max_term?: number;
  is_lease?: boolean;
}

export interface AdvertisedOffer {
  id: string;
  offer_name: string;
  financial_program_code: string;
  order_type: string;
  term: number;
  down_payment?: number;
  credit_score_min?: number;
  credit_score_max?: number;
  annual_mileage?: number;
  loan_amount_per_10k?: string;
  total_cost_of_credit?: string;
  monthly_payment?: number;
  apr?: number;
  disclosure?: string;
  marketing_description?: string;
  offer_start_date: string;
  offer_end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  applicable_discounts?: DiscountInfo[];
}
