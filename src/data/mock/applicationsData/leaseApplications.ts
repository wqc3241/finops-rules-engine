
import { Application } from '../../../types/application';

// Lease applications
export const leaseApplications: Application[] = [
  // Original Loan application (now Void after reapplication)
  {
    id: '1',
    orderNumber: 'AD 24567-17246',
    name: 'Becca Yukelson',
    type: 'Loan',
    status: 'Void',
    notes: 'Original loan application. Customer switched to lease application.',
    notesArray: [
      {
        content: 'Customer requested to switch from loan to lease.',
        time: '10:15 AM',
        date: '2024-04-28',
        user: 'Michael McCann'
      },
      {
        content: 'Application marked as void after successful reapplication.',
        time: '2:45 PM',
        date: '2024-05-01',
        user: 'Michael McCann'
      }
    ],
    date: '2024-04-28',
    reapplicationSequence: 1,
    reapplyEnabled: false
  },
  // Reapplied Lease application for same order (Approved)
  {
    id: '2',
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
    date: '2024-05-01',
    originalApplicationId: '1',
    parentApplicationId: '1',
    reapplicationSequence: 2
  },
  {
    id: '6',
    orderNumber: 'AD 54621-39874',
    name: 'Sarah Johnson',
    type: 'Lease',
    status: 'Void',
    notes: 'Reapplication enabled. Customer considering switching to loan application.',
    notesArray: [
      {
        content: 'Customer requested reapplication to explore loan options.',
        time: '3:15 PM',
        date: '2024-05-02',
        user: 'Tom Williams'
      },
      {
        content: 'Reapplication enabled by FS ops. Waiting for customer decision.',
        time: '4:20 PM',
        date: '2024-05-02',
        user: 'Jennifer Liu'
      }
    ],
    date: '2024-05-02',
    reapplicationSequence: 1,
    reapplyEnabled: true
  },
  // Original declined lease application that can be reapplied
  {
    id: '3',
    orderNumber: 'AD 76543-10987',
    name: 'Aisha Washington',
    type: 'Lease',
    status: 'Void',
    notes: 'Application declined due to insufficient credit history. Reapply enabled for customer to submit additional documentation.',
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
      },
      {
        content: 'Reapply enabled by FS ops to allow customer to submit additional documentation.',
        time: '9:00 AM',
        date: '2024-05-05',
        user: 'Michael McCann'
      }
    ],
    date: '2024-05-04',
    reapplicationSequence: 1,
    reapplyEnabled: true
  },
  {
    id: '4',
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
    id: '16',
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
    id: '17',
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
    id: '18',
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
