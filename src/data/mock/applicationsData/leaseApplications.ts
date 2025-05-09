
import { Application } from '../../../types/application';

// Lease applications
export const leaseApplications: Application[] = [
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
  }
];
