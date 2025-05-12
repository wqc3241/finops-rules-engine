
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { FinancialSummary } from '@/types/application';
import { Button } from '@/components/ui/button';
import LoanFinancialSummaryView from './LoanFinancialSummaryView';
import LeaseFinancialSummaryView from './LeaseFinancialSummaryView';

interface FinancialSummaryViewProps {
  financialSummary: FinancialSummary;
}

const FinancialSummaryView: React.FC<FinancialSummaryViewProps> = ({ financialSummary }) => {
  const isLoanType = financialSummary.type === 'Loan';
  
  // Determine which tabs to show based on application type
  const tabs = isLoanType 
    ? financialSummary.loan?.tabs || ['Requested', 'Approved', 'Customer']
    : financialSummary.lfs.tabs;
  
  const [activeTab, setActiveTab] = useState(
    isLoanType 
      ? financialSummary.loan?.activeTab || 'Approved' 
      : financialSummary.lfs.activeTab
  );
  const [expanded, setExpanded] = useState(true);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Logging for debugging
  console.log('Financial Summary Type:', financialSummary.type);
  console.log('Is Loan Type:', isLoanType);
  
  return (
    <Card className="h-fit">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Financial Summary {isLoanType ? '(Loan)' : '(Lease)'}</h3>
          <div className="flex items-center cursor-pointer" onClick={toggleExpanded}>
            {expanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </div>
        </div>
        
        {expanded && (
          <>
            {/* Tabs */}
            <div className="flex mb-4">
              {tabs.map((tab, index) => (
                <Button 
                  key={index} 
                  variant={tab === activeTab ? "default" : "outline"}
                  size="sm"
                  className="mr-2 text-xs"
                  onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>
            
            {isLoanType ? (
              // Loan Financial Summary
              <LoanFinancialSummaryView 
                activeTab={activeTab} 
                tabData={financialSummary.loan?.[activeTab.toLowerCase()] || {}} 
              />
            ) : (
              // Lease Financial Summary
              <LeaseFinancialSummaryView 
                activeTab={activeTab} 
                tabData={financialSummary.lfs[activeTab.toLowerCase()]} 
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialSummaryView;
