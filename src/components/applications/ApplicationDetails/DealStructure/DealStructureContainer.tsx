
import React from 'react';
import { DealStructureOffer } from '@/types/application';
import LeaseDealStructureSection from './LeaseDealStructureSection';
import LoanDealStructureSection from './LoanDealStructureSection';

interface DealStructureContainerProps {
  dealStructure: DealStructureOffer[];
  applicationType?: 'Lease' | 'Loan';
}

const DealStructureContainer: React.FC<DealStructureContainerProps> = ({ 
  dealStructure, 
  applicationType = 'Lease' 
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
    return <LoanDealStructureSection dealStructure={loanOffers} />;
  }

  return <LeaseDealStructureSection dealStructure={leaseOffers} />;
};

export default DealStructureContainer;
