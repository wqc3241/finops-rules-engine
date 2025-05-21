
import React from 'react';
import { DealStructureItem } from '@/types/application';
import { useFinancialNavigation } from '@/utils/dealFinanceNavigation';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart2 } from 'lucide-react';

interface OfferParametersProps {
  items: DealStructureItem[];
  isCustomer?: boolean;
  applicationType?: 'Lease' | 'Loan';
  lenderName?: string;
  section?: 'requested' | 'approved' | 'customer';
  onViewFinancialSummary?: () => void;
  markAsPresented?: boolean;
}

const OfferParameters: React.FC<OfferParametersProps> = ({
  items,
  isCustomer = false,
  applicationType = 'Lease',
  lenderName,
  section,
  onViewFinancialSummary,
  markAsPresented = false
}) => {
  const {
    id: applicationId
  } = useParams<{
    id: string;
  }>();
  const {
    navigateToFinancialSummary,
    presentedLender
  } = useFinancialNavigation();
  
  const handleViewFinancialSummary = () => {
    if (onViewFinancialSummary) {
      onViewFinancialSummary();
    } else if (lenderName && section && applicationId) {
      navigateToFinancialSummary(applicationId, lenderName, section, markAsPresented);
    }
  };

  // Check if this lender is the one presented to customer
  const isPresented = presentedLender === lenderName;
  
  return (
    <>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col mb-2">
            <span className="text-gray-500">{item.label}</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
      
      {lenderName && section && (
        <div className="mt-4">
          {onViewFinancialSummary && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewFinancialSummary} 
              className="flex items-center"
            >
              <BarChart2 className="h-3 w-3 mr-1" />
              View Financial Summary
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default OfferParameters;
