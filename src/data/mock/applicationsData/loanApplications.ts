
import { Application } from '../../../types/application';

// Loan applications
export const loanApplications: Application[] = [
  // New loan application after reapplying from lease
  {
    id: '6-reapply',
    orderNumber: 'AD 54621-39874',
    name: 'Sarah Johnson',
    type: 'Loan',
    status: 'Submitted',
    notes: 'Reapplication - switched from lease to loan. Documentation under review.',
    notesArray: [
      {
        content: 'Customer submitted new loan application after reapply.',
        time: '9:30 AM',
        date: '2024-05-03',
        user: 'Jennifer Liu'
      },
      {
        content: 'All required documentation received. Processing loan application.',
        time: '11:15 AM',
        date: '2024-05-03',
        user: 'Tom Williams'
      }
    ],
    date: '2024-05-03',
    originalApplicationId: '6',
    parentApplicationId: '6',
    reapplicationSequence: 2
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
    date: '2024-05-03',
    reapplicationSequence: 1,
    reapplyEnabled: true
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
