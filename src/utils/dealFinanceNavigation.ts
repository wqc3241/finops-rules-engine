
import { useNavigate } from 'react-router-dom';

// Function to build URL for financial summary with pre-selected lender and tab
export const getFinancialSummaryUrl = (
  applicationId: string, 
  lenderName: string, 
  section: 'requested' | 'approved' | 'customer'
): string => {
  const params = new URLSearchParams();
  params.set('lender', encodeURIComponent(lenderName));
  params.set('section', section);
  return `/applications/${applicationId}/financial-summary?${params.toString()}`;
};

// Hook for navigating to financial summary
export const useFinancialNavigation = () => {
  const navigate = useNavigate();

  const navigateToFinancialSummary = (
    applicationId: string, 
    lenderName: string, 
    section: 'requested' | 'approved' | 'customer'
  ) => {
    navigate(getFinancialSummaryUrl(applicationId, lenderName, section));
  };

  return { navigateToFinancialSummary };
};
