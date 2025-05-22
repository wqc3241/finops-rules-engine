
import { useState, useEffect } from 'react';

// Hook to track which lender has been presented to the customer
export const usePresentedLender = () => {
  const [presentedLender, setPresentedLender] = useState<string | null>(null);
  const applicationId = window.location.pathname.split('/')[2]; // Extract from URL
  
  // Function to mark a lender as presented to customer
  const markLenderAsPresented = (lenderName: string) => {
    setPresentedLender(lenderName);
    // In a real app, you might save this to backend/localStorage
    if (applicationId) {
      localStorage.setItem(`app_${applicationId}_presentedLender`, lenderName);
    }
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
