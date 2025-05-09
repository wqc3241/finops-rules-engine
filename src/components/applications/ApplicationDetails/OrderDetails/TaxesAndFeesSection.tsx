
import React from 'react';
import { DataField } from './DataField';

interface TaxesAndFeesSectionProps {
  taxesAndFees: {
    salesTax: {rate: string; amount: string};
    registrationFees: {type: string; amount: string};
    otherFees: {type: string; amount: string};
    total: string;
  };
}

const TaxesAndFeesSection: React.FC<TaxesAndFeesSectionProps> = ({ taxesAndFees }) => {
  return (
    <div className="mb-6">
      <h4 className="font-medium mb-3">Taxes and Fees</h4>
      
      <div className="grid grid-cols-2 gap-x-4">
        <div>
          <DataField label="Sales Tax" value={taxesAndFees.salesTax.rate} />
        </div>
        <div className="text-right">
          <span className="font-medium">{taxesAndFees.salesTax.amount}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-x-4">
        <div>
          <DataField label="Registration Fees" value={taxesAndFees.registrationFees.type} />
        </div>
        <div className="text-right">
          <span className="font-medium">{taxesAndFees.registrationFees.amount}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-x-4">
        <div>
          <DataField label="Other Fees" value={taxesAndFees.otherFees.type} />
        </div>
        <div className="text-right">
          <span className="font-medium">{taxesAndFees.otherFees.amount}</span>
        </div>
      </div>
      
      {/* Taxes and Fees Total */}
      <div className="grid grid-cols-2 gap-x-4 border-t border-gray-200 pt-2 mt-2">
        <div>
          <span className="font-medium">Total</span>
        </div>
        <div className="text-right">
          <span className="font-medium">{taxesAndFees.total}</span>
        </div>
      </div>
    </div>
  );
};

export default TaxesAndFeesSection;
