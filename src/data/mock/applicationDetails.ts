
import { ApplicationDetails, ApplicationFullDetails, FinancialSummary } from '../../types/application';
import { applicantInfo, coApplicantInfo } from './applicantInfo';
import { vehicleData, appDtReferences } from './vehicleData';
import { orderDetails } from './orderDetails';
import { historyItems, notes } from './history';
import { financialSummaryData } from './financialSummary';
import { dealStructureData } from './dealStructure';

const applicationDetailsData: ApplicationDetails = {
  orderNumber: 'AD 24567-17246',
  model: 'Air Dream Edition (GT)',
  edition: 'Dream Edition',
  orderedBy: 'Stephanie Nelson',
  status: 'Approved'
};

const financialSummary: FinancialSummary = {
  lfs: {
    tabs: ['Requested', 'Approved', 'Customer'],
    activeTab: 'Approved',
    requested: financialSummaryData.requested,
    approved: financialSummaryData.approved,
    customer: financialSummaryData.customer
  }
};

export const applicationDetails: ApplicationFullDetails = {
  details: applicationDetailsData,
  applicantInfo,
  coApplicantInfo,
  vehicleData,
  appDtReferences,
  orderDetails,
  history: historyItems,
  notes,
  financialSummary,
  dealStructure: dealStructureData
};
