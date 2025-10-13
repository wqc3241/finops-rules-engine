
import React from 'react';
import ApplicationHistoryView from '@/components/applications/ApplicationDetails/ApplicationHistoryView';
import NotesView from '@/components/applications/ApplicationDetails/NotesView';
import RiskComplianceView from '@/components/applications/ApplicationDetails/RiskComplianceView';
import FundingView from '@/components/applications/ApplicationDetails/FundingView';
import DocumentsView from '@/components/applications/ApplicationDetails/DocumentsView';
import CombinedApplicationView from './CombinedApplicationView';
import { Note } from '@/types/application';
import { mockRiskComplianceData } from '@/data/mock/riskCompliance';

interface TabContentProps {
  tab?: string;
  applicationId?: string;
  applicationFullDetails: any;
  notes: Note[];
  onActiveSectionChange?: (section: string) => void;
}

const TabContent: React.FC<TabContentProps> = ({ 
  tab = 'details',
  applicationId,
  applicationFullDetails,
  notes,
  onActiveSectionChange
}) => {
  switch (tab) {
    case 'funding':
      return <FundingView applicationFullDetails={applicationFullDetails} />;
    case 'risk-compliance':
      return (
        <RiskComplianceView
          requiredNotices={mockRiskComplianceData.requiredNotices}
          complianceChecks={mockRiskComplianceData.complianceChecks}
          activityHistory={mockRiskComplianceData.activityHistory}
          qcErrors={mockRiskComplianceData.qcErrors}
        />
      );
    case 'documents':
      return <DocumentsView applicationId={applicationId || ''} />;
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
          onActiveSectionChange={onActiveSectionChange}
          applicationId={applicationId}
        />
      );
  }
};

export default TabContent;
