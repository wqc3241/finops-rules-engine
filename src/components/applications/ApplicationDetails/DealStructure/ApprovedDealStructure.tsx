
import React from 'react';
import { Button } from '@/components/ui/button';
import { DealStructureItem } from '@/types/application';
import OfferParameters from './OfferParameters';
import { BarChart2 } from 'lucide-react';

interface ApprovedDealStructureProps {
  items: DealStructureItem[];
  applicationType?: 'Lease' | 'Loan';
  lenderName?: string;
  onViewFinancialSummary?: () => void;
  showFinancialDetailButton?: boolean;
}

const ApprovedDealStructure: React.FC<ApprovedDealStructureProps> = ({
  items,
  applicationType = 'Lease',
  lenderName,
  onViewFinancialSummary,
  showFinancialDetailButton = false
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-md font-medium">Approved</h4>
        {showFinancialDetailButton && onViewFinancialSummary && (
          <Button variant="outline" size="sm" onClick={onViewFinancialSummary} className="flex items-center">
            <BarChart2 className="h-3 w-3 mr-1" />
            View Financial Summary
          </Button>
        )}
      </div>
      <OfferParameters 
        items={items} 
        applicationType={applicationType} 
        lenderName={lenderName} 
        section="approved"
        onViewFinancialSummary={onViewFinancialSummary}
      />
    </div>
  );
};

export default ApprovedDealStructure;
