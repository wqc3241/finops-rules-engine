
import React, { useState } from 'react';
import ApplicationHistoryView from '@/components/applications/ApplicationDetails/ApplicationHistoryView';
import NotesView from '@/components/applications/ApplicationDetails/NotesView';
import RiskComplianceView from '@/components/applications/ApplicationDetails/RiskComplianceView';
import CombinedApplicationView from './CombinedApplicationView';
import { Note } from '@/types/application';
import { mockRiskComplianceData } from '@/data/mock/riskCompliance';

interface TabContentProps {
  tab?: string;
  applicationFullDetails: any;
  notes: Note[];
  onScrollSectionChange?: (section: string) => void;
}

const TabContent: React.FC<TabContentProps> = ({ 
  tab = 'details', 
  applicationFullDetails,
  notes,
  onScrollSectionChange
}) => {
  switch (tab) {
    case 'risk-compliance':
      return (
        <RiskComplianceView
          requiredNotices={mockRiskComplianceData.requiredNotices}
          complianceChecks={mockRiskComplianceData.complianceChecks}
          activityHistory={mockRiskComplianceData.activityHistory}
          qcErrors={mockRiskComplianceData.qcErrors}
        />
      );
    case 'history':
      return <ApplicationHistoryView history={applicationFullDetails.history} />;
    case 'notes':
      return <NotesView notes={notes} />;
    case 'details':
    case 'financial-summary':
    case 'order-details':
    default:
      return (
        <CombinedApplicationView
          applicationFullDetails={applicationFullDetails}
          notes={notes}
          activeSection={tab}
          onSectionChange={onScrollSectionChange}
        />
      );
  }
};

export default TabContent;
