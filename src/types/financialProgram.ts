// Database record structure for financial_program_configs table
export interface FinancialProgramRecord {
  id?: string;
  program_code: string;
  vehicle_style_id: string;
  financing_vehicle_condition: string;
  financial_product_id: string;
  program_start_date: string;
  program_end_date: string;
  is_active: string;
  advertised: string;
  version: number;
  priority: number;
  order_types?: string;
  template_metadata?: any;
  created_at?: string;
  updated_at?: string;
}