import { Application, Note } from '../../types/application';
import { notes } from './history';

export const applications: Application[] = [
  {
    id: '1',
    orderNumber: 'AD 24567-17246',
    name: 'Becca Yukelson',
    type: 'Lease',
    status: 'Approved',
    notes: 'Customer confirmed delivery date for next Tuesday.',
    notesArray: [
      {
        content: 'Customer confirmed delivery date for next Tuesday.',
        time: '2:45 PM',
        date: '2024-05-01',
        user: 'Michael McCann'
      }
    ],
    date: '2024-05-01'
  },
  {
    id: '5',
    orderNumber: 'AD 87432-21958',
    name: 'Michael Torres',
    type: 'Loan',
    status: 'Submitted',
    notes: 'Customer uploaded all required documentation. Waiting for credit check.',
    notesArray: [
      {
        content: 'Customer uploaded all required documentation. Waiting for credit check.',
        time: '10:30 AM',
        date: '2024-05-03',
        user: 'Jennifer Liu'
      }
    ],
    date: '2024-05-03'
  },
  {
    id: '6',
    orderNumber: 'AD 54621-39874',
    name: 'Sarah Johnson',
    type: 'Lease',
    status: 'Pending',
    notes: 'Still waiting on proof of income documents from applicant.',
    notesArray: [
      {
        content: 'Still waiting on proof of income documents from applicant.',
        time: '3:15 PM',
        date: '2024-05-02',
        user: 'Tom Williams'
      }
    ],
    date: '2024-05-02'
  },
  {
    id: '7',
    orderNumber: 'AD 32198-76543',
    name: 'David Chen',
    type: 'Loan',
    status: 'Pending',
    notes: 'Co-signer information needed before proceeding with application.',
    notesArray: [
      {
        content: 'Co-signer information needed before proceeding with application.',
        time: '11:45 AM',
        date: '2024-04-28',
        user: 'Sarah Johnson'
      }
    ],
    date: '2024-04-28'
  },
  
  // New applications - 10 diverse mock applications
  {
    id: '8',
    orderNumber: 'AD 76543-10987',
    name: 'Aisha Washington',
    type: 'Lease',
    status: 'Declined',
    notes: 'Application declined due to insufficient credit history.',
    notesArray: [
      {
        content: 'Application declined due to insufficient credit history.',
        time: '1:30 PM',
        date: '2024-05-04',
        user: 'Tom Williams'
      },
      {
        content: 'Customer requesting reconsideration with additional income documentation.',
        time: '4:15 PM',
        date: '2024-05-04',
        user: 'Jennifer Liu'
      }
    ],
    date: '2024-05-04'
  },
  {
    id: '9',
    orderNumber: 'AD 98765-23456',
    name: 'Carlos Rodriguez',
    type: 'Lease',
    status: 'Conditionally Approved',
    notes: 'Approved pending proof of residence and most recent pay stub.',
    notesArray: [
      {
        content: 'Approved pending proof of residence and most recent pay stub.',
        time: '10:20 AM',
        date: '2024-05-05',
        user: 'Michael McCann'
      },
      {
        content: 'Customer notified of conditional approval status.',
        time: '11:30 AM',
        date: '2024-05-05',
        user: 'Jennifer Liu'
      }
    ],
    date: '2024-05-05'
  },
  {
    id: '10',
    orderNumber: 'AD 34567-98765',
    name: 'Emily Chang',
    type: 'Loan',
    status: 'Pending Signature',
    notes: 'All documents approved. Contract sent for electronic signature.',
    notesArray: [
      {
        content: 'All documents approved. Contract sent for electronic signature.',
        time: '9:45 AM',
        date: '2024-05-06',
        user: 'Sarah Johnson'
      },
      {
        content: 'Reminder sent to customer about pending signature.',
        time: '2:30 PM',
        date: '2024-05-07',
        user: 'Tom Williams'
      }
    ],
    date: '2024-05-06'
  },
  {
    id: '11',
    orderNumber: 'AD 11223-45678',
    name: 'James Wilson',
    type: 'Loan',
    status: 'Booked',
    notes: 'Contract fully executed. Vehicle delivery scheduled for next week.',
    notesArray: [
      {
        content: 'Contract fully executed. Vehicle delivery scheduled for next week.',
        time: '3:50 PM',
        date: '2024-05-02',
        user: 'Michael McCann'
      },
      {
        content: 'Customer confirmed delivery address and time.',
        time: '11:15 AM',
        date: '2024-05-03',
        user: 'Jennifer Liu'
      }
    ],
    date: '2024-05-02'
  },
  {
    id: '12',
    orderNumber: 'AD 87654-32109',
    name: 'Sophia Martinez',
    type: 'Lease',
    status: 'Funded',
    notes: 'Funds disbursed. Vehicle delivered to customer.',
    notesArray: [
      {
        content: 'Funds disbursed. Vehicle delivered to customer.',
        time: '5:20 PM',
        date: '2024-04-28',
        user: 'Tom Williams'
      },
      {
        content: 'Customer satisfaction follow-up completed. All paperwork finalized.',
        time: '11:30 AM',
        date: '2024-04-30',
        user: 'Sarah Johnson'
      }
    ],
    date: '2024-04-28'
  },
  {
    id: '13',
    orderNumber: 'AD 55443-21098',
    name: 'Robert Kim',
    type: 'Loan',
    status: 'Pending',
    notes: 'Awaiting verification of employment history.',
    notesArray: [
      {
        content: 'Awaiting verification of employment history.',
        time: '1:15 PM',
        date: '2024-05-07',
        user: 'Michael McCann'
      },
      {
        content: 'Employer contacted for verification. Awaiting response.',
        time: '9:30 AM',
        date: '2024-05-08',
        user: 'Jennifer Liu'
      }
    ],
    date: '2024-05-07'
  },
  {
    id: '14',
    orderNumber: 'AD 66778-99001',
    name: 'Olivia Thompson',
    type: 'Lease',
    status: 'Approved',
    notes: 'Application approved. Customer selecting delivery options.',
    notesArray: [
      {
        content: 'Application approved. Customer selecting delivery options.',
        time: '4:10 PM',
        date: '2024-05-04',
        user: 'Sarah Johnson'
      },
      {
        content: 'Customer has selected home delivery for next Tuesday.',
        time: '10:45 AM',
        date: '2024-05-06',
        user: 'Tom Williams'
      }
    ],
    date: '2024-05-04'
  },
  {
    id: '15',
    orderNumber: 'AD 12345-67890',
    name: 'Daniel Patel',
    type: 'Loan',
    status: 'Submitted',
    notes: 'Application submitted. Credit check in progress.',
    notesArray: [
      {
        content: 'Application submitted. Credit check in progress.',
        time: '2:25 PM',
        date: '2024-05-08',
        user: 'Michael McCann'
      },
      {
        content: 'Initial credit report received. Income verification needed.',
        time: '9:15 AM',
        date: '2024-05-09',
        user: 'Jennifer Liu'
      }
    ],
    date: '2024-05-08'
  },
  {
    id: '16',
    orderNumber: 'AD 54321-09876',
    name: 'Maria Garcia',
    type: 'Lease',
    status: 'Conditionally Approved',
    notes: 'Approved with condition of increased down payment.',
    notesArray: [
      {
        content: 'Approved with condition of increased down payment.',
        time: '11:40 AM',
        date: '2024-05-06',
        user: 'Tom Williams'
      },
      {
        content: 'Customer agreed to increased down payment. Updating contract.',
        time: '3:20 PM',
        date: '2024-05-07',
        user: 'Sarah Johnson'
      }
    ],
    date: '2024-05-06'
  },
  {
    id: '17',
    orderNumber: 'AD 13579-24680',
    name: 'William Johnson',
    type: 'Loan',
    status: 'Funded',
    notes: 'Loan funded. Vehicle delivered to customer.',
    notesArray: [
      {
        content: 'Loan funded. Vehicle delivered to customer.',
        time: '5:30 PM',
        date: '2024-04-30',
        user: 'Jennifer Liu'
      },
      {
        content: 'All paperwork completed and filed. Customer satisfaction confirmed.',
        time: '11:20 AM',
        date: '2024-05-02',
        user: 'Michael McCann'
      }
    ],
    date: '2024-04-30'
  }
];
