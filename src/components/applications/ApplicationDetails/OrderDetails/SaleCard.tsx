
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import InvoiceSummary from './InvoiceSummary';
import CreditsSection from './CreditsSection';
import TaxesAndFeesSection from './TaxesAndFeesSection';

interface SaleCardProps {
  sale: {
    invoiceSummary: {
      model: string;
      trim: string;
      options: Array<{name: string; price: string}>;
      discounts: Array<{name: string; value: string}>;
      subTotal: string;
    };
    credits: {
      items: Array<{name: string; value: string}>;
      subTotal: string;
    };
    taxesAndFees: {
      salesTax: {rate: string; amount: string};
      registrationFees: {type: string; amount: string};
      otherFees: {type: string; amount: string};
      total: string;
    };
    amountFinanced: string;
    totalDueAtDelivery: string;
  };
}

const SaleCard: React.FC<SaleCardProps> = ({ sale }) => {
  return (
    <Card className="h-fit">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Sale</h3>
        
        {/* Invoice Summary */}
        <InvoiceSummary invoiceSummary={sale.invoiceSummary} />
        
        {/* Credits */}
        <CreditsSection credits={sale.credits} />
        
        {/* Taxes and Fees */}
        <TaxesAndFeesSection taxesAndFees={sale.taxesAndFees} />
        
        {/* Amount Financed */}
        <div className="grid grid-cols-2 gap-x-4 border-t border-gray-200 pt-3 mt-3">
          <div>
            <span className="font-medium">Amount Financed</span>
          </div>
          <div className="text-right">
            <span className="font-medium">{sale.amountFinanced}</span>
          </div>
        </div>
        
        {/* Total Due at Delivery */}
        <div className="grid grid-cols-2 gap-x-4 pt-3 mt-3">
          <div>
            <span className="font-medium">Total Due at Delivery</span>
          </div>
          <div className="text-right">
            <span className="font-medium">{sale.totalDueAtDelivery}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SaleCard;
