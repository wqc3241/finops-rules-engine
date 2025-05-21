
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FinancialSummary } from '@/types/application';
import { useFinancialSummaryData } from '@/hooks/useFinancialSummaryData';
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
  const [expanded, setExpanded] = useState(true);
  
  const {
    tabs,
    activeTab,
    handleTabChange,
    selectedLenderName,
    handleLenderChange,
    lenderSummaries,
    presentedLender,
    data,
    currentTypeIsLoan,
    hasMultipleLenders
  } = useFinancialSummaryData({ financialSummary });

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

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
            {/* Lender Selection Tabs - only show if there are multiple lenders */}
            {hasMultipleLenders && (
              <LenderTabs
                lenderSummaries={lenderSummaries}
                selectedLenderName={selectedLenderName}
                presentedLender={presentedLender}
                onLenderChange={handleLenderChange}
              />
            )}
            
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
