import { ApplicationFullDetails } from '../../../types/application';
import { baseApplicationDetails } from './baseApplicationDetails';

// Data for applications with Submitted status
export const submittedApplications: Record<string, ApplicationFullDetails> = {
  // Daniel Patel - Loan - Submitted
  '15': {
    ...baseApplicationDetails,
    details: {
      orderNumber: 'AD 12345-67890',
      model: 'Air Pure',
      edition: 'Pure',
      orderedBy: 'Daniel Patel',
      status: 'Submitted',
      type: 'Loan'
    },
    notes: [
      {
        content: "Initial application submitted by customer via online portal",
        time: "10:30 AM",
        date: "May 9, 2023",
        user: "System"
      },
      {
        content: "Credit check initiated, waiting for results",
        time: "11:15 AM",
        date: "May 9, 2023",
        user: "Jennifer Liu"
      }
    ],
    dealStructure: [
      {
        lenderName: "Capital One Auto Finance",
        status: "Pending",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "60" },
          { name: "apr", label: "APR", value: "6.25%" },
          { name: "downPayment", label: "Down Payment", value: "$9,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "110%" },
          { name: "ltv", label: "LTV", value: "88%" },
          { name: "dti", label: "DTI", value: "32%" },
          { name: "pti", label: "PTI", value: "15%" },
          { name: "fico", label: "FICO", value: "705" }
        ],
        approved: [],
        customer: [],
        stipulations: [],
        contractStatus: "Application Under Review",
        collapsedView: {
          termLength: "60",
          monthlyPayments: "1,375.50",
          dueAtSigning: "9000.00"
        }
      },
      {
        lenderName: "Bank of America",
        status: "Pending",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "72" },
          { name: "apr", label: "APR", value: "6.49%" },
          { name: "downPayment", label: "Down Payment", value: "$7,500.00" },
          { name: "maxLtv", label: "Max LTV", value: "105%" },
          { name: "ltv", label: "LTV", value: "96%" },
          { name: "dti", label: "DTI", value: "32%" },
          { name: "pti", label: "PTI", value: "17%" },
          { name: "fico", label: "FICO", value: "705" }
        ],
        approved: [],
        customer: [],
        stipulations: [],
        contractStatus: "Application Under Review",
        collapsedView: {
          termLength: "72",
          monthlyPayments: "1,298.40",
          dueAtSigning: "7500.00"
        }
      }
    ]
  },
  // Michael Torres - Loan - Submitted
  '5': {
    ...baseApplicationDetails,
    details: {
      orderNumber: 'AD 87432-21958',
      model: 'Air Grand Touring Performance',
      edition: 'Grand Touring Performance',
      orderedBy: 'Michael Torres',
      status: 'Submitted',
      type: 'Loan'
    },
    notes: [
      {
        content: "Customer interested in extended warranty options",
        time: "3:45 PM",
        date: "May 10, 2023",
        user: "Tom Williams"
      },
      {
        content: "Vehicle configuration confirmed with dealership",
        time: "2:20 PM",
        date: "May 10, 2023",
        user: "Michael McCann"
      }
    ],
    dealStructure: [
      {
        lenderName: "Wells Fargo Auto",
        status: "Pending",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "60" },
          { name: "apr", label: "APR", value: "5.75%" },
          { name: "downPayment", label: "Down Payment", value: "$15,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "110%" },
          { name: "ltv", label: "LTV", value: "92%" },
          { name: "dti", label: "DTI", value: "30%" },
          { name: "pti", label: "PTI", value: "16%" },
          { name: "fico", label: "FICO", value: "730" }
        ],
        approved: [],
        customer: [],
        stipulations: [],
        contractStatus: "Application Under Review",
        collapsedView: {
          termLength: "60",
          monthlyPayments: "1,650.75",
          dueAtSigning: "15000.00"
        }
      }
    ]
  }
};
