import { ApplicationFullDetails } from '@/types/application/details';
import { applicantInfo } from '../applicantInfo';
import { vehicleData, appDtReferences } from '../vehicleData';
import { orderDetails } from '../orderDetails';
import { canadaLoanFinancialSummary } from '../canadaLoanFinancialSummary';
import { rbcLoanDealStructure } from '../canadaDealStructure';

// CA-10: Booked Loan Application (RBC)
export const ca10BookedLoan: ApplicationFullDetails = {
  details: {
    orderNumber: 'CA-ORD-2024-2005',
    model: 'Model 3',
    edition: 'Long Range AWD',
    orderedBy: 'Thomas Anderson',
    status: 'Booked',
    type: 'Loan'
  },
  applicantInfo: {
    ...applicantInfo,
    firstName: 'Thomas',
    lastName: 'Anderson',
    email: 'thomas.anderson@email.ca',
    phone: '(204) 555-0205',
    address: '1234 Portage Avenue, Winnipeg, MB R3G 0T5'
  },
  vehicleData: vehicleData,
  appDtReferences: appDtReferences,
  orderDetails: orderDetails,
  history: [
    { date: '2024-01-26', event: 'Contract Booked', user: 'System', details: 'Loan contract executed and booked' },
    { date: '2024-01-24', event: 'Application Approved', user: 'System', details: 'RBC approved loan application' },
    { date: '2024-01-22', event: 'Credit Check Completed', user: 'Credit Team', details: 'Credit score: 750' },
    { date: '2024-01-20', event: 'Application Submitted', user: 'Thomas Anderson', details: 'Initial application submitted' }
  ],
  notes: [
    { id: 'note-ca10-1', author: 'Finance Manager', date: '2024-01-26', content: 'Contract executed. Vehicle delivery scheduled for Winnipeg dealership.' }
  ],
  financialSummary: {
    type: 'Loan',
    loan: canadaLoanFinancialSummary
  },
  dealStructure: [{ ...rbcLoanDealStructure, status: 'Booked', contractStatus: 'Contract Booked' }]
};

export const canadaBookedApplications = {
  'CA-10': ca10BookedLoan
};
