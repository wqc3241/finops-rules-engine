
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { FinancialSummary } from '@/types/application';
import { Button } from '@/components/ui/button';
import LoanFinancialSummaryView from './LoanFinancialSummaryView';
import LeaseFinancialSummaryView from './LeaseFinancialSummaryView';
import { useSearchParams } from 'react-router-dom';

interface FinancialSummaryViewProps {
  financialSummary: FinancialSummary;
}

const FinancialSummaryView: React.FC<FinancialSummaryViewProps> = ({ financialSummary }) => {
  const [searchParams] = useSearchParams();
  const lenderFromUrl = searchParams.get('lender');
  const sectionFromUrl = searchParams.get('section') as 'requested' | 'approved' | 'customer' | null;
  
  const isLoanType = financialSummary.type === 'Loan';
  
  // If lender summaries exist and a lender is specified in the URL, find that lender
  const selectedLender = lenderFromUrl && financialSummary.lenderSummaries?.[decodeURIComponent(lenderFromUrl)];
  
  // Determine which tabs to show based on application type and selected lender
  const tabs = selectedLender
    ? selectedLender.tabs
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
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  // Set up lender tabs if there are multiple lenders with financial summaries
  const hasMultipleLenders = financialSummary.lenderSummaries && Object.keys(financialSummary.lenderSummaries).length > 0;
  const [selectedLenderName, setSelectedLenderName] = useState<string | null>(lenderFromUrl || null);
  
  // Get current financial data based on selected lender and tab
  const getFinancialData = () => {
    if (selectedLender) {
      // Use selected lender's data
      const lenderType = selectedLender.type;
      const tabLower = activeTab.toLowerCase() as 'requested' | 'approved' | 'customer';
      return {
        data: selectedLender[tabLower],
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
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-medium">
            Financial Summary {currentTypeIsLoan ? '(Loan)' : '(Lease)'} 
            {selectedLenderName && ` - ${decodeURIComponent(selectedLenderName)}`}
          </h3>
          <div className="flex items-center cursor-pointer" onClick={toggleExpanded}>
            {expanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </div>
        </div>
        
        {expanded && (
          <>
            {/* Lender Selection if multiple lenders */}
            {hasMultipleLenders && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Select Lender</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(financialSummary.lenderSummaries!).map((lenderName) => (
                    <Button
                      key={lenderName}
                      variant={selectedLenderName === lenderName ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={() => setSelectedLenderName(lenderName)}
                    >
                      {lenderName}
                    </Button>
                  ))}
                </div>
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
