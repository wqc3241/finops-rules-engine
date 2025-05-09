
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
  }
];
