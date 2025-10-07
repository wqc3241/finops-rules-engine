import { ApplicationFullDetails } from '@/types/application/details';
import { applicantInfo } from '../applicantInfo';
import { vehicleData } from '../vehicleData';
import { orderDetails } from '../orderDetails';
import { canadaLeaseFinancialSummary } from '../canadaLeaseFinancialSummary';
import { sciLeaseDealStructure } from '../canadaDealStructure';

// CA-5: Funded Lease Application (SCI)
export const ca5FundedLease: ApplicationFullDetails = {
  details: {
    orderNumber: 'CA-ORD-2024-1005',
    model: 'Model Y',
    edition: 'Long Range AWD',
    orderedBy: 'Sarah O\'Connor',
    status: 'Funded',
    type: 'Lease'
  },
  applicantInfo: {
    ...applicantInfo,
    firstName: 'Sarah',
    lastName: 'O\'Connor',
    email: 'sarah.oconnor@email.ca',
    phone: '(902) 555-0105',
    address: '456 Spring Garden Road, Halifax, NS B3J 1G6'
  },
  vehicleData: vehicleData,
  orderDetails: orderDetails,
  history: [
    { date: '2024-01-25', event: 'Lease Funded', user: 'System', details: 'Funds disbursed, vehicle delivered' },
    { date: '2024-01-24', event: 'Contract Signed', user: 'Sarah O\'Connor', details: 'Lease contract executed' },
    { date: '2024-01-22', event: 'Application Approved', user: 'System', details: 'SCI approved lease application' },
    { date: '2024-01-20', event: 'Credit Check Completed', user: 'Credit Team', details: 'Credit score: 735' },
    { date: '2024-01-18', event: 'Application Submitted', user: 'Sarah O\'Connor', details: 'Initial application submitted' }
  ],
  notes: [
    { id: 'note-ca5-1', author: 'Delivery Team', date: '2024-01-25', content: 'Lease funded. Vehicle delivered to customer in Halifax.' }
  ],
  financialSummary: {
    type: 'Lease',
    lfs: canadaLeaseFinancialSummary
  },
  dealStructure: [{ ...sciLeaseDealStructure, status: 'Funded', contractStatus: 'Funded and Delivered' }]
};

export const canadaFundedApplications = {
  'CA-5': ca5FundedLease
};
