
import React from 'react';

interface CollapsedViewProps {
  termLength: string;
  monthlyPayments: string;
  dueAtSigning: string;
}

const CollapsedView: React.FC<CollapsedViewProps> = ({ termLength, monthlyPayments, dueAtSigning }) => {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">Term:</span>
        <span className="text-xs font-medium bg-secondary px-2 py-1 rounded">{termLength} mo</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">Payment:</span>
        <span className="text-xs font-medium bg-secondary px-2 py-1 rounded">{monthlyPayments}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">Due:</span>
        <span className="text-xs font-medium bg-secondary px-2 py-1 rounded">{dueAtSigning}</span>
      </div>
    </div>
  );
};

export default CollapsedView;
