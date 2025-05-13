
import React from 'react';
import { DealStructureItem } from '@/types/application';
import { Calendar, ArrowDown, Percent, DollarSign, Maximize, Scale, BarChart, Fingerprint } from 'lucide-react';

interface OfferParametersProps {
  items: DealStructureItem[];
  isCustomer?: boolean;
  isLoanOffer?: boolean;
}

const OfferParameters: React.FC<OfferParametersProps> = ({ items, isCustomer = false, isLoanOffer = false }) => {
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

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isEditableField = isCustomer && 
          (item.name === 'termLength' || item.name === 'mileageAllowance' || 
           item.name === 'ccrDownPayment' || item.name === 'downPayment');
        
        const icon = getParameterIcon(item.name);
        
        return (
          <div key={index} className="flex items-center">
            {isLoanOffer && icon}
            <span className="text-sm text-gray-600 min-w-[180px]">{item.label}</span>
            <span className={`text-sm font-medium ${isEditableField ? 'text-blue-600' : ''}`}>
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default OfferParameters;
