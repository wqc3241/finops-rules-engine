
import { DealStructureItem } from '@/types/application';

// Standardizes parameters to ensure consistent display in various sections
export const generateStandardParams = (items: DealStructureItem[], isLoanOffer: boolean = false): DealStructureItem[] => {
  if (!items || items.length === 0) {
    return [];
  }

  // Define the standard parameters we want to show for loan and lease offers
  const loanKeyParams = [
    'termLength',
    'apr',
    'downPayment',
    'amountFinanced',
    'maxLtv',
    'ltv',
    'dti',
    'pti',
    'fico'
  ];
  
  const leaseKeyParams = [
    'termLength',
    'mileageAllowance',
    'rv',
    'rvs',
    'ccrDownPayment',
    'maxLtv',
    'ltv',
    'dti',
    'pti',
    'fico',
    'mf'
  ];

  // Choose the appropriate key parameters based on offer type
  const keyParams = isLoanOffer ? loanKeyParams : leaseKeyParams;
  
  // Filter and sort the items according to our predefined key parameters order
  const filteredItems = items.filter(item => keyParams.includes(item.name));
  
  // Sort the items to match the order of keyParams
  const sortedItems = [...filteredItems].sort((a, b) => {
    return keyParams.indexOf(a.name) - keyParams.indexOf(b.name);
  });
  
  return sortedItems;
};
