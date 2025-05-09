
import { ApplicationFullDetails } from '../../../types/application';
import { baseApplicationDetails } from './baseApplicationDetails';
import { orderDetails } from '../orderDetails';

// Data for applications with Pending Signature status
export const pendingSignatureApplications: Record<string, ApplicationFullDetails> = {
  // Emily Chang - Loan - Pending Signature
  '10': {
    ...baseApplicationDetails,
    details: {
      orderNumber: 'AD 34567-98765',
      model: 'Air Grand Touring',
      edition: 'Grand Touring',
      orderedBy: 'Emily Chang',
      status: 'Pending Signature'
    },
    dealStructure: [
      {
        lenderName: "Liberty Financial",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "60" },
          { name: "apr", label: "APR", value: "4.25%" },
          { name: "downPayment", label: "Down Payment", value: "$15,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "110%" },
          { name: "ltv", label: "LTV", value: "95%" },
          { name: "dti", label: "DTI", value: "28%" },
          { name: "pti", label: "PTI", value: "14%" },
          { name: "fico", label: "FICO", value: "752" }
        ],
        approved: [
          { name: "termLength", label: "Term Length (months)", value: "60" },
          { name: "apr", label: "APR", value: "4.25%" },
          { name: "downPayment", label: "Down Payment", value: "$15,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "110%" },
          { name: "ltv", label: "LTV", value: "95%" },
          { name: "dti", label: "DTI", value: "28%" },
          { name: "pti", label: "PTI", value: "14%" },
          { name: "fico", label: "FICO", value: "752" }
        ],
        customer: [
          { name: "termLength", label: "Term Length (months)", value: "60" },
          { name: "apr", label: "APR", value: "4.25%" },
          { name: "downPayment", label: "Down Payment", value: "$15,000.00" },
          { name: "offerAcceptedBy", label: "Offer Accepted By", value: "Emily Chang" },
        ],
        stipulations: [],
        contractStatus: "Pending Customer Signature",
        collapsedView: {
          termLength: "60",
          monthlyPayments: "1,583.25",
          dueAtSigning: "15000.00"
        }
      },
      {
        lenderName: "Bank of America",
        status: "Not Selected",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "72" },
          { name: "apr", label: "APR", value: "4.49%" },
          { name: "downPayment", label: "Down Payment", value: "$12,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "105%" },
          { name: "ltv", label: "LTV", value: "98%" },
          { name: "dti", label: "DTI", value: "28%" },
          { name: "pti", label: "PTI", value: "15%" },
          { name: "fico", label: "FICO", value: "752" }
        ],
        approved: [
          { name: "termLength", label: "Term Length (months)", value: "72" },
          { name: "apr", label: "APR", value: "4.49%" },
          { name: "downPayment", label: "Down Payment", value: "$12,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "105%" },
          { name: "ltv", label: "LTV", value: "98%" },
          { name: "dti", label: "DTI", value: "28%" },
          { name: "pti", label: "PTI", value: "15%" },
          { name: "fico", label: "FICO", value: "752" }
        ],
        customer: [],
        stipulations: [],
        contractStatus: "Not Selected",
        collapsedView: {
          termLength: "72",
          monthlyPayments: "1,390.80",
          dueAtSigning: "12000.00"
        }
      },
      {
        lenderName: "Chase",
        status: "Not Selected",
        requested: [
          { name: "termLength", label: "Term Length (months)", value: "60" },
          { name: "apr", label: "APR", value: "4.35%" },
          { name: "downPayment", label: "Down Payment", value: "$18,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "100%" },
          { name: "ltv", label: "LTV", value: "90%" },
          { name: "dti", label: "DTI", value: "28%" },
          { name: "pti", label: "PTI", value: "13%" },
          { name: "fico", label: "FICO", value: "752" }
        ],
        approved: [
          { name: "termLength", label: "Term Length (months)", value: "60" },
          { name: "apr", label: "APR", value: "4.35%" },
          { name: "downPayment", label: "Down Payment", value: "$18,000.00" },
          { name: "maxLtv", label: "Max LTV", value: "100%" },
          { name: "ltv", label: "LTV", value: "90%" },
          { name: "dti", label: "DTI", value: "28%" },
          { name: "pti", label: "PTI", value: "13%" },
          { name: "fico", label: "FICO", value: "752" }
        ],
        customer: [],
        stipulations: [],
        contractStatus: "Not Selected",
        collapsedView: {
          termLength: "60",
          monthlyPayments: "1,520.40",
          dueAtSigning: "18000.00"
        }
      }
    ],
    orderDetails: {
      ...orderDetails,
      vehicleTradeIn: {
        year: '2020',
        make: 'Tesla',
        model: 'Model Y',
        trim: 'Long Range',
        lienHolder: 'Wells Fargo',
        totalValue: '$43,000',
        payoffAmount: '$28,500'
      }
    }
  }
};
