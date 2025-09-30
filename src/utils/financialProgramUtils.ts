import { WizardData } from '@/components/dashboard/FinancialProgramWizard';

// Transform program data from database format to wizard format
export const transformProgramDataForWizard = (program: any): WizardData => {
  console.log('🔧 transformProgramDataForWizard input program:', program);
  
  // Use template_metadata from Supabase schema
  const templateMetadata = program.template_metadata || {};
  console.log('🔧 Template metadata:', templateMetadata);
  
  // Convert date format from "2/1/2025" to "2025-02-01"
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0];
    } catch {
      return dateStr;
    }
  };

  const wizardData: WizardData = {
    vehicleStyleIds: [program.vehicle_style_id].filter(Boolean),
    vehicleCondition: program.financing_vehicle_condition || "New",
    orderTypes: program.order_types ? program.order_types.split(', ').filter(Boolean) : ["INV"],
    financialProduct: program.financial_product_id || "",
    lenderSpecificPricingTypes: templateMetadata.lenderSpecificPricingTypes || [],
    allPricingTypes: templateMetadata.allPricingTypes || [],
    pricingTypeConfigs: templateMetadata.pricingTypeConfigs || {},
    programStartDate: formatDateForInput(program.program_start_date),
    programEndDate: formatDateForInput(program.program_end_date),
    lenders: templateMetadata.lenders || [],
    geoCodes: templateMetadata.geoCodes || []
  };
  
  console.log('🔧 transformProgramDataForWizard output wizard data:', wizardData);
  return wizardData;
};