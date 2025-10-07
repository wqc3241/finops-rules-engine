
import { Application } from '../../../types/application';

// Canadian applications (both Lease and Loan)
export const canadaApplications: Application[] = [
  // Lease applications for Canada
  {
    id: 'CA-1',
    orderNumber: 'CA 24567-17246',
    name: 'Sophie Tremblay',
    type: 'Lease',
    status: 'Approved',
    country: 'CA',
    state: 'QC',
    notes: 'Application approved. Customer confirmed delivery to Quebec City.',
    notesArray: [
      {
        content: 'Application approved. Customer confirmed delivery to Quebec City.',
        time: '2:30 PM',
        date: '2024-05-06',
        user: 'Jean-Pierre Dubois'
      },
      {
        content: 'Customer selected home delivery option for next Tuesday.',
        time: '10:15 AM',
        date: '2024-05-07',
        user: 'Marie Laflamme'
      }
    ],
    date: '2024-05-06'
  },
  {
    id: 'CA-2',
    orderNumber: 'CA 87654-32109',
    name: 'Michael Wong',
    type: 'Lease',
    status: 'Pending',
    country: 'CA',
    state: 'BC',
    notes: 'Awaiting additional income verification documents.',
    notesArray: [
      {
        content: 'Awaiting additional income verification documents.',
        time: '11:20 AM',
        date: '2024-05-07',
        user: 'Sarah Johnson'
      },
      {
        content: 'Customer contacted for T4 slip and recent pay stubs.',
        time: '3:45 PM',
        date: '2024-05-07',
        user: 'Tom Williams'
      }
    ],
    date: '2024-05-07'
  },
  {
    id: 'CA-3',
    orderNumber: 'CA 11223-44556',
    name: 'Emma Patel',
    type: 'Lease',
    status: 'Submitted',
    country: 'CA',
    state: 'ON',
    notes: 'Application submitted. Credit check in progress.',
    notesArray: [
      {
        content: 'Application submitted. Credit check in progress.',
        time: '9:15 AM',
        date: '2024-05-08',
        user: 'Jennifer Liu'
      },
      {
        content: 'Equifax report received. Reviewing credit history.',
        time: '1:30 PM',
        date: '2024-05-08',
        user: 'Michael McCann'
      }
    ],
    date: '2024-05-08'
  },
  {
    id: 'CA-4',
    orderNumber: 'CA 55443-21098',
    name: 'Lucas Fontaine',
    type: 'Lease',
    status: 'Conditionally Approved',
    country: 'CA',
    state: 'AB',
    notes: 'Approved pending proof of Alberta residence.',
    notesArray: [
      {
        content: 'Approved pending proof of Alberta residence.',
        time: '2:10 PM',
        date: '2024-05-05',
        user: 'Tom Williams'
      },
      {
        content: 'Customer agreed to provide utility bill. Expected within 2 days.',
        time: '4:30 PM',
        date: '2024-05-05',
        user: 'Sarah Johnson'
      }
    ],
    date: '2024-05-05'
  },
  {
    id: 'CA-5',
    orderNumber: 'CA 98765-12345',
    name: 'Olivia MacDonald',
    type: 'Lease',
    status: 'Funded',
    country: 'CA',
    state: 'NS',
    notes: 'Lease funded. Vehicle delivered to customer in Halifax.',
    notesArray: [
      {
        content: 'Lease funded. Vehicle delivered to customer in Halifax.',
        time: '4:45 PM',
        date: '2024-05-01',
        user: 'Jennifer Liu'
      },
      {
        content: 'Customer satisfaction survey completed. All paperwork finalized.',
        time: '10:30 AM',
        date: '2024-05-03',
        user: 'Michael McCann'
      }
    ],
    date: '2024-05-01'
  },
  // Loan applications for Canada
  {
    id: 'CA-6',
    orderNumber: 'CA 32198-76543',
    name: 'Benjamin Leblanc',
    type: 'Loan',
    status: 'Approved',
    country: 'CA',
    state: 'QC',
    notes: 'Loan approved. Customer reviewing final terms.',
    notesArray: [
      {
        content: 'Loan approved. Customer reviewing final terms.',
        time: '11:40 AM',
        date: '2024-05-04',
        user: 'Jean-Pierre Dubois'
      },
      {
        content: 'Customer confirmed acceptance. Contract being prepared.',
        time: '3:15 PM',
        date: '2024-05-04',
        user: 'Marie Laflamme'
      }
    ],
    date: '2024-05-04'
  },
  {
    id: 'CA-7',
    orderNumber: 'CA 66778-99001',
    name: 'Isabella Chen',
    type: 'Loan',
    status: 'Pending',
    country: 'CA',
    state: 'BC',
    notes: 'Co-applicant information required before proceeding.',
    notesArray: [
      {
        content: 'Co-applicant information required before proceeding.',
        time: '9:50 AM',
        date: '2024-05-08',
        user: 'Tom Williams'
      },
      {
        content: 'Customer notified. Co-applicant details expected by end of week.',
        time: '2:20 PM',
        date: '2024-05-08',
        user: 'Sarah Johnson'
      }
    ],
    date: '2024-05-08'
  },
  {
    id: 'CA-8',
    orderNumber: 'CA 13579-24680',
    name: 'Liam Murphy',
    type: 'Loan',
    status: 'Submitted',
    country: 'CA',
    state: 'ON',
    notes: 'Application submitted. Awaiting TransUnion credit report.',
    notesArray: [
      {
        content: 'Application submitted. Awaiting TransUnion credit report.',
        time: '10:05 AM',
        date: '2024-05-09',
        user: 'Jennifer Liu'
      },
      {
        content: 'Credit report received. Income verification in progress.',
        time: '3:40 PM',
        date: '2024-05-09',
        user: 'Michael McCann'
      }
    ],
    date: '2024-05-09'
  },
  {
    id: 'CA-9',
    orderNumber: 'CA 45678-90123',
    name: 'Ava Singh',
    type: 'Loan',
    status: 'Conditionally Approved',
    country: 'CA',
    state: 'AB',
    notes: 'Approved pending increased down payment confirmation.',
    notesArray: [
      {
        content: 'Approved pending increased down payment confirmation.',
        time: '1:25 PM',
        date: '2024-05-06',
        user: 'Tom Williams'
      },
      {
        content: 'Customer agreed to increased down payment. Contract being updated.',
        time: '4:50 PM',
        date: '2024-05-06',
        user: 'Sarah Johnson'
      }
    ],
    date: '2024-05-06'
  },
  {
    id: 'CA-10',
    orderNumber: 'CA 78901-23456',
    name: 'Noah Johnson',
    type: 'Loan',
    status: 'Booked',
    country: 'CA',
    state: 'MB',
    notes: 'Contract executed. Vehicle delivery scheduled for Winnipeg dealership.',
    notesArray: [
      {
        content: 'Contract executed. Vehicle delivery scheduled for Winnipeg dealership.',
        time: '2:35 PM',
        date: '2024-05-03',
        user: 'Jennifer Liu'
      },
      {
        content: 'Customer confirmed pickup date and time. All documentation complete.',
        time: '11:05 AM',
        date: '2024-05-04',
        user: 'Michael McCann'
      }
    ],
    date: '2024-05-03'
  }
];
