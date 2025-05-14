
import React from 'react';

interface LoanCollapsedViewProps {
  termLength: string;
  monthlyPayments: string;
  downPayment: string;
}

const LoanCollapsedView: React.FC<LoanCollapsedViewProps> = ({ termLength, monthlyPayments, downPayment }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <span className="text-sm text-gray-600 block">Term Length (months)</span>
        <span className="text-sm font-medium block bg-gray-50 p-2 mt-1">{termLength}</span>
      </div>
      <div>
        <span className="text-sm text-gray-600 block">Monthly Payments</span>
        <span className="text-sm font-medium block bg-gray-50 p-2 mt-1">{monthlyPayments}</span>
      </div>
      <div>
        <span className="text-sm text-gray-600 block">Down Payment</span>
        <span className="text-sm font-medium block bg-gray-50 p-2 mt-1">{downPayment}</span>
      </div>
    </div>
  );
};

export default LoanCollapsedView;
