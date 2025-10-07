import { ApplicationFullDetails } from '@/types/application/details';
import { applicantInfo } from '../applicantInfo';
import { vehicleData } from '../vehicleData';
import { orderDetails } from '../orderDetails';
import { canadaLeaseFinancialSummary } from '../canadaLeaseFinancialSummary';
import { canadaLoanFinancialSummary } from '../canadaLoanFinancialSummary';
import { sciLeaseDealStructure, rbcLoanDealStructure } from '../canadaDealStructure';

// CA-2: Pending Lease Application (SCI)
export const ca2PendingLease: ApplicationFullDetails = {
  details: {
    orderNumber: 'CA-ORD-2024-1002',
    model: 'Model 3',
    edition: 'Standard Range Plus',
    orderedBy: 'Sophie Chen',
    status: 'Pending',
    type: 'Lease'
  },
  applicantInfo: {
    ...applicantInfo,
    firstName: 'Sophie',
    lastName: 'Chen',
    email: 'sophie.chen@email.ca',
    phone: '(604) 555-0102',
    address: '789 Robson Street, Vancouver, BC V6Z 1A1'
  },
  vehicleData: vehicleData,
  orderDetails: orderDetails,
  history: [
    { date: '2024-01-19', event: 'Additional Documents Requested', user: 'Underwriting', details: 'Income verification needed' },
    { date: '2024-01-17', event: 'Application Submitted', user: 'Sophie Chen', details: 'Initial application submitted' }
  ],
  notes: [
    { id: 'note-ca2-1', author: 'Underwriter', date: '2024-01-19', content: 'Awaiting additional income verification documents.' }
  ],
  financialSummary: {
    type: 'Lease',
    lfs: canadaLeaseFinancialSummary
  },
  dealStructure: [{ ...sciLeaseDealStructure, status: 'Pending' }]
};

// CA-7: Pending Loan Application (RBC)
export const ca7PendingLoan: ApplicationFullDetails = {
  details: {
    orderNumber: 'CA-ORD-2024-2002',
    model: 'Model Y',
    edition: 'Performance',
    orderedBy: 'James Wilson',
    status: 'Pending',
    type: 'Loan'
  },
  applicantInfo: {
    ...applicantInfo,
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@email.ca',
    phone: '(604) 555-0202',
    address: '321 Burrard Street, Vancouver, BC V6C 3L7'
  },
  vehicleData: vehicleData,
  orderDetails: orderDetails,
  history: [
    { date: '2024-01-20', event: 'Co-Applicant Information Requested', user: 'Underwriting', details: 'Co-applicant details needed' },
    { date: '2024-01-18', event: 'Application Submitted', user: 'James Wilson', details: 'Initial application submitted' }
  ],
  notes: [
    { id: 'note-ca7-1', author: 'Loan Officer', date: '2024-01-20', content: 'Co-applicant information required before proceeding.' }
  ],
  financialSummary: {
    type: 'Loan',
    loan: canadaLoanFinancialSummary
  },
  dealStructure: [{ ...rbcLoanDealStructure, status: 'Pending' }]
};

export const canadaPendingApplications = {
  'CA-2': ca2PendingLease,
  'CA-7': ca7PendingLoan
};
