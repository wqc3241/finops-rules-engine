
import React from 'react';
import ApplicationData from '@/components/applications/ApplicationDetails/ApplicationData';
import DealStructureContainer from '@/components/applications/ApplicationDetails/DealStructure/DealStructureContainer';
import OrderDetailsView from '@/components/applications/ApplicationDetails/OrderDetailsView';
import ApplicationHistoryView from '@/components/applications/ApplicationDetails/ApplicationHistoryView';
import NotesView from '@/components/applications/ApplicationDetails/NotesView';
import FinancialSummaryView from '@/components/applications/ApplicationDetails/FinancialSummaryView';
import { Note } from '@/types/application';
import { usePresentedLender } from '@/utils/dealFinanceNavigation';

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
  const { presentedLender } = usePresentedLender();
  
  // Update financial summary with presented lender information if available
  const getFinancialSummaryWithPresentedLender = () => {
    const financialSummary = { ...applicationFullDetails.financialSummary };
    
    // If we have lender summaries and a presented lender
    if (financialSummary.lenderSummaries && presentedLender) {
      // Mark the presented lender
      Object.keys(financialSummary.lenderSummaries).forEach(lenderName => {
        financialSummary.lenderSummaries![lenderName].selectedForCustomer = 
          lenderName === presentedLender;
      });
    }
    
    return financialSummary;
  };
  
  switch (tab) {
    case 'financial-summary':
      return <FinancialSummaryView financialSummary={getFinancialSummaryWithPresentedLender()} />;
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
          <DealStructureContainer 
            dealStructure={applicationFullDetails.dealStructure}
            applicationType={applicationFullDetails.details.type}
          />
        </>
      );
  }
};

export default TabContent;
