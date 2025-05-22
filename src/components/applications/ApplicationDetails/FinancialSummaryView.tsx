
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FinancialSummary } from '@/types/application';
import { useFinancialSummaryData } from '@/hooks/useFinancialSummaryData';
import SummaryHeader from './FinancialSummary/SummaryHeader';
import SectionTabs from './FinancialSummary/SectionTabs';
import SummaryContent from './FinancialSummary/SummaryContent';
import { useSearchParams } from 'react-router-dom';

interface FinancialSummaryViewProps {
  financialSummary: FinancialSummary;
  showBackButton?: boolean;
  onBackClick?: () => void;
  initialSection?: 'Requested' | 'Approved' | 'Customer';
}

const FinancialSummaryView: React.FC<FinancialSummaryViewProps> = ({ 
  financialSummary,
  showBackButton = false,
  onBackClick,
  initialSection
}) => {
  const [expanded, setExpanded] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const {
    tabs,
    activeTab,
    handleTabChange,
    selectedLenderName,
    lenderSummaries,
    presentedLender,
    data,
    currentTypeIsLoan,
    hasMultipleLenders
  } = useFinancialSummaryData({ 
    financialSummary,
    initialSection
  });

  // Update the URL when the active tab changes
  useEffect(() => {
    if (activeTab) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('section', activeTab.toLowerCase());
      setSearchParams(newParams, { replace: true });
    }
  }, [activeTab, setSearchParams]);
  
  // Set initial tab from prop if provided
  useEffect(() => {
    if (initialSection && tabs.includes(initialSection)) {
      handleTabChange(initialSection);
    }
  }, [initialSection, tabs]);

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
