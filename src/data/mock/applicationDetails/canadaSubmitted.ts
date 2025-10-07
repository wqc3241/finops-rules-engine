import { ApplicationFullDetails } from '@/types/application/details';
import { applicantInfo } from '../applicantInfo';
import { vehicleData } from '../vehicleData';
import { orderDetails } from '../orderDetails';
import { canadaLeaseFinancialSummary } from '../canadaLeaseFinancialSummary';
import { canadaLoanFinancialSummary } from '../canadaLoanFinancialSummary';
import { sciLeaseDealStructure, rbcLoanDealStructure } from '../canadaDealStructure';

// CA-3: Submitted Lease Application (SCI)
export const ca3SubmittedLease: ApplicationFullDetails = {
  details: {
    orderNumber: 'CA-ORD-2024-1003',
    model: 'Model S',
    edition: 'Plaid',
    orderedBy: 'Robert Kumar',
    status: 'Submitted',
    type: 'Lease'
  },
  applicantInfo: {
    ...applicantInfo,
    firstName: 'Robert',
    lastName: 'Kumar',
    email: 'robert.kumar@email.ca',
    phone: '(416) 555-0103',
    address: '1010 Bay Street, Toronto, ON M5S 3A5'
  },
  vehicleData: vehicleData,
  orderDetails: orderDetails,
  history: [
    { date: '2024-01-21', event: 'Application Submitted', user: 'Robert Kumar', details: 'Application sent to SCI for review' }
  ],
  notes: [
    { id: 'note-ca3-1', author: 'Sales Rep', date: '2024-01-21', content: 'Application submitted. Credit check in progress.' }
  ],
  financialSummary: {
    type: 'Lease',
    lfs: canadaLeaseFinancialSummary
  },
  dealStructure: [{ ...sciLeaseDealStructure, status: 'Submitted' }]
};

// CA-8: Submitted Loan Application (RBC)
export const ca8SubmittedLoan: ApplicationFullDetails = {
  details: {
    orderNumber: 'CA-ORD-2024-2003',
    model: 'Model X',
    edition: 'Long Range',
    orderedBy: 'Emma Thompson',
    status: 'Submitted',
    type: 'Loan'
  },
  applicantInfo: {
    ...applicantInfo,
    firstName: 'Emma',
    lastName: 'Thompson',
    email: 'emma.thompson@email.ca',
    phone: '(416) 555-0203',
    address: '555 King Street West, Toronto, ON M5V 1M1'
  },
  vehicleData: vehicleData,
  orderDetails: orderDetails,
  history: [
    { date: '2024-01-22', event: 'Application Submitted', user: 'Emma Thompson', details: 'Application sent to RBC for review' }
  ],
  notes: [
    { id: 'note-ca8-1', author: 'Finance Advisor', date: '2024-01-22', content: 'Application submitted. Awaiting TransUnion credit report.' }
  ],
  financialSummary: {
    type: 'Loan',
    loan: canadaLoanFinancialSummary
  },
  dealStructure: [{ ...rbcLoanDealStructure, status: 'Submitted' }]
};

export const canadaSubmittedApplications = {
  'CA-3': ca3SubmittedLease,
  'CA-8': ca8SubmittedLoan
};
