
import React from 'react';
import LoanFinancialSummaryView from '../LoanFinancialSummaryView';
import LeaseFinancialSummaryView from '../LeaseFinancialSummaryView';

interface SummaryContentProps {
  isLoanType: boolean;
  activeTab: string;
  data: any;
}

const SummaryContent: React.FC<SummaryContentProps> = ({
  isLoanType,
  activeTab,
  data
}) => {
  if (!data) {
    return <div className="p-4 text-center text-gray-500">No financial data available</div>;
  }

  return isLoanType ? (
    <LoanFinancialSummaryView 
      activeTab={activeTab} 
      tabData={data} 
    />
  ) : (
    <LeaseFinancialSummaryView 
      activeTab={activeTab} 
      tabData={data} 
    />
  );
};

export default SummaryContent;
