import { ApplicationFullDetails } from '../../../types/application';
import { baseApplicationDetails } from './baseApplicationDetails';

// Data for applications with Pending status
export const pendingApplications: Record<string, ApplicationFullDetails> = {
  // Sarah Johnson - Lease - Pending
  '6': {
    ...baseApplicationDetails,
    details: {
      orderNumber: 'AD 54621-39874',
      model: 'Air Touring',
      edition: 'Touring',
      orderedBy: 'Sarah Johnson',
      status: 'Pending',
      type: 'Lease'
    },
    dealStructure: [
      {
        lenderName: "LFS",
        status: "Pending",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "36" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
          { name: "rv", label: "RV%", value: "58.40%" },
          { name: "rvs", label: "RV$", value: "$65,408.00" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$7,500.00" },
          { name: "maxLtv", label: "Max LTV", value: "N/A" },
          { name: "ltv", label: "LTV", value: "88%" },
          { name: "dti", label: "DTI", value: "36%" },
          { name: "pti", label: "PTI", value: "18%" },
          { name: "fico", label: "FICO", value: "698" },
          { name: "mf", label: "MF", value: "0.00042" }
        ],
        approved: [],
        customer: [],
        stipulations: [],
        contractStatus: "Application Under Review",
        collapsedView: {
          termLength: "36",
          monthlyPayments: "850.25",
          dueAtSigning: "7500.00"
        }
      }
    ]
  },
  // David Chen - Loan - Pending
  '7': {
    ...baseApplicationDetails,
    details: {
      orderNumber: 'AD 32198-76543',
      model: 'Air Pure',
      edition: 'Pure',
      orderedBy: 'David Chen',
      status: 'Pending',
      type: 'Loan'
    },
    dealStructure: [
      {
        lenderName: "Chase",
        status: "Pending",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "48" },
          { name: "apr", label: "APR", value: "5.99%" },
          { name: "downPayment", label: "Down Payment", value: "$8,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "105%" },
          { name: "ltv", label: "LTV", value: "92%" },
          { name: "dti", label: "DTI", value: "38%" },
          { name: "pti", label: "PTI", value: "19%" },
          { name: "fico", label: "FICO", value: "690" }
        ],
        approved: [],
        customer: [],
        stipulations: [],
        contractStatus: "Application Under Review",
        collapsedView: {
          termLength: "48",
          monthlyPayments: "1,325.40",
          dueAtSigning: "8000.00"
        }
      }
    ]
  },
  // Robert Kim - Loan - Pending
  '13': {
    ...baseApplicationDetails,
    details: {
      orderNumber: 'AD 55443-21098',
      model: 'Air Touring',
      edition: 'Touring',
      orderedBy: 'Robert Kim',
      status: 'Pending',
      type: 'Loan'
    },
    dealStructure: [
      {
        lenderName: "US Bank",
        status: "Pending",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "60" },
          { name: "apr", label: "APR", value: "5.49%" },
          { name: "downPayment", label: "Down Payment", value: "$10,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "110%" },
          { name: "ltv", label: "LTV", value: "90%" },
          { name: "dti", label: "DTI", value: "34%" },
          { name: "pti", label: "PTI", value: "17%" },
          { name: "fico", label: "FICO", value: "710" }
        ],
        approved: [],
        customer: [],
        stipulations: [],
        contractStatus: "Application Under Review",
        collapsedView: {
          termLength: "60",
          monthlyPayments: "1,420.60",
          dueAtSigning: "10000.00"
        }
      }
    ]
  }
};
