
import React from 'react';
import { Button } from '@/components/ui/button';
import { DealStructureItem } from '@/types/application';
import OfferParameters from './OfferParameters';
import { BarChart2 } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

interface RequestedDealStructureProps {
  items: DealStructureItem[];
  applicationType?: 'Lease' | 'Loan';
  lenderName?: string;
  onViewFinancialSummary?: () => void;
  showFinancialDetailButton?: boolean;
}

const RequestedDealStructure: React.FC<RequestedDealStructureProps> = ({
  items,
  applicationType = 'Lease',
  lenderName,
  onViewFinancialSummary,
  showFinancialDetailButton = false
}) => {
  const { id: applicationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const handleViewFinancialSummary = () => {
    if (onViewFinancialSummary) {
      onViewFinancialSummary();
    } else {
      // Navigate to financial summary with requested tab active
      const newParams = new URLSearchParams(searchParams);
      newParams.set('section', 'requested');
      if (lenderName) {
        newParams.set('lender', encodeURIComponent(lenderName));
      }
      navigate(`/applications/${applicationId}/financial-summary?${newParams.toString()}`);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-md font-medium">Requested</h4>
        {showFinancialDetailButton && (
          <Button variant="outline" size="sm" onClick={handleViewFinancialSummary} className="flex items-center">
            <BarChart2 className="h-3 w-3 mr-1" />
            View Financial Summary
          </Button>
        )}
      </div>
      <OfferParameters 
        items={items} 
        applicationType={applicationType} 
        lenderName={lenderName} 
        section="requested" 
        onViewFinancialSummary={handleViewFinancialSummary}
      />
    </div>
  );
};

export default RequestedDealStructure;
