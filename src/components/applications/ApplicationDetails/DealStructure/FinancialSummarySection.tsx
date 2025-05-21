
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FinancialSummaryView from '../FinancialSummaryView';
import { FinancialSummary } from '@/types/application';

interface FinancialSummarySectionProps {
  lenderName: string;
  section: 'requested' | 'approved' | 'customer';
  financialSummary: FinancialSummary | undefined;
  onBackToDealStructure: () => void;
}

const FinancialSummarySection: React.FC<FinancialSummarySectionProps> = ({
  lenderName,
  section,
  financialSummary,
  onBackToDealStructure
}) => {
  if (!financialSummary) return null;

  // Get lender-specific financial summary if available
  const lenderFinancialSummary = financialSummary.lenderSummaries?.[lenderName];
  
  // Create a financial summary object for this specific lender if we have data
  const lenderSpecificSummary = lenderFinancialSummary ? {
    ...financialSummary,
    selectedLender: lenderName,
    selectedTab: section
  } : undefined;

  if (!lenderSpecificSummary) return null;

  return (
    <div>
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={onBackToDealStructure}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Deal Structure
        </Button>
      </div>
      <FinancialSummaryView 
        financialSummary={lenderSpecificSummary}
        showBackButton={false}
      />
    </div>
  );
};

export default FinancialSummarySection;
