
import React from 'react';
import ApplicationData from '@/components/applications/ApplicationDetails/ApplicationData';
import DealStructureSection from '@/components/applications/ApplicationDetails/DealStructure/DealStructureSection';
import OrderDetailsView from '@/components/applications/ApplicationDetails/OrderDetailsView';
import ApplicationHistoryView from '@/components/applications/ApplicationDetails/ApplicationHistoryView';
import NotesView from '@/components/applications/ApplicationDetails/NotesView';
import FinancialSummaryView from '@/components/applications/ApplicationDetails/FinancialSummaryView';
import { Note } from '@/types/application';

interface TabContentProps {
  tab?: string;
  applicationFullDetails: any;
  notes: Note[];
}

const TabContent: React.FC<TabContentProps> = ({ 
  tab = 'details', 
  applicationFullDetails,
  notes
}) => {
  switch (tab) {
    case 'financial-summary':
      return <FinancialSummaryView financialSummary={applicationFullDetails.financialSummary} />;
    case 'order-details':
      return <OrderDetailsView orderDetails={applicationFullDetails.orderDetails} />;
    case 'history':
      return <ApplicationHistoryView history={applicationFullDetails.history} />;
    case 'notes':
      return <NotesView notes={notes} />;
    case 'details':
    default:
      return (
        <>
          <ApplicationData
            applicantInfo={applicationFullDetails.applicantInfo}
            coApplicantInfo={applicationFullDetails.coApplicantInfo}
            vehicleData={applicationFullDetails.vehicleData}
            appDtReferences={applicationFullDetails.appDtReferences}
          />
          <DealStructureSection dealStructure={applicationFullDetails.dealStructure} />
        </>
      );
  }
};

export default TabContent;
