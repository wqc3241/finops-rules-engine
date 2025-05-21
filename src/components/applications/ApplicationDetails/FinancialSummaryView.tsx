
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FinancialSummary } from '@/types/application';
import { useSearchParams } from 'react-router-dom';
import { usePresentedLender } from '@/utils/dealFinanceNavigation';
import SummaryHeader from './FinancialSummary/SummaryHeader';
import LenderTabs from './FinancialSummary/LenderTabs';
import SectionTabs from './FinancialSummary/SectionTabs';
import SummaryContent from './FinancialSummary/SummaryContent';

interface FinancialSummaryViewProps {
  financialSummary: FinancialSummary;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const FinancialSummaryView: React.FC<FinancialSummaryViewProps> = ({ 
  financialSummary,
  showBackButton = false,
  onBackClick
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const lenderFromUrl = searchParams.get('lender');
  const sectionFromUrl = searchParams.get('section') as 'requested' | 'approved' | 'customer' | null;
  const { presentedLender } = usePresentedLender();
  
  const isLoanType = financialSummary.type === 'Loan';
  
  // Check if we have lender summaries to display
  const hasMultipleLenders = financialSummary.lenderSummaries && Object.keys(financialSummary.lenderSummaries).length > 0;
  
  // If lender summaries exist and a lender is specified in the URL, find that lender
  const selectedLender = lenderFromUrl && financialSummary.lenderSummaries?.[decodeURIComponent(lenderFromUrl)];
  
  // Determine which tabs to show based on application type and selected lender
  const tabs = selectedLender
    ? selectedLender.tabs || ['Requested', 'Approved', 'Customer']
    : (isLoanType 
        ? financialSummary.loan?.tabs || ['Requested', 'Approved', 'Customer']
        : financialSummary.lfs.tabs);
  
  // Set initial active tab based on URL or default
  const [activeTab, setActiveTab] = useState<string>(
    sectionFromUrl 
      ? sectionFromUrl.charAt(0).toUpperCase() + sectionFromUrl.slice(1) 
      : (selectedLender?.activeTab || 
        (isLoanType 
          ? financialSummary.loan?.activeTab || 'Approved' 
          : financialSummary.lfs.activeTab))
  );
  const [expanded, setExpanded] = useState(true);
  
  // Set up lender tabs if there are multiple lenders with financial summaries
  const [selectedLenderName, setSelectedLenderName] = useState<string | null>(
    lenderFromUrl ? decodeURIComponent(lenderFromUrl) : 
    hasMultipleLenders ? Object.keys(financialSummary.lenderSummaries!)[0] : null
  );

  // Update active tab when URL changes
  useEffect(() => {
    if (sectionFromUrl) {
      const capitalizedSection = sectionFromUrl.charAt(0).toUpperCase() + sectionFromUrl.slice(1);
      if (tabs.includes(capitalizedSection)) {
        setActiveTab(capitalizedSection);
      }
    }
  }, [sectionFromUrl, tabs]);
  
  // Update selected lender when URL changes
  useEffect(() => {
    if (lenderFromUrl) {
      setSelectedLenderName(decodeURIComponent(lenderFromUrl));
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

  const toggleExpanded = () => {
    setExpanded(!expanded);
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
  const getFinancialData = () => {
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

  const { data, isLoanType: currentTypeIsLoan } = getFinancialData();

  return (
    <Card className="h-fit">
      <CardContent className="p-3">
        <SummaryHeader
          expanded={expanded}
          toggleExpanded={toggleExpanded}
          showBackButton={showBackButton}
          onBackClick={onBackClick}
          summaryType={currentTypeIsLoan ? 'Loan' : 'Lease'}
        />
        
        {expanded && (
          <>
            {/* Lender Selection Tabs */}
            <LenderTabs
              lenderSummaries={financialSummary.lenderSummaries}
              selectedLenderName={selectedLenderName}
              presentedLender={presentedLender}
              onLenderChange={handleLenderChange}
            />
            
            {/* Section Tabs */}
            <SectionTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
            
            {/* Financial Summary Content */}
            <SummaryContent
              isLoanType={currentTypeIsLoan}
              activeTab={activeTab}
              data={data}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialSummaryView;
