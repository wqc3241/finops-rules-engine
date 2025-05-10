
import { DealStructureItem } from '@/types/application';

// Standard financial parameters to always show
export const standardParams = [
  'termLength', 'mileageAllowance', 'rv', 'rvs', 'ccrDownPayment', 
  'maxLtv', 'ltv', 'dti', 'pti', 'fico', 'mf'
];

// Standard parameter labels
export const paramLabels: Record<string, string> = {
  termLength: "Term Length (months)",
  mileageAllowance: "Mileage Allowance",
  rv: "RV%",
  rvs: "RV$",
  ccrDownPayment: "CCR/Down Payment",
  maxLtv: "Max LTV",
  ltv: "LTV",
  dti: "DTI",
  pti: "PTI",
  fico: "FICO",
  mf: "MF"
};

// Helper function to generate standardized parameter items
export const generateStandardParams = (items: DealStructureItem[]) => {
  const itemMap = new Map(items.map(item => [item.name, item]));
  
  // Convert to standardized array with all required parameters
  return standardParams.map(paramName => {
    const item = itemMap.get(paramName);
    return {
      name: paramName,
      label: paramLabels[paramName] || paramName,
      value: item ? item.value : "-"
    };
  });
};
