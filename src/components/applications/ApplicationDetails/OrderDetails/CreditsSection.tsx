
import React from 'react';
import { DataField } from './DataField';

interface CreditsSectionProps {
  credits: {
    items: Array<{name: string; value: string}>;
    subTotal: string;
  };
}

const CreditsSection: React.FC<CreditsSectionProps> = ({ credits }) => {
  return (
    <div className="mb-6">
      <h4 className="font-medium mb-3">Credits</h4>
      
      {credits.items.map((credit, index) => (
        <div key={index} className="grid grid-cols-2 gap-x-4">
          <div>
            <DataField label="Credit" value={credit.name} />
          </div>
          <div className="text-right">
            <span className="font-medium">{credit.value}</span>
          </div>
        </div>
      ))}
      
      {/* Credits Subtotal */}
      <div className="grid grid-cols-2 gap-x-4 border-t border-gray-200 pt-2 mt-2">
        <div>
          <span className="font-medium">Sub Total</span>
        </div>
        <div className="text-right">
          <span className="font-medium">{credits.subTotal}</span>
        </div>
      </div>
    </div>
  );
};

export default CreditsSection;
