
import { ApplicationFullDetails } from '../../../types/application';
import { baseApplicationDetails } from './baseApplicationDetails';
import { orderDetails } from '../orderDetails';

// Data for applications with Funded status
export const fundedApplications: Record<string, ApplicationFullDetails> = {
  // Sophia Martinez - Lease - Funded
  '12': {
    ...baseApplicationDetails,
    details: {
      orderNumber: 'AD 87654-32109',
      model: 'Air Dream Edition',
      edition: 'Dream Edition',
      orderedBy: 'Sophia Martinez',
      status: 'Funded',
      type: 'Lease'
    },
    orderDetails: {
      ...orderDetails,
      registrationData: [
        ...orderDetails.registrationData.filter(item => item.label !== 'Registration State/Province' && 
                                                 item.label !== 'Registration City' && 
                                                 item.label !== 'Registration Zip/Postal Code'),
        { label: 'Registration State/Province', value: 'Illinois' }, // Original state
        { label: 'Registration City', value: 'Chicago' },
        { label: 'Registration Zip/Postal Code', value: '60601' }
      ]
    },
    dealStructure: [
      {
        lenderName: "LFS",
        status: "Approved",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "36" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "15,000" },
          { name: "rv", label: "RV%", value: "60.25%" },
          { name: "rvs", label: "RV$", value: "$78,325.00" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$10,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "N/A" },
          { name: "ltv", label: "LTV", value: "65%" },
          { name: "dti", label: "DTI", value: "22%" },
          { name: "pti", label: "PTI", value: "9%" },
          { name: "fico", label: "FICO", value: "815" }, // Excellent credit
          { name: "mf", label: "MF", value: "0.00018" }
        ],
        approved: [
          { name: "termLength", label: "Term Length (months)", value: "36" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "15,000" },
          { name: "rv", label: "RV%", value: "60.25%" },
          { name: "rvs", label: "RV$", value: "$78,325.00" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$10,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "N/A" },
          { name: "ltv", label: "LTV", value: "65%" },
          { name: "dti", label: "DTI", value: "22%" },
          { name: "pti", label: "PTI", value: "9%" },
          { name: "fico", label: "FICO", value: "815" },
          { name: "mf", label: "MF", value: "0.00018" }
        ],
        customer: [
          { name: "termLength", label: "Term Length (months)", value: "36" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "15,000" },
          { name: "rv", label: "RV%", value: "60.25%" },
          { name: "rvs", label: "RV$", value: "$78,325.00" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$10,000.00" },
          { name: "offerAcceptedBy", label: "Offer Accepted By", value: "Sophia Martinez" },
        ],
        stipulations: [],
        contractStatus: "Contract Funded",
        collapsedView: {
          termLength: "36",
          monthlyPayments: "1,785.30",
          dueAtSigning: "10000.00"
        }
      },
      {
        lenderName: "BMW Financial Services",
        status: "Declined",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "24" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "10,000" },
          { name: "rv", label: "RV%", value: "75.00%" },
          { name: "rvs", label: "RV$", value: "$97,500.00" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$15,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "N/A" },
          { name: "ltv", label: "LTV", value: "60%" },
          { name: "dti", label: "DTI", value: "22%" },
          { name: "pti", label: "PTI", value: "10%" },
          { name: "fico", label: "FICO", value: "815" },
          { name: "mf", label: "MF", value: "0.00015" }
        ],
        approved: [
          { name: "termLength", label: "Term Length (months)", value: "24" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "10,000" },
          { name: "rv", label: "RV%", value: "75.00%" },
          { name: "rvs", label: "RV$", value: "$97,500.00" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$15,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "N/A" },
          { name: "ltv", label: "LTV", value: "60%" },
          { name: "dti", label: "DTI", value: "22%" },
          { name: "pti", label: "PTI", value: "10%" },
          { name: "fico", label: "FICO", value: "815" },
          { name: "mf", label: "MF", value: "0.00015" }
        ],
        customer: [],
        stipulations: [],
        contractStatus: "Not Selected",
        collapsedView: {
          termLength: "24",
          monthlyPayments: "2,190.45",
          dueAtSigning: "15000.00"
        }
      },
      {
        lenderName: "Chase",
        status: "Pending",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "36" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
          { name: "rv", label: "RV%", value: "62.00%" },
          { name: "rvs", label: "RV$", value: "$80,600.00" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$12,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "N/A" },
          { name: "ltv", label: "LTV", value: "62%" },
          { name: "dti", label: "DTI", value: "22%" },
          { name: "pti", label: "PTI", value: "9%" },
          { name: "fico", label: "FICO", value: "815" },
          { name: "mf", label: "MF", value: "0.00020" }
        ],
        approved: [
          { name: "termLength", label: "Term Length (months)", value: "36" },
          { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
          { name: "rv", label: "RV%", value: "62.00%" },
          { name: "rvs", label: "RV$", value: "$80,600.00" },
          { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$12,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "N/A" },
          { name: "ltv", label: "LTV", value: "62%" },
          { name: "dti", label: "DTI", value: "22%" },
          { name: "pti", label: "PTI", value: "9%" },
          { name: "fico", label: "FICO", value: "815" },
          { name: "mf", label: "MF", value: "0.00020" }
        ],
        customer: [],
        stipulations: [],
        contractStatus: "Not Selected",
        collapsedView: {
          termLength: "36",
          monthlyPayments: "1,950.20",
          dueAtSigning: "12000.00"
        }
      }
    ]
  }
};
