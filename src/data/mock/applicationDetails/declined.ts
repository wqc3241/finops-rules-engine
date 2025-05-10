
import { ApplicationFullDetails } from '../../../types/application';
import { baseApplicationDetails } from './baseApplicationDetails';

// Data for applications with Declined status
export const declinedApplications: Record<string, ApplicationFullDetails> = {
  // Aisha Washington - Lease - Declined
  '8': {
    ...baseApplicationDetails,
    details: {
      orderNumber: 'AD 76543-10987',
      model: 'Air Pure',
      edition: 'Base',
      orderedBy: 'Aisha Washington',
      status: 'Declined'
    },
    dealStructure: [
      {
        lenderName: "LFS",
        status: "Declined",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "36" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "10,000" },
          { name: "rv", label: "RV%", value: "55.12%" },
          { name: "rvs", label: "RV$", value: "$45,198.40" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$4,500.00" },
          { name: "maxLtv", label: "Max LTV", value: "N/A" },
          { name: "ltv", label: "LTV", value: "95%" },
          { name: "dti", label: "DTI", value: "51%" }, // High DTI led to decline
          { name: "pti", label: "PTI", value: "22%" },
          { name: "fico", label: "FICO", value: "580" }, // Low FICO score
          { name: "mf", label: "MF", value: "0.00084" }
        ],
        approved: [],
        customer: [],
        stipulations: [
          {
            customerRole: "Primary",
            requestedDocument: "Credit History Explanation",
            status: "Not Submitted",
            date: "05/04/2025"
          }
        ],
        contractStatus: "Application Declined",
        collapsedView: {
          termLength: "36",
          monthlyPayments: "825.50",
          dueAtSigning: "4500.00"
        }
      },
      {
        lenderName: "Chase",
        status: "Declined",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "24" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
          { name: "rv", label: "RV%", value: "65.00%" },
          { name: "rvs", label: "RV$", value: "$53,300.00" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$5,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "90%" },
          { name: "ltv", label: "LTV", value: "92%" },
          { name: "dti", label: "DTI", value: "51%" },
          { name: "pti", label: "PTI", value: "22%" },
          { name: "fico", label: "FICO", value: "580" },
          { name: "mf", label: "MF", value: "0.00090" }
        ],
        approved: [],
        customer: [],
        stipulations: [],
        contractStatus: "Application Declined",
        collapsedView: {
          termLength: "24",
          monthlyPayments: "950.25",
          dueAtSigning: "5000.00"
        }
      },
      {
        lenderName: "Capital One Auto Finance",
        status: "Declined",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "48" },
          { name: "apr", label: "APR", value: "12.99%" },
          { name: "downPayment", label: "Down Payment", value: "$10,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "90%" },
          { name: "ltv", label: "LTV", value: "88%" },
          { name: "dti", label: "DTI", value: "51%" },
          { name: "pti", label: "PTI", value: "22%" },
          { name: "fico", label: "FICO", value: "580" }
        ],
        approved: [],
        customer: [],
        stipulations: [],
        contractStatus: "Application Declined",
        collapsedView: {
          termLength: "48",
          monthlyPayments: "1,125.60",
          dueAtSigning: "10000.00"
        }
      }
    ]
  }
};
