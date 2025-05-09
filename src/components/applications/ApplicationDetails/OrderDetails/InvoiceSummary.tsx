
import React from 'react';
import { DataField } from './DataField';

interface InvoiceSummaryProps {
  invoiceSummary: {
    model: string;
    trim: string;
    options: Array<{name: string; price: string}>;
    discounts: Array<{name: string; value: string}>;
    subTotal: string;
  };
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ invoiceSummary }) => {
  return (
    <div className="mb-6">
      <h4 className="font-medium mb-3">Invoice Summary</h4>
      <div className="grid grid-cols-2 gap-x-4">
        <div>
          <DataField label="Model" value={invoiceSummary.model} />
        </div>
        <div className="text-right">
          <span className="font-medium">${invoiceSummary.model === 'Air' ? '89,000.00' : '0'}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-x-4">
        <div>
          <DataField label="Trim" value={invoiceSummary.trim} />
        </div>
        <div className="text-right">
          <span className="font-medium">$20,000.00</span>
        </div>
      </div>
      
      {/* Options */}
      {invoiceSummary.options.map((option, index) => (
        <div key={index} className="grid grid-cols-2 gap-x-4">
          <div>
            <DataField label="Option" value={option.name} />
          </div>
          <div className="text-right">
            <span className="font-medium">{option.price}</span>
          </div>
        </div>
      ))}
      
      {/* Discounts */}
      {invoiceSummary.discounts.map((discount, index) => (
        <div key={index} className="grid grid-cols-2 gap-x-4">
          <div>
            <DataField label="Discount" value={discount.name} />
          </div>
          <div className="text-right">
            {discount.value && <span className="font-medium">{discount.value}</span>}
          </div>
        </div>
      ))}
      
      {/* Subtotal */}
      <div className="grid grid-cols-2 gap-x-4 border-t border-gray-200 pt-2 mt-2">
        <div>
          <span className="font-medium">Sub Total</span>
        </div>
        <div className="text-right">
          <span className="font-medium">{invoiceSummary.subTotal}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
