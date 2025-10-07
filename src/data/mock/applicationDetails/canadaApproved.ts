import { ApplicationFullDetails } from '@/types/application/details';
import { applicantInfo } from '../applicantInfo';
import { vehicleData, appDtReferences } from '../vehicleData';
import { orderDetails } from '../orderDetails';
import { canadaLeaseFinancialSummary } from '../canadaLeaseFinancialSummary';
import { canadaLoanFinancialSummary } from '../canadaLoanFinancialSummary';
import { sciLeaseDealStructure, rbcLoanDealStructure } from '../canadaDealStructure';

// CA-1: Approved Lease Application (SCI)
export const ca1ApprovedLease: ApplicationFullDetails = {
  details: {
    orderNumber: 'CA-ORD-2024-1001',
    model: 'Model 3',
    edition: 'Long Range AWD',
    orderedBy: 'Marie Dubois',
    status: 'Approved',
    type: 'Lease'
  },
  applicantInfo: {
    ...applicantInfo,
    firstName: 'Marie',
    lastName: 'Dubois',
    emailAddress: 'marie.dubois@email.ca',
    contactNumber: '(514) 555-0101',
    address: '123 Rue Saint-Laurent',
    city: 'Montreal',
    state: 'QC',
    zipCode: 'H2X 2T3'
  },
  vehicleData: vehicleData,
  appDtReferences: appDtReferences,
  orderDetails: orderDetails,
  history: [
    { date: '2024-01-20', event: 'Application Approved', user: 'System', details: 'SCI approved lease application' },
    { date: '2024-01-18', event: 'Credit Check Completed', user: 'Credit Team', details: 'Credit score: 720' },
    { date: '2024-01-15', event: 'Application Submitted', user: 'Marie Dubois', details: 'Initial application submitted' }
  ],
  notes: [
    { id: 'note-ca1-1', author: 'Sales Agent', date: '2024-01-20', content: 'Application approved. Customer confirmed delivery to Quebec City.' }
  ],
  financialSummary: {
    type: 'Lease',
    lfs: canadaLeaseFinancialSummary
  },
  dealStructure: [{ ...sciLeaseDealStructure, status: 'Approved' }]
};

// CA-6: Approved Loan Application (RBC)
export const ca6ApprovedLoan: ApplicationFullDetails = {
  details: {
    orderNumber: 'CA-ORD-2024-2001',
    model: 'Model Y',
    edition: 'Long Range AWD',
    orderedBy: 'Pierre Tremblay',
    status: 'Approved',
    type: 'Loan'
  },
  applicantInfo: {
    ...applicantInfo,
    firstName: 'Pierre',
    lastName: 'Tremblay',
    emailAddress: 'pierre.tremblay@email.ca',
    contactNumber: '(514) 555-0201',
    address: '456 Avenue du Parc',
    city: 'Montreal',
    state: 'QC',
    zipCode: 'H2V 4E7'
  },
  vehicleData: vehicleData,
  appDtReferences: appDtReferences,
  orderDetails: orderDetails,
  history: [
    { date: '2024-01-22', event: 'Application Approved', user: 'System', details: 'RBC approved loan application' },
    { date: '2024-01-20', event: 'Credit Check Completed', user: 'Credit Team', details: 'Credit score: 745' },
    { date: '2024-01-18', event: 'Application Submitted', user: 'Pierre Tremblay', details: 'Initial application submitted' }
  ],
  notes: [
    { id: 'note-ca6-1', author: 'Finance Manager', date: '2024-01-22', content: 'Loan approved. Customer reviewing final terms.' }
  ],
  financialSummary: {
    type: 'Loan',
    loan: canadaLoanFinancialSummary
  },
  dealStructure: [{ ...rbcLoanDealStructure, status: 'Approved' }]
};

export const canadaApprovedApplications = {
  'CA-1': ca1ApprovedLease,
  'CA-6': ca6ApprovedLoan
};
