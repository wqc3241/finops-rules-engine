
import { DealStructureOffer } from '../../types/application';

export const dealStructureData: DealStructureOffer[] = [
  {
    lenderName: "LFS",
    requested: [
      { name: "termLength", label: "Term Length (months)", value: "36" },
      { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
      { name: "rv", label: "RV%", value: "72.26%" },
      { name: "rvs", label: "RV$", value: "$65,000.00" },
      { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$7,100.00" },
      { name: "maxLtv", label: "Max LTV", value: "N/A" },
      { name: "ltv", label: "LTV", value: "60%" },
      { name: "dti", label: "DTI", value: "10%" },
      { name: "pti", label: "PTI", value: "7%" },
      { name: "fico", label: "FICO", value: "745" },
      { name: "mf", label: "MF", value: "0.00025" },
      { name: "lenderAppId", label: "Lender App ID", value: "20XXXXXX" },
      { name: "appDateTime", label: "App Date & Time", value: "8/11/2024 11:30PM" },
      { name: "creditOfferExpDate", label: "Credit Offer Exp Date", value: "10/10/24" }
    ],
    approved: [
      { name: "termLength", label: "Term Length (months)", value: "36" },
      { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
      { name: "rv", label: "RV%", value: "72.26%" },
      { name: "rvs", label: "RV$", value: "$65,000.00" },
      { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$7,100.00" },
      { name: "maxLtv", label: "Max LTV", value: "95%" },
      { name: "ltv", label: "LTV", value: "60%" },
      { name: "dti", label: "DTI", value: "10%" },
      { name: "pti", label: "PTI", value: "7%" },
      { name: "fico", label: "FICO", value: "745" },
      { name: "mf", label: "MF", value: "0.00025" },
      { name: "creditDecisionDateTime", label: "Credit Decision D&T", value: "8/11/2024 11:30PM" },
      { name: "creditOfferExpDate", label: "Credit Offer Exp Date", value: "10/10/24" }
    ],
    customer: [
      { name: "termLength", label: "Term Length (months)", value: "36" },
      { name: "mileageAllowance", label: "Mileage Allowance", value: "10,000" },
      { name: "rv", label: "RV%", value: "72.26%" },
      { name: "rvs", label: "RV$", value: "$65,000.00" },
      { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$8,000.00" },
      { name: "maxLtv", label: "Max LTV", value: "N/A" },
      { name: "ltv", label: "LTV", value: "50%" },
      { name: "dti", label: "DTI", value: "8%" },
      { name: "pti", label: "PTI", value: "5%" },
      { name: "fico", label: "FICO", value: "745" },
      { name: "mf", label: "MF", value: "0.00025" },
      { name: "offerAcceptedBy", label: "Offer Accepted By", value: "JT Taing" },
      { name: "appDateTime", label: "App Date & Time", value: "8/11/2024 11:30PM" },
      { name: "creditOfferExpDate", label: "Credit Offer Exp Date", value: "10/10/24" }
    ],
    stipulations: [
      {
        customerRole: "Primary or Co-applicant",
        requestedDocument: "Bank Statement",
        status: "Submitted",
        date: "02/02/2025"
      },
      {
        customerRole: "Primary or Co-applicant",
        requestedDocument: "Bank Statement",
        status: "Pending",
        date: "02/02/2025"
      },
      {
        customerRole: "Primary or Co-applicant",
        requestedDocument: "Bank Statement",
        status: "Not Submitted",
        date: "02/02/2025"
      },
      {
        customerRole: "Primary or Co-applicant",
        requestedDocument: "Bank Statement",
        status: "Not Submitted",
        date: "02/02/2025"
      }
    ],
    contractStatus: "Offer Is On Track",
    collapsedView: {
      termLength: "36",
      monthlyPayments: "699.80",
      dueAtSigning: "4995.00"
    }
  },
  {
    lenderName: "Chase",
    status: "Offer Presented To Customer",
    collapsedView: {
      termLength: "36",
      monthlyPayments: "699.80",
      dueAtSigning: "4995.00"
    },
    requested: [],
    approved: [],
    customer: [],
    stipulations: [],
    contractStatus: ""
  }
];
