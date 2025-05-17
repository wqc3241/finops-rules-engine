
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

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

// Hook to track which lender has been presented to the customer
export const usePresentedLender = () => {
  const [presentedLender, setPresentedLender] = useState<string | null>(null);
  const { id: applicationId } = useParams<{ id: string }>();
  
  // Function to mark a lender as presented to customer
  const markLenderAsPresented = (lenderName: string) => {
    setPresentedLender(lenderName);
    // In a real app, you might save this to backend/localStorage
    localStorage.setItem(`app_${applicationId}_presentedLender`, lenderName);
  };
  
  // Load the presented lender from localStorage on mount
  useEffect(() => {
    if (applicationId) {
      const savedLender = localStorage.getItem(`app_${applicationId}_presentedLender`);
      if (savedLender) {
        setPresentedLender(savedLender);
      }
    }
  }, [applicationId]);
  
  return { presentedLender, markLenderAsPresented };
};

// Hook for navigating to financial summary
export const useFinancialNavigation = () => {
  const navigate = useNavigate();
  const { presentedLender, markLenderAsPresented } = usePresentedLender();

  const navigateToFinancialSummary = (
    applicationId: string, 
    lenderName: string, 
    section: 'requested' | 'approved' | 'customer',
    markAsPresented: boolean = false
  ) => {
    if (markAsPresented) {
      markLenderAsPresented(lenderName);
    }
    navigate(getFinancialSummaryUrl(applicationId, lenderName, section));
  };

  return { 
    navigateToFinancialSummary, 
    presentedLender,
    markLenderAsPresented 
  };
};
