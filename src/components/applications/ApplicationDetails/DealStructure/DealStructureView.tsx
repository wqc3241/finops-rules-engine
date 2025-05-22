
import React from 'react';
import { Button } from '@/components/ui/button';
import { DealStructureItem } from '@/types/application';
import OfferParameters from './OfferParameters';
import { BarChart2 } from 'lucide-react';

interface DealStructureViewProps {
  items: DealStructureItem[];
  title: string;
  applicationType?: 'Lease' | 'Loan';
  lenderName?: string;
  section: 'requested' | 'approved' | 'customer';
  onViewFinancialSummary?: () => void;
  showFinancialDetailButton?: boolean;
  isCustomer?: boolean;
}

const DealStructureView: React.FC<DealStructureViewProps> = ({
  items,
  title,
  applicationType = 'Lease',
  lenderName,
  section,
  onViewFinancialSummary,
  showFinancialDetailButton = false,
  isCustomer = false
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-md font-medium">{title}</h4>
        {showFinancialDetailButton && (
          <Button variant="outline" size="sm" onClick={onViewFinancialSummary} className="flex items-center">
            <BarChart2 className="h-3 w-3 mr-1" />
            View Financial Summary
          </Button>
        )}
      </div>
      <OfferParameters 
        items={items} 
        isCustomer={isCustomer} 
        applicationType={applicationType} 
        lenderName={lenderName} 
        section={section}
        onViewFinancialSummary={onViewFinancialSummary}
      />
    </div>
  );
};

export default DealStructureView;
