
import { HistoryItem, Note } from '../../types/application';

export const historyItems: HistoryItem[] = [
  {
    title: "Term Length and Down Payment Updated",
    previousPayment: "$750.25",
    paymentChange: "$699.80",
    paymentDirection: 'decrease',
    time: "2:45 PM",
    date: "May 5, 2025",
    user: "Michael McCann",
    changes: [
      {
        field: "Term Length",
        previously: "24 months",
        now: "36 months"
      },
      {
        field: "Down Payment",
        previously: "$5,000.00",
        now: "$7,500.00"
      },
      {
        field: "Capitalization",
        previously: "Tax only",
        now: "Tax and Fee"
      }
    ]
  },
  {
    title: "Mileage Allowance Increased",
    previousPayment: "$699.80",
    paymentChange: "$725.60",
    paymentDirection: 'increase',
    time: "11:22 AM",
    date: "May 3, 2025",
    user: "Jennifer Liu",
    changes: [
      {
        field: "Allowed Mileage",
        previously: "10,000 miles per year",
        now: "15,000 miles per year"
      }
    ]
  },
  {
    title: "Initial Application Submission",
    previousPayment: "-",
    paymentChange: "$750.25",
    paymentDirection: 'increase',
    time: "9:15 AM",
    date: "May 1, 2025",
    user: "Michael McCann",
    changes: [
      {
        field: "Term Length",
        previously: "-",
        now: "24 months"
      },
      {
        field: "Down Payment",
        previously: "-",
        now: "$5,000.00"
      },
      {
        field: "Allowed Mileage",
        previously: "-",
        now: "10,000 miles per year"
      },
      {
        field: "Capitalization",
        previously: "-",
        now: "Tax only"
      }
    ]
  },
  {
    title: "Changed Tax Capitalization Option",
    previousPayment: "$725.60",
    paymentChange: "$710.35",
    paymentDirection: 'decrease',
    time: "3:40 PM",
    date: "May 4, 2025",
    user: "Tom Williams",
    changes: [
      {
        field: "Capitalization",
        previously: "Tax and Fee",
        now: "Tax only"
      }
    ]
  }
];

export const notes: Note[] = [
  {
    content: 'Customer has requested expedited processing. @tom can you please review this application by EOD?',
    time: '11:22 AM',
    date: 'May 7, 2025',
    user: 'Michael McCann'
  },
  {
    content: '@michael I noticed the applicant has a prior lease with us. Their payment history was excellent.',
    time: '10:45 AM',
    date: 'May 7, 2025',
    user: 'Jennifer Liu'
  },
  {
    content: 'Customer requested to be contacted only via email for all future communications.',
    time: '5:30 PM',
    date: 'May 6, 2025',
    user: 'Sarah Johnson'
  },
  {
    content: '@jennifer @michael Credit check has been approved. The customer qualifies for our premier rate.',
    time: '3:15 PM',
    date: 'May 5, 2025',
    user: 'Tom Williams'
  },
  {
    content: 'Customer is looking to take delivery before end of month. @sarah can we expedite the paperwork?',
    time: '9:10 AM',
    date: 'May 5, 2025',
    user: 'Michael McCann'
  }
];
