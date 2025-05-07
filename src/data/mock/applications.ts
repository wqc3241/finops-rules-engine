
import { Application } from '../../types/application';

export const applications: Application[] = [
  {
    id: '1',
    orderNumber: 'AD 24567-17246',
    name: 'Becca Yukelson',
    type: 'Lease',
    status: 'Approved',
    notes: 'Customer confirmed delivery date for next Tuesday.',
    date: '2024-05-01'
  },
  {
    id: '2',
    orderNumber: 'AD 24567-17246',
    name: 'Becca Yukelson',
    type: 'Loan',
    status: 'Approved',
    notes: 'A series of short comments may go here, a series of short comments may go here, a series of short comments may go here, a series of short comments may go here.',
    date: '2024-04-20'
  },
  {
    id: '3',
    orderNumber: 'AD 24567-17246',
    name: 'Becca Yukelson',
    type: 'Loan',
    status: 'Approved',
    notes: 'A series of short comments may go here, a series of short comments may go here, a series of short comments may go here, a series of short comments may go here.',
    date: '2024-04-15'
  },
  {
    id: '4',
    orderNumber: 'AD 24567-17246',
    name: 'Becca Yukelson',
    type: 'Loan',
    status: 'Approved',
    notes: 'A series of short comments may go here, a series of short comments may go here, a series of short comments may go here, a series of short comments may go here.',
    date: '2024-04-10'
  },
  {
    id: '5',
    orderNumber: 'AD 87432-21958',
    name: 'Michael Torres',
    type: 'Loan',
    status: 'Submitted',
    notes: 'Customer uploaded all required documentation. Waiting for credit check.',
    date: '2024-05-03'
  },
  {
    id: '6',
    orderNumber: 'AD 54621-39874',
    name: 'Sarah Johnson',
    type: 'Lease',
    status: 'Pending',
    notes: 'Still waiting on proof of income documents from applicant.',
    date: '2024-05-02'
  },
  {
    id: '7',
    orderNumber: 'AD 32198-76543',
    name: 'David Chen',
    type: 'Loan',
    status: 'Pending',
    notes: 'Co-signer information needed before proceeding with application.',
    date: '2024-04-28'
  }
];
