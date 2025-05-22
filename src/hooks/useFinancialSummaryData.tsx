
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
  
  const isLoanType = financialSummary.type === 'Loan';
  
  // Check if we have lender summaries to display
  const hasMultipleLenders = financialSummary.lenderSummaries && Object.keys(financialSummary.lenderSummaries).length > 0;
  
  // Determine which tabs to show based on application type and selected lender
  const [selectedLenderName, setSelectedLenderName] = useState<string | null>(
    lenderFromUrl || 
    (hasMultipleLenders ? Object.keys(financialSummary.lenderSummaries!)[0] : null)
  );
  
  // If lender summaries exist and a lender is specified in the URL, find that lender
  const selectedLender = selectedLenderName && financialSummary.lenderSummaries?.[selectedLenderName];
  
  // Get tabs based on the selection
  const tabs = selectedLender
    ? selectedLender.tabs || ['Requested', 'Approved', 'Customer']
    : (isLoanType 
        ? financialSummary.loan?.tabs || ['Requested', 'Approved', 'Customer']
        : financialSummary.lfs.tabs);
  
  // Set initial active tab based on initialSection, URL, or default
  const initialTabName = initialSection || 
    (sectionFromUrl 
      ? sectionFromUrl.charAt(0).toUpperCase() + sectionFromUrl.slice(1) as 'Requested' | 'Approved' | 'Customer'
      : (selectedLender?.activeTab || 
        (isLoanType 
          ? financialSummary.loan?.activeTab || 'Approved' 
          : financialSummary.lfs.activeTab)));
          
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
  
  // Update selected lender when URL changes
  useEffect(() => {
    if (lenderFromUrl) {
      setSelectedLenderName(lenderFromUrl);
    } else if (hasMultipleLenders) {
      // Default to first lender if none specified
      setSelectedLenderName(Object.keys(financialSummary.lenderSummaries!)[0]);
    }
  }, [lenderFromUrl, hasMultipleLenders, financialSummary.lenderSummaries]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Update URL to reflect the selected tab
    const newParams = new URLSearchParams(searchParams);
    newParams.set('section', tab.toLowerCase());
    setSearchParams(newParams);
  };
  
  // Handle lender tab change
  const handleLenderChange = (lenderName: string) => {
    setSelectedLenderName(lenderName);
    // Update URL to reflect the selected lender
    const newParams = new URLSearchParams(searchParams);
    newParams.set('lender', lenderName);
    setSearchParams(newParams);
  };

  // Get current financial data based on selected lender and tab
  const getCurrentFinancialData = () => {
    if (selectedLenderName && financialSummary.lenderSummaries?.[selectedLenderName]) {
      // Use selected lender's data
      const lender = financialSummary.lenderSummaries[selectedLenderName];
      const lenderType = lender.type;
      const tabLower = activeTab.toLowerCase() as 'requested' | 'approved' | 'customer';
      return {
        data: lender[tabLower],
        isLoanType: lenderType === 'Loan'
      };
    } else {
      // Use default financial summary data
      const tabLower = activeTab.toLowerCase() as 'requested' | 'approved' | 'customer';
      return {
        data: isLoanType 
          ? financialSummary.loan?.[tabLower] || {} 
          : financialSummary.lfs[tabLower],
        isLoanType: isLoanType
      };
    }
  };

  const { data, isLoanType: currentTypeIsLoan } = getCurrentFinancialData();

  return {
    tabs,
    activeTab,
    handleTabChange,
    selectedLenderName,
    handleLenderChange,
    lenderSummaries: financialSummary.lenderSummaries,
    presentedLender,
    data,
    currentTypeIsLoan,
    hasMultipleLenders
  };
}
