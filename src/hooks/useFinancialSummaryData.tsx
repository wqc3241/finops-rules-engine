
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FinancialSummary } from '@/types/application';
import { useDealFinancialNavigation } from './useDealFinancialNavigation';

interface UseFinancialSummaryDataProps {
  financialSummary: FinancialSummary;
  initialSection?: 'Requested' | 'Approved' | 'Customer';
}

export function useFinancialSummaryData({ financialSummary, initialSection }: UseFinancialSummaryDataProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getCurrentLender, getCurrentSection, presentedLender } = useDealFinancialNavigation();
  
  const lenderFromUrl = getCurrentLender();
  const sectionFromUrl = getCurrentSection();
  
  // Add debug logging
  console.log('useFinancialSummaryData - input financialSummary:', financialSummary);
  console.log('useFinancialSummaryData - lenderFromUrl:', lenderFromUrl);
  console.log('useFinancialSummaryData - sectionFromUrl:', sectionFromUrl);
  
  // Default to the application's main type
  const defaultIsLoanType = financialSummary.type === 'Loan';
  
  // Check if we have lender summaries to display
  const hasMultipleLenders = financialSummary.lenderSummaries && Object.keys(financialSummary.lenderSummaries).length > 0;
  
  // Get tabs based on application type
  const tabs = defaultIsLoanType 
    ? financialSummary.loan?.tabs || ['Requested', 'Approved', 'Customer']
    : financialSummary.lfs?.tabs || ['Requested', 'Approved', 'Customer'];
  
  // Set initial active tab based on initialSection, URL, or default
  const initialTabName = initialSection || 
    (sectionFromUrl 
      ? sectionFromUrl.charAt(0).toUpperCase() + sectionFromUrl.slice(1) as 'Requested' | 'Approved' | 'Customer'
      : (defaultIsLoanType 
          ? financialSummary.loan?.activeTab || 'Approved' 
          : financialSummary.lfs?.activeTab || 'Approved'));
          
  const [activeTab, setActiveTab] = useState<string>(initialTabName);

  // Update active tab when URL or initialSection changes
  useEffect(() => {
    if (initialSection && tabs.includes(initialSection)) {
      setActiveTab(initialSection);
    } else if (sectionFromUrl) {
      const capitalizedSection = sectionFromUrl.charAt(0).toUpperCase() + sectionFromUrl.slice(1) as 'Requested' | 'Approved' | 'Customer';
      if (tabs.includes(capitalizedSection)) {
        setActiveTab(capitalizedSection);
      }
    }
  }, [sectionFromUrl, initialSection, tabs]);
  

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Update URL to reflect the selected tab
    const newParams = new URLSearchParams(searchParams);
    newParams.set('section', tab.toLowerCase());
    setSearchParams(newParams);
  };

  // Get current financial data based on application type only
  const getCurrentFinancialData = () => {
    const currentIsLoanType = financialSummary.type === 'Loan';
    const tabLower = activeTab.toLowerCase() as 'requested' | 'approved' | 'customer';
    
    // Always use application-level data, ignore lender-specific summaries
    if (currentIsLoanType && financialSummary.loan) {
      return {
        data: financialSummary.loan[tabLower] || {},
        isLoanType: true
      };
    } else if (financialSummary.lfs) {
      return {
        data: financialSummary.lfs[tabLower] || {},
        isLoanType: false
      };
    }
    
    // Fallback
    return {
      data: {},
      isLoanType: currentIsLoanType
    };
  };

  const { data, isLoanType: currentTypeIsLoan } = getCurrentFinancialData();

  console.log('useFinancialSummaryData - final data:', { data, currentTypeIsLoan });

  return {
    tabs,
    activeTab,
    handleTabChange,
    data,
    currentTypeIsLoan,
    hasMultipleLenders: false
  };
}
