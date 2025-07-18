
// Financial summary related types
export interface FinancialSummaryItem {
  relationship: string;
  value: string;
}

export interface LoanFinancialSummaryTabData {
  bankApr: string;
  customerApr: string;
  aprDifference: string;
  term: string;
  amountFinanced: string;
  monthlyPayment: string;
  adjustedTotalFinanceCharge: string;
  computedLtvRatio: string;
  cashDownDeposit: string;
  otherDownPayment: string;
  totalDownPayment: string;
  basePrice: string;
  creditsAndDiscounts: string;
  destinationFee: string;
  tireFeeWasteFee: string;
  leadAcidBatteryFee: string;
  documentationFee: string;
  taxableSubTotal: string;
  electronicFilingFee: string;
  registrationTransferTitlingFees: string;
  totalGovtAndAdditionalFees: string;
  stateTax: string;
  countyTax: string;
  cityTax: string;
  totalTaxes: string;
  transactionId: string;
  acceptedOfferDate: string;
  transactionVersion: string;
}

export interface LeaseFinancialSummaryTabData {
  basePrice: string;
  destFee: string;
  msrp: string;
  discounts: string;
  cashPriceOnContract: string;
  federalEvCredit: string;
  additionalAdvanceAmount: string;
  rebate: string;
  capitalizedCostBase: string;
  grossCapitalizedCost: string;
  adjustedCapitalizedCost: string;
  originalRvPercent: string;
  subventedRvPercent: string;
  enhancedRvPercent: string;
  enhancedRv: string;
  standardMf: string;
  customerMf: string;
  depreciationAndAmortizedAmounts: string;
  rentCharge: string;
  totalOfBaseMonthlyPayment: string;
  leaseTerm: string;
  baseMonthlyPayment: string;
  monthlySalesTaxRate: string;
  monthlySalesTax: string;
  totalMonthlyPayment: string;
  purchaseOptionFee: string;
  dispositionFee: string;
  nextPaymentDate: string;
  ccrTaxCap: string;
  salesTaxCap: string;
  totalCapitalizedTax: string;
  ccrTaxUpfront: string;
  salesTaxUpfront: string;
  totalUpfrontTax: string;
  documentationFee: string;
  acquisitionFee: string;
  totalCapitalizedFees: string;
  optionalElectronicRegistrationFee: string;
  registrationTransferTitlingFees: string;
  totalGovtAndAdditionalFees: string;
  cashPaidByCustomer: string;
  amountFinanced: string;
  acceptedOfferDate: string;
  transactionId: string;
  transactionVersion: string;
}

export interface FinancialSummary {
  lfs: {
    tabs: string[];
    activeTab: string;
    requested: LeaseFinancialSummaryTabData;
    approved: LeaseFinancialSummaryTabData;
    customer: LeaseFinancialSummaryTabData;
  };
  type: 'Lease' | 'Loan';
  loan?: {
    tabs: string[];
    activeTab: string;
    requested: LoanFinancialSummaryTabData;
    approved: LoanFinancialSummaryTabData;
    customer: LoanFinancialSummaryTabData;
  };
  // Add new property to track lender-specific financial summaries
  lenderSummaries?: Record<string, {
    type: 'Lease' | 'Loan';
    tabs: string[];
    activeTab?: string;
    selectedForCustomer?: boolean; // New property to track if this lender has been presented to customer
    requested: LeaseFinancialSummaryTabData | LoanFinancialSummaryTabData;
    approved: LeaseFinancialSummaryTabData | LoanFinancialSummaryTabData;
    customer: LeaseFinancialSummaryTabData | LoanFinancialSummaryTabData;
  }>;
  selectedLender?: string;
  selectedTab?: string;
}
