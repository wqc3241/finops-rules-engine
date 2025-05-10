
import React from 'react';

interface CollapsedViewProps {
  termLength: string;
  monthlyPayments: string;
  dueAtSigning: string;
}

const CollapsedView: React.FC<CollapsedViewProps> = ({ termLength, monthlyPayments, dueAtSigning }) => {
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
        <span className="text-sm text-gray-600 block">Due At Signing</span>
        <span className="text-sm font-medium block bg-gray-50 p-2 mt-1">{dueAtSigning}</span>
      </div>
    </div>
  );
};

export default CollapsedView;
