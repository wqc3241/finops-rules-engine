
import React from 'react';
import { DealStructureItem } from '@/types/application';

interface OfferParametersProps {
  items: DealStructureItem[];
  isCustomer?: boolean;
  applicationType?: 'Lease' | 'Loan';
}

const OfferParameters: React.FC<OfferParametersProps> = ({ 
  items, 
  isCustomer = false,
  applicationType = 'Lease'
}) => {
  const getEditableFields = () => {
    if (applicationType === 'Loan') {
      return ['termLength', 'downPayment', 'apr'];
    }
    return ['termLength', 'mileageAllowance', 'ccrDownPayment', 'downPayment'];
  };

  const editableFields = getEditableFields();

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isEditableField = isCustomer && editableFields.includes(item.name);
        
        return (
          <div key={index} className="flex items-center">
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
