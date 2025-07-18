
import React from 'react';
import { FinancialSummary, LoanFinancialSummaryTabData, LeaseFinancialSummaryTabData } from '@/types/application';
import LoanFinancialSummaryView from '../LoanFinancialSummaryView';
import LeaseFinancialSummaryView from '../LeaseFinancialSummaryView';

interface CustomerFinancialSummaryViewProps {
  financialSummary: FinancialSummary;
}

const CustomerFinancialSummaryView: React.FC<CustomerFinancialSummaryViewProps> = ({ 
  financialSummary 
}) => {
  // Determine if this is a loan or lease type
  const isLoanType = financialSummary.type === 'Loan';
  
  // Get customer data based on type
  const customerData = isLoanType 
    ? financialSummary.loan?.customer 
    : financialSummary.lfs.customer;

  if (!customerData) {
    return <div className="p-2 text-center text-xs text-muted-foreground">No customer financial data available</div>;
  }

  // Use the appropriate view based on type, but only show Customer data
  return (
    <div className="text-xs space-y-1">
      {isLoanType ? (
        <LoanFinancialSummaryView 
          activeTab="Customer" 
          tabData={customerData as LoanFinancialSummaryTabData} 
        />
      ) : (
        <LeaseFinancialSummaryView 
          activeTab="Customer" 
          tabData={customerData as LeaseFinancialSummaryTabData} 
        />
      )}
    </div>
  );
};

export default CustomerFinancialSummaryView;
