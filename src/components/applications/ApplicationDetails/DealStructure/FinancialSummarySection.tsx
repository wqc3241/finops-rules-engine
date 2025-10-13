
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import FinancialSummaryView from '../FinancialSummaryView';
import { FinancialSummary } from '@/types/application';

interface FinancialSummarySectionProps {
  lenderName: string;
  section: 'requested' | 'approved' | 'customer';
  financialSummary: FinancialSummary | undefined;
  onBackToDealStructure: () => void;
  applicationType: 'Loan' | 'Lease';
}

const FinancialSummarySection: React.FC<FinancialSummarySectionProps> = ({
  lenderName,
  section,
  financialSummary,
  onBackToDealStructure,
  applicationType
}) => {
  if (!financialSummary) return null;

  // Create simplified summary based on application type only
  const simplifiedSummary: FinancialSummary = {
    ...financialSummary,
    type: applicationType
  };

  return (
    <div>
      <div className="mb-6">
        <button 
          onClick={onBackToDealStructure}
          className="text-blue-600 hover:text-blue-800 underline text-sm font-medium flex items-center transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Deal Structure
        </button>
      </div>
      <FinancialSummaryView 
        financialSummary={simplifiedSummary}
        showBackButton={false}
        initialSection={section.charAt(0).toUpperCase() + section.slice(1) as 'Requested' | 'Approved' | 'Customer'}
      />
    </div>
  );
};

export default FinancialSummarySection;
