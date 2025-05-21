
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
