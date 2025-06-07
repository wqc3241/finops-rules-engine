
import React from 'react';
import { FinancialSummary } from '@/types/application';
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
    return <div className="p-4 text-center text-muted-foreground">No customer financial data available</div>;
  }

  // Use the appropriate view based on type, but only show Customer data
  return isLoanType ? (
    <LoanFinancialSummaryView 
      activeTab="Customer" 
      tabData={customerData} 
    />
  ) : (
    <LeaseFinancialSummaryView 
      activeTab="Customer" 
      tabData={customerData} 
    />
  );
};

export default CustomerFinancialSummaryView;
