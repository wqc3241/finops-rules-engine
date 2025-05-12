import { ApplicationFullDetails } from '../../../types/application';
import { baseApplicationDetails } from './baseApplicationDetails';

// Data for applications with Approved status
export const approvedApplications: Record<string, ApplicationFullDetails> = {
  // Becca Yukelson - Lease - Approved
  '1': {
    ...baseApplicationDetails,
    details: {
      orderNumber: 'AD 24567-17246',
      model: 'Air Dream Edition',
      edition: 'Dream Edition',
      orderedBy: 'Becca Yukelson',
      status: 'Approved',
      type: 'Lease'
    },
    dealStructure: [
      {
        lenderName: "LFS",
        status: "Approved",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "36" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "10,000" },
          { name: "rv", label: "RV%", value: "55.00%" },
          { name: "rvs", label: "RV$", value: "$71,500.00" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$9,500.00" },
          { name: "maxLtv", label: "Max LTV", value: "N/A" },
          { name: "ltv", label: "LTV", value: "75%" },
          { name: "dti", label: "DTI", value: "25%" },
          { name: "pti", label: "PTI", value: "12%" },
          { name: "fico", label: "FICO", value: "780" },
          { name: "mf", label: "MF", value: "0.00025" }
        ],
        approved: [
          { name: "termLength", label: "Term Length (months)", value: "36" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "10,000" },
          { name: "rv", label: "RV%", value: "55.00%" },
          { name: "rvs", label: "RV$", value: "$71,500.00" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$9,500.00" },
          { name: "maxLtv", label: "Max LTV", value: "N/A" },
          { name: "ltv", label: "LTV", value: "75%" },
          { name: "dti", label: "DTI", value: "25%" },
          { name: "pti", label: "PTI", value: "12%" },
          { name: "fico", label: "FICO", value: "780" },
          { name: "mf", label: "MF", value: "0.00025" }
        ],
        customer: [],
        stipulations: [],
        contractStatus: "Contract Ready",
        collapsedView: {
          termLength: "36",
          monthlyPayments: "1,950.30",
          dueAtSigning: "9500.00"
        }
      },
      {
        lenderName: "Chase",
        status: "Pending",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "24" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
          { name: "rv", label: "RV%", value: "65.00%" },
          { name: "rvs", label: "RV$", value: "$84,500.00" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$12,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "80%" },
          { name: "ltv", label: "LTV", value: "70%" },
          { name: "dti", label: "DTI", value: "25%" },
          { name: "pti", label: "PTI", value: "14%" },
          { name: "fico", label: "FICO", value: "780" },
          { name: "mf", label: "MF", value: "0.00028" }
        ],
        approved: [],
        customer: [],
        stipulations: [],
        contractStatus: "Application Under Review",
        collapsedView: {
          termLength: "24",
          monthlyPayments: "2,250.80",
          dueAtSigning: "12000.00"
        }
      }
    ]
  },
  // Olivia Thompson - Lease - Approved
  '14': {
    ...baseApplicationDetails,
    details: {
      orderNumber: 'AD 66778-99001',
      model: 'Air Touring',
      edition: 'Touring',
      orderedBy: 'Olivia Thompson',
      status: 'Approved',
      type: 'Lease'
    },
    dealStructure: [
      {
        lenderName: "BMW Financial Services",
        status: "Approved",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "36" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
          { name: "rv", label: "RV%", value: "56.80%" },
          { name: "rvs", label: "RV$", value: "$63,616.00" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$8,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "N/A" },
          { name: "ltv", label: "LTV", value: "82%" },
          { name: "dti", label: "DTI", value: "30%" },
          { name: "pti", label: "PTI", value: "15%" },
          { name: "fico", label: "FICO", value: "742" },
          { name: "mf", label: "MF", value: "0.00032" }
        ],
        approved: [
          { name: "termLength", label: "Term Length (months)", value: "36" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
          { name: "rv", label: "RV%", value: "56.80%" },
          { name: "rvs", label: "RV$", value: "$63,616.00" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$8,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "N/A" },
          { name: "ltv", label: "LTV", value: "82%" },
          { name: "dti", label: "DTI", value: "30%" },
          { name: "pti", label: "PTI", value: "15%" },
          { name: "fico", label: "FICO", value: "742" },
          { name: "mf", label: "MF", value: "0.00032" }
        ],
        customer: [],
        stipulations: [],
        contractStatus: "Contract Ready",
        collapsedView: {
          termLength: "36",
          monthlyPayments: "875.40",
          dueAtSigning: "8000.00"
        }
      },
      {
        lenderName: "Chase",
        status: "Declined",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "48" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "10,000" },
          { name: "rv", label: "RV%", value: "45.00%" },
          { name: "rvs", label: "RV$", value: "$50,400.00" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$9,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "N/A" },
          { name: "ltv", label: "LTV", value: "85%" },
          { name: "dti", label: "DTI", value: "30%" },
          { name: "pti", label: "PTI", value: "15%" },
          { name: "fico", label: "FICO", value: "742" },
          { name: "mf", label: "MF", value: "0.00035" }
        ],
        approved: [],
        customer: [],
        stipulations: [],
        contractStatus: "Application Declined",
        collapsedView: {
          termLength: "48",
          monthlyPayments: "790.25",
          dueAtSigning: "9000.00"
        }
      }
    ]
  }
};
