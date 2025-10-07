import { ApplicationFullDetails } from '@/types/application/details';
import { applicantInfo } from '../applicantInfo';
import { vehicleData, appDtReferences } from '../vehicleData';
import { orderDetails } from '../orderDetails';
import { canadaLeaseFinancialSummary } from '../canadaLeaseFinancialSummary';
import { canadaLoanFinancialSummary } from '../canadaLoanFinancialSummary';
import { sciLeaseDealStructure, rbcLoanDealStructure } from '../canadaDealStructure';

// CA-4: Conditionally Approved Lease Application (SCI)
export const ca4ConditionallyApprovedLease: ApplicationFullDetails = {
  details: {
    orderNumber: 'CA-ORD-2024-1004',
    model: 'Model 3',
    edition: 'Performance',
    orderedBy: 'David Martinez',
    status: 'Conditionally Approved',
    type: 'Lease'
  },
  applicantInfo: {
    ...applicantInfo,
    firstName: 'David',
    lastName: 'Martinez',
    email: 'david.martinez@email.ca',
    phone: '(403) 555-0104',
    address: '2020 4th Street SW, Calgary, AB T2S 1W5'
  },
  vehicleData: vehicleData,
  appDtReferences: appDtReferences,
  orderDetails: orderDetails,
  history: [
    { date: '2024-01-23', event: 'Conditional Approval', user: 'System', details: 'Approved pending proof of residence' },
    { date: '2024-01-21', event: 'Credit Check Completed', user: 'Credit Team', details: 'Credit score: 695' },
    { date: '2024-01-19', event: 'Application Submitted', user: 'David Martinez', details: 'Initial application submitted' }
  ],
  notes: [
    { id: 'note-ca4-1', author: 'Underwriter', date: '2024-01-23', content: 'Approved pending proof of Alberta residence.' }
  ],
  financialSummary: {
    type: 'Lease',
    lfs: canadaLeaseFinancialSummary
  },
  dealStructure: [{ ...sciLeaseDealStructure, status: 'Conditionally Approved' }]
};

// CA-9: Conditionally Approved Loan Application (RBC)
export const ca9ConditionallyApprovedLoan: ApplicationFullDetails = {
  details: {
    orderNumber: 'CA-ORD-2024-2004',
    model: 'Model Y',
    edition: 'Standard Range',
    orderedBy: 'Michelle Lee',
    status: 'Conditionally Approved',
    type: 'Loan'
  },
  applicantInfo: {
    ...applicantInfo,
    firstName: 'Michelle',
    lastName: 'Lee',
    email: 'michelle.lee@email.ca',
    phone: '(403) 555-0204',
    address: '789 17th Avenue SW, Calgary, AB T2T 0A1'
  },
  vehicleData: vehicleData,
  appDtReferences: appDtReferences,
  orderDetails: orderDetails,
  history: [
    { date: '2024-01-24', event: 'Conditional Approval', user: 'System', details: 'Approved pending increased down payment' },
    { date: '2024-01-22', event: 'Credit Check Completed', user: 'Credit Team', details: 'Credit score: 680' },
    { date: '2024-01-20', event: 'Application Submitted', user: 'Michelle Lee', details: 'Initial application submitted' }
  ],
  notes: [
    { id: 'note-ca9-1', author: 'Loan Officer', date: '2024-01-24', content: 'Approved pending increased down payment confirmation.' }
  ],
  financialSummary: {
    type: 'Loan',
    loan: canadaLoanFinancialSummary
  },
  dealStructure: [{ ...rbcLoanDealStructure, status: 'Conditionally Approved' }]
};

export const canadaConditionallyApprovedApplications = {
  'CA-4': ca4ConditionallyApprovedLease,
  'CA-9': ca9ConditionallyApprovedLoan
};
