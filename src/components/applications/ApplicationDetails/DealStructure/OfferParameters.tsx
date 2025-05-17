
import React from 'react';
import { DealStructureItem } from '@/types/application';
import { useFinancialNavigation } from '@/utils/dealFinanceNavigation';
import { useParams } from 'react-router-dom';

interface OfferParametersProps {
  items: DealStructureItem[];
  isCustomer?: boolean;
  applicationType?: 'Lease' | 'Loan';
  lenderName?: string;
  section?: 'requested' | 'approved' | 'customer';
  onViewFinancialSummary?: () => void;
}

const OfferParameters: React.FC<OfferParametersProps> = ({ 
  items, 
  isCustomer = false,
  applicationType = 'Lease',
  lenderName,
  section,
  onViewFinancialSummary
}) => {
  const { id: applicationId } = useParams<{ id: string }>();
  const { navigateToFinancialSummary } = useFinancialNavigation();
  
  const handleViewFinancialSummary = () => {
    if (onViewFinancialSummary) {
      onViewFinancialSummary();
    } else if (lenderName && section && applicationId) {
      navigateToFinancialSummary(applicationId, lenderName, section);
    }
  };
  
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
          <button
            onClick={handleViewFinancialSummary}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            View Financial Summary
          </button>
        </div>
      )}
    </>
  );
};

export default OfferParameters;
