
import React from 'react';
import { DealStructureOffer, FinancialSummary } from '@/types/application';
import LeaseDealStructureSection from './LeaseDealStructureSection';
import LoanDealStructureSection from './LoanDealStructureSection';

interface DealStructureContainerProps {
  dealStructure: DealStructureOffer[];
  applicationType?: 'Lease' | 'Loan';
  showFinancialDetailButton?: boolean;
  onViewFinancialDetail?: (lenderName: string) => void;
  financialSummary?: FinancialSummary; // Add this prop to pass financial summary data
}

const DealStructureContainer: React.FC<DealStructureContainerProps> = ({ 
  dealStructure, 
  applicationType = 'Lease',
  showFinancialDetailButton = false,
  onViewFinancialDetail,
  financialSummary
}) => {
  // Set application type for each offer if not already set
  const offersWithType = dealStructure.map(offer => ({
    ...offer,
    applicationType: offer.applicationType || applicationType
  }));

  // Filter offers based on application type
  const leaseOffers = offersWithType.filter(offer => offer.applicationType !== 'Loan');
  const loanOffers = offersWithType.filter(offer => offer.applicationType === 'Loan');

  if (applicationType === 'Loan') {
    return (
      <LoanDealStructureSection 
        dealStructure={loanOffers} 
        showFinancialDetailButton={showFinancialDetailButton}
        onViewFinancialDetail={onViewFinancialDetail}
        financialSummary={financialSummary}
      />
    );
  }

  return (
    <LeaseDealStructureSection 
      dealStructure={leaseOffers}
      showFinancialDetailButton={showFinancialDetailButton}
      onViewFinancialDetail={onViewFinancialDetail}
      financialSummary={financialSummary}
    />
  );
};

export default DealStructureContainer;
