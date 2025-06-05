
import React from 'react';
import { FinancialSummary, DealStructureOffer } from '@/types/application';
import DealStructureSection from './DealStructure/DealStructureSection';

interface CombinedFinancialViewProps {
  financialSummary: FinancialSummary;
  dealStructure: DealStructureOffer[];
  applicationType: 'Lease' | 'Loan';
  allCardsExpanded?: boolean;
  onAllCardsExpandedChange?: (expanded: boolean) => void;
}

const CombinedFinancialView: React.FC<CombinedFinancialViewProps> = ({
  financialSummary,
  dealStructure,
  applicationType,
  allCardsExpanded = false,
  onAllCardsExpandedChange
}) => {
  return (
    <div className="space-y-6">
      <DealStructureSection
        dealStructure={dealStructure}
        title="Deal Structure"
        applicationType={applicationType}
        showFinancialDetailButton={true}
        financialSummary={financialSummary}
        allCardsExpanded={allCardsExpanded}
        onAllCardsExpandedChange={onAllCardsExpandedChange}
      />
    </div>
  );
};

export default CombinedFinancialView;
