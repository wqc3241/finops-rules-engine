
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
  const { id: applicationId } = useParams<{ id: string }>();
  const { navigateToFinancialSummary, presentedLender } = useFinancialNavigation();
  
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
          <button
            onClick={handleViewFinancialSummary}
            className={`text-sm text-blue-600 hover:text-blue-800 flex items-center
                      ${isPresented && isCustomer ? 'font-bold' : ''}`}
          >
            View Financial Summary
            {isPresented && isCustomer && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                Presented
              </span>
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default OfferParameters;
