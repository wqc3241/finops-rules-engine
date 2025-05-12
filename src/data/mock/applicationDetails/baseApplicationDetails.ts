
import { ApplicationFullDetails } from '../../../types/application';
import { applicantInfo, coApplicantInfo } from '../applicantInfo';
import { vehicleData, appDtReferences } from '../vehicleData';
import { orderDetails } from '../orderDetails';
import { historyItems, notes } from '../history';
import { financialSummaryData } from '../financialSummary';
import { dealStructureData } from '../dealStructure';

// Base application details used as a template for all specific application details
export const baseApplicationDetails: ApplicationFullDetails = {
  details: {
    orderNumber: 'AD 00000-00000',
    model: 'Air',
    edition: 'Standard',
    orderedBy: 'Unknown Customer',
    status: 'Pending',
    type: 'Lease' // Default to Lease type
  },
  applicantInfo,
  coApplicantInfo,
  vehicleData,
  appDtReferences,
  orderDetails,
  history: historyItems,
  notes,
  financialSummary: {
    type: 'Lease', 
    lfs: {
      tabs: ['Requested', 'Approved', 'Customer'],
      activeTab: 'Approved',
      requested: financialSummaryData.requested,
      approved: financialSummaryData.approved,
      customer: financialSummaryData.customer
    }
  },
  dealStructure: dealStructureData
};
