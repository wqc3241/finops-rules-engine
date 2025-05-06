
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronUp } from 'lucide-react';
import { FinancialSummary } from '@/types/application';
import { Button } from '@/components/ui/button';

interface FinancialSummaryViewProps {
  financialSummary: FinancialSummary;
}

const FinancialSummaryView: React.FC<FinancialSummaryViewProps> = ({ financialSummary }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">LFS</h3>
          <div className="flex items-center">
            <ChevronUp className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex mb-6">
          {financialSummary.lfs.tabs.map((tab, index) => (
            <Button 
              key={index} 
              variant={tab === financialSummary.lfs.activeTab ? "default" : "outline"}
              className="mr-2"
            >
              {tab}
            </Button>
          ))}
        </div>
        
        {/* Accepted Offer */}
        <section className="mb-6">
          <h4 className="text-md font-medium mb-4 border-b border-gray-200 pb-2">Accepted Offer</h4>
          <div className="grid grid-cols-3 gap-4">
            {financialSummary.lfs.acceptedOffer.map((row, rowIndex) => (
              <React.Fragment key={`row-${rowIndex}`}>
                {row.map((item, colIndex) => (
                  <div key={`row-${rowIndex}-col-${colIndex}`} className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">{item.relationship}</p>
                    <p className="text-gray-800">{item.value}</p>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </section>
        
        {/* Residual Value */}
        <section className="mb-6">
          <h4 className="text-md font-medium mb-4 border-b border-gray-200 pb-2">Residual Value</h4>
          <div className="grid grid-cols-3 gap-4">
            {financialSummary.lfs.residualValue.map((row, rowIndex) => (
              <React.Fragment key={`residual-${rowIndex}`}>
                {row.map((item, colIndex) => (
                  <div key={`residual-${rowIndex}-col-${colIndex}`} className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">{item.relationship}</p>
                    <p className="text-gray-800">{item.value}</p>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </section>
        
        {/* Payment */}
        <section className="mb-6">
          <h4 className="text-md font-medium mb-4 border-b border-gray-200 pb-2">Payment</h4>
          <div className="grid grid-cols-3 gap-4">
            {financialSummary.lfs.payment.map((row, rowIndex) => (
              <React.Fragment key={`payment-${rowIndex}`}>
                {row.map((item, colIndex) => (
                  <div key={`payment-${rowIndex}-col-${colIndex}`} className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">{item.relationship}</p>
                    <p className="text-gray-800">{item.value}</p>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </section>
        
        {/* Payment Contd. */}
        <section className="mb-6">
          <h4 className="text-md font-medium mb-4 border-b border-gray-200 pb-2">Payment Contd.</h4>
          <div className="grid grid-cols-3 gap-4">
            {financialSummary.lfs.paymentContd.map((row, rowIndex) => (
              <React.Fragment key={`payment-contd-${rowIndex}`}>
                {row.map((item, colIndex) => (
                  <div key={`payment-contd-${rowIndex}-col-${colIndex}`} className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">{item.relationship}</p>
                    <p className="text-gray-800">{item.value}</p>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </section>
        
        {/* Capitalized Tax */}
        <section className="mb-6">
          <h4 className="text-md font-medium mb-4 border-b border-gray-200 pb-2">Capitalized Tax</h4>
          <div className="grid grid-cols-3 gap-4">
            {financialSummary.lfs.capitalizedTax.map((row, rowIndex) => (
              <React.Fragment key={`cap-tax-${rowIndex}`}>
                {row.map((item, colIndex) => (
                  <div key={`cap-tax-${rowIndex}-col-${colIndex}`} className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">{item.relationship}</p>
                    <p className="text-gray-800">{item.value}</p>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </section>
        
        {/* Upfront Tax */}
        <section className="mb-6">
          <h4 className="text-md font-medium mb-4 border-b border-gray-200 pb-2">Upfront Tax</h4>
          <div className="grid grid-cols-3 gap-4">
            {financialSummary.lfs.upfrontTax.map((row, rowIndex) => (
              <React.Fragment key={`upfront-tax-${rowIndex}`}>
                {row.map((item, colIndex) => (
                  <div key={`upfront-tax-${rowIndex}-col-${colIndex}`} className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">{item.relationship}</p>
                    <p className="text-gray-800">{item.value}</p>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </section>
        
        {/* Capitalized Fees */}
        <section className="mb-6">
          <h4 className="text-md font-medium mb-4 border-b border-gray-200 pb-2">Capitalized Fees</h4>
          <div className="grid grid-cols-3 gap-4">
            {financialSummary.lfs.capitalizedFees.map((row, rowIndex) => (
              <React.Fragment key={`cap-fees-${rowIndex}`}>
                {row.map((item, colIndex) => (
                  <div key={`cap-fees-${rowIndex}-col-${colIndex}`} className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">{item.relationship}</p>
                    <p className="text-gray-800">{item.value}</p>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </section>
        
        {/* Upfront Fees */}
        <section>
          <h4 className="text-md font-medium mb-4 border-b border-gray-200 pb-2">Upfront Fees</h4>
          <div className="grid grid-cols-3 gap-4">
            {financialSummary.lfs.upfrontFees.map((row, rowIndex) => (
              <React.Fragment key={`upfront-fees-${rowIndex}`}>
                {row.map((item, colIndex) => (
                  <div key={`upfront-fees-${rowIndex}-col-${colIndex}`} className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">{item.relationship}</p>
                    <p className="text-gray-800">{item.value}</p>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  );
};

export default FinancialSummaryView;
