
import { DealStructureOffer } from '../../types/application';

// Lease offers
export const leaseOffers: DealStructureOffer[] = [
  {
    lenderName: "LFS",
    status: "Approved",
    applicationType: "Lease",
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
    status: "Pending",
    applicationType: "Lease",
    requested: [
      { name: "termLength", label: "Term Length (months)", value: "48" },
      { name: "mileageAllowance", label: "Mileage Allowance", value: "10,000" },
      { name: "rv", label: "RV%", value: "65.50%" },
      { name: "rvs", label: "RV$", value: "$58,950.00" },
      { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$6,500.00" },
      { name: "maxLtv", label: "Max LTV", value: "90%" },
      { name: "ltv", label: "LTV", value: "65%" },
      { name: "dti", label: "DTI", value: "11%" },
      { name: "pti", label: "PTI", value: "8%" },
      { name: "fico", label: "FICO", value: "745" },
      { name: "mf", label: "MF", value: "0.00028" }
    ],
    approved: [
      { name: "termLength", label: "Term Length (months)", value: "48" },
      { name: "mileageAllowance", label: "Mileage Allowance", value: "10,000" },
      { name: "rv", label: "RV%", value: "65.50%" },
      { name: "rvs", label: "RV$", value: "$58,950.00" },
      { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$6,500.00" },
      { name: "maxLtv", label: "Max LTV", value: "90%" },
      { name: "ltv", label: "LTV", value: "65%" },
      { name: "dti", label: "DTI", value: "11%" },
      { name: "pti", label: "PTI", value: "8%" },
      { name: "fico", label: "FICO", value: "745" },
      { name: "mf", label: "MF", value: "0.00028" }
    ],
    customer: [],
    stipulations: [],
    contractStatus: "Pending Customer Decision",
    collapsedView: {
      termLength: "48",
      monthlyPayments: "629.50",
      dueAtSigning: "6500.00"
    }
  },
  {
    lenderName: "Bank of America",
    status: "Declined",
    applicationType: "Lease",
    requested: [
      { name: "termLength", label: "Term Length (months)", value: "24" },
      { name: "mileageAllowance", label: "Mileage Allowance", value: "15,000" },
      { name: "rv", label: "RV%", value: "80.00%" },
      { name: "rvs", label: "RV$", value: "$72,000.00" },
      { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$9,500.00" },
      { name: "maxLtv", label: "Max LTV", value: "85%" },
      { name: "ltv", label: "LTV", value: "55%" },
      { name: "dti", label: "DTI", value: "9%" },
      { name: "pti", label: "PTI", value: "6%" },
      { name: "fico", label: "FICO", value: "745" },
      { name: "mf", label: "MF", value: "0.00032" }
    ],
    approved: [
      { name: "termLength", label: "Term Length (months)", value: "24" },
      { name: "mileageAllowance", label: "Mileage Allowance", value: "15,000" },
      { name: "rv", label: "RV%", value: "80.00%" },
      { name: "rvs", label: "RV$", value: "$72,000.00" },
      { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$9,500.00" },
      { name: "maxLtv", label: "Max LTV", value: "85%" },
      { name: "ltv", label: "LTV", value: "55%" },
      { name: "dti", label: "DTI", value: "9%" },
      { name: "pti", label: "PTI", value: "6%" },
      { name: "fico", label: "FICO", value: "745" },
      { name: "mf", label: "MF", value: "0.00032" }
    ],
    customer: [],
    stipulations: [],
    contractStatus: "",
    collapsedView: {
      termLength: "24",
      monthlyPayments: "875.30",
      dueAtSigning: "9500.00"
    }
  }
];

// Loan offers
export const loanOffers: DealStructureOffer[] = [
  {
    lenderName: "Wells Fargo",
    status: "Approved",
    applicationType: "Loan",
    requested: [
      { name: "termLength", label: "Term Length (months)", value: "60" },
      { name: "downPayment", label: "Down Payment", value: "$10,000.00" },
      { name: "apr", label: "APR", value: "3.99%" },
      { name: "amountFinanced", label: "Amount Financed", value: "$60,000.00" },
      { name: "maxLtv", label: "Max LTV", value: "110%" },
      { name: "ltv", label: "LTV", value: "80%" },
      { name: "dti", label: "DTI", value: "20%" },
      { name: "pti", label: "PTI", value: "12%" },
      { name: "fico", label: "FICO", value: "760" }
    ],
    approved: [
      { name: "termLength", label: "Term Length (months)", value: "60" },
      { name: "downPayment", label: "Down Payment", value: "$10,000.00" },
      { name: "apr", label: "APR", value: "3.99%" },
      { name: "amountFinanced", label: "Amount Financed", value: "$60,000.00" },
      { name: "maxLtv", label: "Max LTV", value: "110%" },
      { name: "ltv", label: "LTV", value: "80%" },
      { name: "dti", label: "DTI", value: "20%" },
      { name: "pti", label: "PTI", value: "12%" },
      { name: "fico", label: "FICO", value: "760" }
    ],
    customer: [
      { name: "termLength", label: "Term Length (months)", value: "60" },
      { name: "downPayment", label: "Down Payment", value: "$15,000.00" },
      { name: "apr", label: "APR", value: "3.99%" },
      { name: "amountFinanced", label: "Amount Financed", value: "$55,000.00" },
      { name: "maxLtv", label: "Max LTV", value: "110%" },
      { name: "ltv", label: "LTV", value: "73%" },
      { name: "dti", label: "DTI", value: "18%" },
      { name: "pti", label: "PTI", value: "10%" },
      { name: "fico", label: "FICO", value: "760" }
    ],
    stipulations: [
      {
        customerRole: "Primary",
        requestedDocument: "Proof of Income",
        status: "Submitted",
        date: "03/15/2025"
      },
      {
        customerRole: "Primary",
        requestedDocument: "Proof of Residence",
        status: "Pending",
        date: "03/15/2025"
      }
    ],
    contractStatus: "Pending Documentation",
    collapsedView: {
      termLength: "60",
      monthlyPayments: "1,014.52",
      dueAtSigning: "15000.00"
    }
  },
  {
    lenderName: "Capital One",
    status: "Pending",
    applicationType: "Loan",
    requested: [
      { name: "termLength", label: "Term Length (months)", value: "72" },
      { name: "downPayment", label: "Down Payment", value: "$8,000.00" },
      { name: "apr", label: "APR", value: "4.25%" },
      { name: "amountFinanced", label: "Amount Financed", value: "$62,000.00" },
      { name: "maxLtv", label: "Max LTV", value: "120%" },
      { name: "ltv", label: "LTV", value: "89%" },
      { name: "dti", label: "DTI", value: "25%" },
      { name: "pti", label: "PTI", value: "15%" },
      { name: "fico", label: "FICO", value: "720" }
    ],
    approved: [],
    customer: [],
    stipulations: [],
    contractStatus: "Awaiting Approval",
    collapsedView: {
      termLength: "72",
      monthlyPayments: "958.14",
      dueAtSigning: "8000.00"
    }
  }
];

export const dealStructureData: DealStructureOffer[] = [
  ...leaseOffers,
  ...loanOffers
];

// Loan offers template for reuse
export const loanOfferTemplate = (lenderName: string, status: string = "Available") => ({
  lenderName,
  status,
  applicationType: "Loan",
  requested: [
    { name: "termLength", label: "Term Length (months)", value: "60" },
    { name: "downPayment", label: "Down Payment", value: "$15,000.00" },
    { name: "apr", label: "APR", value: "4.99%" },
    { name: "amountFinanced", label: "Amount Financed", value: "$55,000.00" },
    { name: "maxLtv", label: "Max LTV", value: "110%" },
    { name: "ltv", label: "LTV", value: "85%" },
    { name: "dti", label: "DTI", value: "30%" },
    { name: "pti", label: "PTI", value: "15%" },
    { name: "fico", label: "FICO", value: "720" }
  ],
  approved: [
    { name: "termLength", label: "Term Length (months)", value: "60" },
    { name: "downPayment", label: "Down Payment", value: "$15,000.00" },
    { name: "apr", label: "APR", value: "4.99%" },
    { name: "amountFinanced", label: "Amount Financed", value: "$55,000.00" },
    { name: "maxLtv", label: "Max LTV", value: "110%" },
    { name: "ltv", label: "LTV", value: "85%" },
    { name: "dti", label: "DTI", value: "30%" },
    { name: "pti", label: "PTI", value: "15%" },
    { name: "fico", label: "FICO", value: "720" }
  ],
  customer: [],
  stipulations: [],
  contractStatus: "",
  collapsedView: {
    termLength: "60",
    monthlyPayments: "1,328.45",
    dueAtSigning: "15000.00"
  }
});

// Lease offers template for reuse
export const leaseOfferTemplate = (lenderName: string, status: string = "Available") => ({
  lenderName,
  status,
  applicationType: "Lease",
  requested: [
    { name: "termLength", label: "Term Length (months)", value: "36" },
    { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
    { name: "rv", label: "RV%", value: "60%" },
    { name: "rvs", label: "RV$", value: "$54,000.00" },
    { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$8,000.00" },
    { name: "maxLtv", label: "Max LTV", value: "N/A" },
    { name: "ltv", label: "LTV", value: "75%" },
    { name: "dti", label: "DTI", value: "25%" },
    { name: "pti", label: "PTI", value: "12%" },
    { name: "fico", label: "FICO", value: "710" },
    { name: "mf", label: "MF", value: "0.00040" }
  ],
  approved: [
    { name: "termLength", label: "Term Length (months)", value: "36" },
    { name: "mileageAllowance", label: "Mileage Allowance", value: "12,000" },
    { name: "rv", label: "RV%", value: "60%" },
    { name: "rvs", label: "RV$", value: "$54,000.00" },
    { name: "ccrDownPayment", label: "CCR/Down Payment", value: "$8,000.00" },
    { name: "maxLtv", label: "Max LTV", value: "N/A" },
    { name: "ltv", label: "LTV", value: "75%" },
    { name: "dti", label: "DTI", value: "25%" },
    { name: "pti", label: "PTI", value: "12%" },
    { name: "fico", label: "FICO", value: "710" },
    { name: "mf", label: "MF", value: "0.00040" }
  ],
  customer: [],
  stipulations: [],
  contractStatus: "",
  collapsedView: {
    termLength: "36",
    monthlyPayments: "750.60",
    dueAtSigning: "8000.00"
  }
});
