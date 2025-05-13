
import React from 'react';
import { DealStructureItem } from '@/types/application';
import { Calendar, ArrowDown, Percent, DollarSign, Maximize, Scale, BarChart, Fingerprint } from 'lucide-react';

interface OfferParametersProps {
  items: DealStructureItem[];
  isCustomer?: boolean;
  isLoanOffer?: boolean;
  title?: string;
}

const OfferParameters: React.FC<OfferParametersProps> = ({ 
  items = [], 
  isCustomer = false, 
  isLoanOffer = false,
  title
}) => {
  // Get the appropriate icon for a parameter
  const getParameterIcon = (paramName: string) => {
    const iconSize = { className: "h-4 w-4 mr-2 text-gray-500" };
    
    switch (paramName) {
      case 'termLength':
        return <Calendar {...iconSize} />;
      case 'downPayment':
      case 'ccrDownPayment':
        return <ArrowDown {...iconSize} />;
      case 'apr':
        return <Percent {...iconSize} />;
      case 'amountFinanced':
        return <DollarSign {...iconSize} />;
      case 'maxLtv':
        return <Maximize {...iconSize} />;
      case 'ltv':
        return <Scale {...iconSize} />;
      case 'dti':
      case 'pti':
        return <BarChart {...iconSize} />;
      case 'fico':
        return <Fingerprint {...iconSize} />;
      default:
        return null;
    }
  };

  // Define default parameters based on offer type
  const defaultParams = isLoanOffer ? 
    [
      { name: 'termLength', label: 'Term Length (months)' },
      { name: 'apr', label: 'APR' },
      { name: 'downPayment', label: 'Down Payment' },
      { name: 'amountFinanced', label: 'Amount Financed' },
      { name: 'maxLtv', label: 'Max LTV' },
      { name: 'ltv', label: 'LTV' },
      { name: 'dti', label: 'DTI' },
      { name: 'pti', label: 'PTI' },
      { name: 'fico', label: 'FICO' }
    ] : 
    [
      { name: 'termLength', label: 'Term Length (months)' },
      { name: 'mileageAllowance', label: 'Mileage Allowance' },
      { name: 'rv', label: 'RV%' },
      { name: 'rvs', label: 'RV$' },
      { name: 'ccrDownPayment', label: 'CCR/Down Payment' },
      { name: 'maxLtv', label: 'Max LTV' },
      { name: 'ltv', label: 'LTV' },
      { name: 'dti', label: 'DTI' },
      { name: 'pti', label: 'PTI' },
      { name: 'fico', label: 'FICO' },
      { name: 'mf', label: 'MF' }
    ];

  // Generate display items - if items array is empty, show default parameters with empty values
  const displayItems = items.length > 0 ? items : defaultParams.map(param => ({
    ...param,
    value: '-'
  }));

  return (
    <div className="space-y-3">
      {title && <h5 className="font-medium text-gray-700 mb-2">{title}</h5>}
      
      {displayItems.map((item, index) => {
        const isEditableField = isCustomer && 
          (item.name === 'termLength' || item.name === 'mileageAllowance' || 
           item.name === 'ccrDownPayment' || item.name === 'downPayment');
        
        const icon = getParameterIcon(item.name);
        
        return (
          <div key={index} className="flex items-center">
            {icon}
            <span className="text-sm text-gray-600 min-w-[180px]">{item.label}</span>
            <span className={`text-sm font-medium ${isEditableField ? 'text-blue-600' : ''}`}>
              {item.value || '-'}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default OfferParameters;
