import { ApplicationFullDetails } from '../../../types/application';
import { baseApplicationDetails } from './baseApplicationDetails';
import { orderDetails } from '../orderDetails';

// Data for applications with Conditionally Approved status
export const conditionallyApprovedApplications: Record<string, ApplicationFullDetails> = {
  // Carlos Rodriguez - Lease - Conditionally Approved
  '9': {
    ...baseApplicationDetails,
    details: {
      orderNumber: 'AD 98765-23456',
      model: 'Air Touring',
      edition: 'Touring',
      orderedBy: 'Carlos Rodriguez',
      status: 'Conditionally Approved',
      type: 'Lease'
    },
    orderDetails: {
      ...orderDetails,
      registrationData: [
        ...orderDetails.registrationData.filter(item => item.label !== 'Registration State/Province' && 
                                                 item.label !== 'Registration City' && 
                                                 item.label !== 'Registration Zip/Postal Code'),
        { label: 'Registration State/Province', value: 'Arizona' },
        { label: 'Registration City', value: 'Phoenix' },
        { label: 'Registration Zip/Postal Code', value: '85001' }
      ]
    },
    dealStructure: [
      {
        lenderName: "LFS",
        status: "Conditionally Approved",
        applicationType: "Lease",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "24" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
          { name: "rv", label: "RV%", value: "65.38%" },
          { name: "rvs", label: "RV$", value: "$73,225.60" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$8,500.00" },
          { name: "maxLtv", label: "Max LTV", value: "90%" },
          { name: "ltv", label: "LTV", value: "85%" },
          { name: "dti", label: "DTI", value: "32%" },
          { name: "pti", label: "PTI", value: "12%" },
          { name: "fico", label: "FICO", value: "710" },
          { name: "mf", label: "MF", value: "0.00033" }
        ],
        approved: [
          { name: "termLength", label: "Term Length (months)", value: "24" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
          { name: "rv", label: "RV%", value: "65.38%" },
          { name: "rvs", label: "RV$", value: "$73,225.60" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$10,000.00" }, // Increased down payment condition
          { name: "maxLtv", label: "Max LTV", value: "90%" },
          { name: "ltv", label: "LTV", value: "80%" },
          { name: "dti", label: "DTI", value: "32%" },
          { name: "pti", label: "PTI", value: "11%" },
          { name: "fico", label: "FICO", value: "710" },
          { name: "mf", label: "MF", value: "0.00033" }
        ],
        customer: [],
        stipulations: [
          {
            customerRole: "Primary",
            requestedDocument: "Proof of Residence",
            status: "Not Submitted",
            date: "05/05/2025"
          },
          {
            customerRole: "Primary",
            requestedDocument: "Recent Pay Stub",
            status: "Not Submitted",
            date: "05/05/2025"
          }
        ],
        contractStatus: "Conditionally Approved",
        collapsedView: {
          termLength: "24",
          monthlyPayments: "899.75",
          dueAtSigning: "10000.00"
        }
      },
      {
        lenderName: "Chase",
        status: "Pending",
        applicationType: "Lease",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "36" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "10,000" },
          { name: "rv", label: "RV%", value: "58.00%" },
          { name: "rvs", label: "RV$", value: "$64,960.00" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$9,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "85%" },
          { name: "ltv", label: "LTV", value: "82%" },
          { name: "dti", label: "DTI", value: "32%" },
          { name: "pti", label: "PTI", value: "12%" },
          { name: "fico", label: "FICO", value: "710" },
          { name: "mf", label: "MF", value: "0.00035" }
        ],
        approved: [],
        customer: [],
        stipulations: [],
        contractStatus: "Application Under Review",
        collapsedView: {
          termLength: "36",
          monthlyPayments: "825.40",
          dueAtSigning: "9000.00"
        }
      },
      {
        lenderName: "US Bank",
        status: "Not Submitted",
        applicationType: "Loan",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "48" },
          { name: "apr", label: "APR", value: "5.75%" },
          { name: "downPayment", label: "Down Payment", value: "$12,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "90%" },
          { name: "ltv", label: "LTV", value: "80%" },
          { name: "dti", label: "DTI", value: "32%" },
          { name: "pti", label: "PTI", value: "12%" },
          { name: "fico", label: "FICO", value: "710" }
        ],
        approved: [],
        customer: [],
        stipulations: [],
        contractStatus: "Not Submitted",
        collapsedView: {
          termLength: "48",
          monthlyPayments: "1,050.80",
          dueAtSigning: "12000.00"
        }
      }
    ]
  },

  // Application ID 16 - Lease - Conditionally Approved (Emily Johnson)
  '16': {
    ...baseApplicationDetails,
    details: {
      orderNumber: 'AD 54321-09876',
      model: 'Air Grand',
      edition: 'Premium',
      orderedBy: 'Emily Johnson',
      status: 'Conditionally Approved',
      type: 'Lease'
    },
    orderDetails: {
      ...orderDetails,
      registrationData: [
        ...orderDetails.registrationData.filter(item => item.label !== 'Registration State/Province' && 
                                                 item.label !== 'Registration City' && 
                                                 item.label !== 'Registration Zip/Postal Code'),
        { label: 'Registration State/Province', value: 'Colorado' },
        { label: 'Registration City', value: 'Denver' },
        { label: 'Registration Zip/Postal Code', value: '80201' }
      ]
    },
    dealStructure: [
      {
        lenderName: "LFS",
        status: "Conditionally Approved",
        applicationType: "Lease",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "36" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
          { name: "rv", label: "RV%", value: "60.25%" },
          { name: "rvs", label: "RV$", value: "$68,082.50" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$7,500.00" },
          { name: "maxLtv", label: "Max LTV", value: "90%" },
          { name: "ltv", label: "LTV", value: "87%" },
          { name: "dti", label: "DTI", value: "30%" },
          { name: "pti", label: "PTI", value: "13%" },
          { name: "fico", label: "FICO", value: "725" },
          { name: "mf", label: "MF", value: "0.00031" }
        ],
        approved: [
          { name: "termLength", label: "Term Length (months)", value: "36" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
          { name: "rv", label: "RV%", value: "60.25%" },
          { name: "rvs", label: "RV$", value: "$68,082.50" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$9,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "90%" },
          { name: "ltv", label: "LTV", value: "82%" },
          { name: "dti", label: "DTI", value: "30%" },
          { name: "pti", label: "PTI", value: "13%" },
          { name: "fico", label: "FICO", value: "725" },
          { name: "mf", label: "MF", value: "0.00031" }
        ],
        customer: [],
        stipulations: [
          {
            customerRole: "Primary",
            requestedDocument: "Proof of Income",
            status: "Not Submitted",
            date: "05/10/2025"
          }
        ],
        contractStatus: "Conditionally Approved",
        collapsedView: {
          termLength: "36",
          monthlyPayments: "879.25",
          dueAtSigning: "9000.00"
        }
      },
      {
        lenderName: "Chase",
        status: "Pending",
        applicationType: "Lease",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "36" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "10,000" },
          { name: "rv", label: "RV%", value: "58.00%" },
          { name: "rvs", label: "RV$", value: "$65,540.00" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$8,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "85%" },
          { name: "ltv", label: "LTV", value: "83%" },
          { name: "dti", label: "DTI", value: "30%" },
          { name: "pti", label: "PTI", value: "13%" },
          { name: "fico", label: "FICO", value: "725" },
          { name: "mf", label: "MF", value: "0.00033" }
        ],
        approved: [],
        customer: [],
        stipulations: [],
        contractStatus: "Application Under Review",
        collapsedView: {
          termLength: "36",
          monthlyPayments: "845.30",
          dueAtSigning: "8000.00"
        }
      },
      {
        lenderName: "Bank of America",
        status: "Pending",
        applicationType: "Lease",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "24" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "15,000" },
          { name: "rv", label: "RV%", value: "67.00%" },
          { name: "rvs", label: "RV$", value: "$75,710.00" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$10,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "90%" },
          { name: "ltv", label: "LTV", value: "80%" },
          { name: "dti", label: "DTI", value: "30%" },
          { name: "pti", label: "PTI", value: "15%" },
          { name: "fico", label: "FICO", value: "725" },
          { name: "mf", label: "MF", value: "0.00035" }
        ],
        approved: [],
        customer: [],
        stipulations: [],
        contractStatus: "Application Under Review",
        collapsedView: {
          termLength: "24",
          monthlyPayments: "945.50",
          dueAtSigning: "10000.00"
        }
      }
    ]
  }
};
