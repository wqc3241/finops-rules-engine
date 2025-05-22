
import React from 'react';
import LoanFinancialSummaryView from '../LoanFinancialSummaryView';
import LeaseFinancialSummaryView from '../LeaseFinancialSummaryView';

interface SummaryContentProps {
  isLoanType: boolean;
  activeTab: string;
  data: any;
  section?: 'requested' | 'approved' | 'customer'; // Add section type
}

const SummaryContent: React.FC<SummaryContentProps> = ({
  isLoanType,
  activeTab,
  data,
  section
}) => {
  if (!data) {
    return <div className="p-4 text-center text-gray-500">No financial data available</div>;
  }

  return isLoanType ? (
    <LoanFinancialSummaryView 
      activeTab={activeTab} 
      tabData={data} 
      section={section}
    />
  ) : (
    <LeaseFinancialSummaryView 
      activeTab={activeTab} 
      tabData={data} 
      section={section}
    />
  );
};

export default SummaryContent;
