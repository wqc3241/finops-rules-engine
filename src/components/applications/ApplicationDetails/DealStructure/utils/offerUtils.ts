
import { DealStructureItem } from '@/types/application';

// Standard financial parameters for lease
export const leaseParams = [
  'termLength', 'mileageAllowance', 'ccrDownPayment', 'rv', 'rvs', 
  'maxLtv', 'ltv', 'dti', 'pti', 'fico', 'mf'
];

// Standard financial parameters for loan
export const loanParams = [
  'termLength', 'downPayment', 'apr', 'amountFinanced',
  'maxLtv', 'ltv', 'dti', 'pti', 'fico'
];

// Standard parameter labels
export const paramLabels: Record<string, string> = {
  // Lease parameters
  termLength: "Term Length (months)",
  mileageAllowance: "Mileage Allowance",
  rv: "RV%",
  rvs: "RV$",
  ccrDownPayment: "CCR/Down Payment",
  
  // Loan parameters
  downPayment: "Down Payment",
  apr: "APR",
  amountFinanced: "Amount Financed",
  
  // Common parameters
  maxLtv: "Max LTV",
  ltv: "LTV",
  dti: "DTI",
  pti: "PTI",
  fico: "FICO",
  mf: "MF"
};

// Helper function to determine which parameters to use based on application type
export const getParamsForType = (applicationType?: 'Lease' | 'Loan') => {
  return applicationType === 'Loan' ? loanParams : leaseParams;
};

// Helper function to generate standardized parameter items
export const generateStandardParams = (
  items: DealStructureItem[],
  applicationType?: 'Lease' | 'Loan'
) => {
  const params = getParamsForType(applicationType);
  const itemMap = new Map(items.map(item => [item.name, item]));
  
  // Convert to standardized array with all required parameters
  return params.map(paramName => {
    const item = itemMap.get(paramName);
    return {
      name: paramName,
      label: paramLabels[paramName] || paramName,
      value: item ? item.value : "-"
    };
  });
};
