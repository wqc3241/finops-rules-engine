
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronUp, ChevronDown, Check } from 'lucide-react';
import { FinancialSummary } from '@/types/application';
import { Button } from '@/components/ui/button';
import LoanFinancialSummaryView from './LoanFinancialSummaryView';
import LeaseFinancialSummaryView from './LeaseFinancialSummaryView';
import { useSearchParams } from 'react-router-dom';
import TabComponent, { TabItem } from '@/components/dashboard/TabComponent';
import { cn } from '@/lib/utils';

interface FinancialSummaryViewProps {
  financialSummary: FinancialSummary;
}

const FinancialSummaryView: React.FC<FinancialSummaryViewProps> = ({ financialSummary }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const lenderFromUrl = searchParams.get('lender');
  const sectionFromUrl = searchParams.get('section') as 'requested' | 'approved' | 'customer' | null;
  
  const isLoanType = financialSummary.type === 'Loan';
  
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

  // Update active tab when URL changes
  useEffect(() => {
    if (sectionFromUrl) {
      const capitalizedSection = sectionFromUrl.charAt(0).toUpperCase() + sectionFromUrl.slice(1);
      if (tabs.includes(capitalizedSection)) {
        setActiveTab(capitalizedSection);
      }
    }
  }, [sectionFromUrl, tabs]);

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
  
  // Set up lender tabs if there are multiple lenders with financial summaries
  const hasMultipleLenders = financialSummary.lenderSummaries && Object.keys(financialSummary.lenderSummaries).length > 0;
  const [selectedLenderName, setSelectedLenderName] = useState<string | null>(lenderFromUrl || null);
  
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
  
  // Create lender tabs if multiple lenders exist
  const createLenderTabItems = (): TabItem[] => {
    if (!hasMultipleLenders) return [];
    
    return Object.keys(financialSummary.lenderSummaries!).map(lenderName => {
      const lenderSummary = financialSummary.lenderSummaries![lenderName];
      const isPresented = lenderSummary.selectedForCustomer === true;
      
      return {
        value: lenderName,
        label: (
          <div className="flex items-center gap-1">
            <span>{lenderName}</span>
            {isPresented && <Check className="h-4 w-4 text-green-600" />}
          </div>
        ),
        content: <></> // Content is rendered outside of TabContent
      };
    });
  };

  return (
    <Card className="h-fit">
      <CardContent className="p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-medium">
            Financial Summary {currentTypeIsLoan ? '(Loan)' : '(Lease)'} 
          </h3>
          <div className="flex items-center cursor-pointer" onClick={toggleExpanded}>
            {expanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </div>
        </div>
        
        {expanded && (
          <>
            {/* Lender Selection Tabs */}
            {hasMultipleLenders && (
              <div className="mb-4">
                <TabComponent 
                  defaultValue={selectedLenderName || Object.keys(financialSummary.lenderSummaries!)[0]} 
                  items={createLenderTabItems()}
                  onValueChange={handleLenderChange}
                />
              </div>
            )}
            
            {/* Section Tabs */}
            <div className="flex mb-2">
              {tabs.map((tab, index) => (
                <Button 
                  key={index} 
                  variant={tab === activeTab ? "default" : "outline"}
                  size="sm"
                  className="mr-1 text-xs h-7 px-2"
                  onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>
            
            {currentTypeIsLoan ? (
              // Loan Financial Summary
              <LoanFinancialSummaryView 
                activeTab={activeTab} 
                tabData={data as any} 
              />
            ) : (
              // Lease Financial Summary
              <LeaseFinancialSummaryView 
                activeTab={activeTab} 
                tabData={data as any} 
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialSummaryView;
