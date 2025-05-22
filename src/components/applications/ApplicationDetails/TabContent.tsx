
import React from 'react';
import ApplicationData from '@/components/applications/ApplicationDetails/ApplicationData';
import OrderDetailsView from '@/components/applications/ApplicationDetails/OrderDetailsView';
import ApplicationHistoryView from '@/components/applications/ApplicationDetails/ApplicationHistoryView';
import NotesView from '@/components/applications/ApplicationDetails/NotesView';
import RiskComplianceView from '@/components/applications/ApplicationDetails/RiskComplianceView';
import { Note } from '@/types/application';
import { usePresentedLender } from '@/utils/dealFinanceNavigation';
import { mockRiskComplianceData } from '@/data/mock/riskCompliance';
import CombinedFinancialView from './CombinedFinancialView';

interface TabContentProps {
  tab?: string;
  applicationFullDetails: any;
  notes: Note[];
}

const TabContent: React.FC<TabContentProps> = ({ 
  tab = 'order-details', 
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
    case 'details':
      return (
        <ApplicationData
          applicantInfo={applicationFullDetails.applicantInfo}
          coApplicantInfo={applicationFullDetails.coApplicantInfo}
          vehicleData={applicationFullDetails.vehicleData}
          appDtReferences={applicationFullDetails.appDtReferences}
        />
      );
    case 'financial-summary':
      return (
        <CombinedFinancialView 
          financialSummary={getFinancialSummaryWithPresentedLender()}
          dealStructure={applicationFullDetails.dealStructure}
          applicationType={applicationFullDetails.details.type}
        />
      );
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
    case 'order-details':
    default:
      return <OrderDetailsView orderDetails={applicationFullDetails.orderDetails} />;
  }
};

export default TabContent;
