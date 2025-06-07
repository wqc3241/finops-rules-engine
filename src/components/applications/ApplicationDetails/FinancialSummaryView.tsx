
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FinancialSummary } from '@/types/application';
import { useFinancialSummaryData } from '@/hooks/useFinancialSummaryData';
import SummaryHeader from './FinancialSummary/SummaryHeader';
import SectionTabs from './FinancialSummary/SectionTabs';
import SummaryContent from './FinancialSummary/SummaryContent';

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
  
  // Add debug logging to ensure we're getting the right data
  console.log('FinancialSummaryView - financialSummary:', financialSummary);
  
  const {
    tabs,
    activeTab,
    handleTabChange,
    data,
    currentTypeIsLoan
  } = useFinancialSummaryData({ 
    financialSummary,
    initialSection
  });

  // Add debug logging for the processed data
  console.log('FinancialSummaryView - processed data:', { tabs, activeTab, data, currentTypeIsLoan });

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
