import { ApplicationFullDetails } from '../../../types/application';
import { baseApplicationDetails } from './baseApplicationDetails';
import { orderDetails } from '../orderDetails';

// Data for applications with Booked status
export const bookedApplications: Record<string, ApplicationFullDetails> = {
  // James Wilson - Loan - Booked
  '11': {
    ...baseApplicationDetails,
    details: {
      orderNumber: 'AD 11223-45678',
      model: 'Air Touring',
      edition: 'Touring',
      orderedBy: 'James Wilson',
      status: 'Booked',
      type: 'Loan'
    },
    orderDetails: {
      ...orderDetails,
      vehicleTradeIn: {
        year: '2019',
        make: 'Honda',
        model: 'Accord',
        trim: 'EX-L',
        lienHolder: 'Honda Financial',
        totalValue: '$22,000',
        payoffAmount: '$8,500'
      },
      registrationData: [
        ...orderDetails.registrationData.filter(item => item.label !== 'Registration State/Province' && 
                                                 item.label !== 'Registration City' && 
                                                 item.label !== 'Registration Zip/Postal Code'),
        { label: 'Registration State/Province', value: 'Pennsylvania' },
        { label: 'Registration City', value: 'Philadelphia' },
        { label: 'Registration Zip/Postal Code', value: '19101' }
      ]
    },
    dealStructure: [
      {
        lenderName: "Capital One Auto Finance",
        status: "Approved",
        applicationType: "Loan",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "72" },
          { name: "apr", label: "APR", value: "5.25%" },
          { name: "downPayment", label: "Down Payment", value: "$12,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "120%" },
          { name: "ltv", label: "LTV", value: "98%" },
          { name: "dti", label: "DTI", value: "35%" },
          { name: "pti", label: "PTI", value: "18%" },
          { name: "fico", label: "FICO", value: "725" }
        ],
        approved: [
          { name: "termLength", label: "Term Length (months)", value: "72" },
          { name: "apr", label: "APR", value: "5.25%" },
          { name: "downPayment", label: "Down Payment", value: "$12,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "120%" },
          { name: "ltv", label: "LTV", value: "98%" },
          { name: "dti", label: "DTI", value: "35%" },
          { name: "pti", label: "PTI", value: "18%" },
          { name: "fico", label: "FICO", value: "725" }
        ],
        customer: [
          { name: "termLength", label: "Term Length (months)", value: "72" },
          { name: "apr", label: "APR", value: "5.25%" },
          { name: "downPayment", label: "Down Payment", value: "$12,000.00" },
          { name: "offerAcceptedBy", label: "Offer Accepted By", value: "James Wilson" },
        ],
        stipulations: [],
        contractStatus: "Contract Booked",
        collapsedView: {
          termLength: "72",
          monthlyPayments: "1,405.60",
          downPayment: "$12,000.00"
        }
      },
      {
        lenderName: "Wells Fargo Auto",
        status: "Declined",
        applicationType: "Loan",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "60" },
          { name: "apr", label: "APR", value: "5.49%" },
          { name: "downPayment", label: "Down Payment", value: "$15,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "110%" },
          { name: "ltv", label: "LTV", value: "95%" },
          { name: "dti", label: "DTI", value: "35%" },
          { name: "pti", label: "PTI", value: "19%" },
          { name: "fico", label: "FICO", value: "725" }
        ],
        approved: [
          { name: "termLength", label: "Term Length (months)", value: "60" },
          { name: "apr", label: "APR", value: "5.49%" },
          { name: "downPayment", label: "Down Payment", value: "$15,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "110%" },
          { name: "ltv", label: "LTV", value: "95%" },
          { name: "dti", label: "DTI", value: "35%" },
          { name: "pti", label: "PTI", value: "19%" },
          { name: "fico", label: "FICO", value: "725" }
        ],
        customer: [],
        stipulations: [],
        contractStatus: "Not Selected",
        collapsedView: {
          termLength: "60",
          monthlyPayments: "1,520.75",
          downPayment: "$15,000.00"
        }
      },
      {
        lenderName: "Chase",
        status: "Pending",
        applicationType: "Loan",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "48" },
          { name: "apr", label: "APR", value: "4.99%" },
          { name: "downPayment", label: "Down Payment", value: "$18,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "100%" },
          { name: "ltv", label: "LTV", value: "90%" },
          { name: "dti", label: "DTI", value: "35%" },
          { name: "pti", label: "PTI", value: "17%" },
          { name: "fico", label: "FICO", value: "725" }
        ],
        approved: [
          { name: "termLength", label: "Term Length (months)", value: "48" },
          { name: "apr", label: "APR", value: "4.99%" },
          { name: "downPayment", label: "Down Payment", value: "$18,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "100%" },
          { name: "ltv", label: "LTV", value: "90%" },
          { name: "dti", label: "DTI", value: "35%" },
          { name: "pti", label: "PTI", value: "17%" },
          { name: "fico", label: "FICO", value: "725" }
        ],
        customer: [],
        stipulations: [],
        contractStatus: "Not Selected",
        collapsedView: {
          termLength: "48",
          monthlyPayments: "1,625.30",
          downPayment: "$18,000.00"
        }
      }
    ]
  }
};
