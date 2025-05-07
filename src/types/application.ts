
export interface Application {
  id: string;
  orderNumber: string;
  name: string;
  type: string;
  status: string;
  notes: string;
  date: string;
}

export interface ApplicationDetails {
  orderNumber: string;
  model: string;
  edition: string;
  orderedBy: string;
  status: string;
}

export interface ApplicantInfo {
  relationship: string;
  firstName: string;
  middleName: string;
  lastName: string;
  emailAddress: string;
  contactNumber: string;
  dob: string;
  residenceType: string;
  housingPaymentAmount: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  employmentType: string;
  employerName: string;
  jobTitle: string;
  incomeAmount: string;
  otherSourceOfIncome: string;
  otherIncomeAmount: string;
}

export interface VehicleData {
  vin: string;
  trim: string;
  year: string;
  model: string;
  msrp: string;
  gccCashPrice: string;
  applicableDiscounts: string;
  totalDiscountAmount: string;
}

export interface AppDTReferences {
  dtPortalState: string;
  dtId: string;
  applicationDate: string;
}

export interface OrderDetail {
  vehicleTradeIn: {
    year: string;
    make: string;
    model: string;
    trim: string;
    lienHolder: string;
    totalValue: string;
    payoffAmount: string;
  };
  sale: {
    invoiceSummary: {
      model: string;
      trim: string;
      options: Array<{name: string; price: string}>;
      discounts: Array<{name: string; value: string}>;
      subTotal: string;
    };
    credits: {
      items: Array<{name: string; value: string}>;
      subTotal: string;
    };
    taxesAndFees: {
      salesTax: {rate: string; amount: string};
      registrationFees: {type: string; amount: string};
      otherFees: {type: string; amount: string};
      total: string;
    };
    amountFinanced: string;
    totalDueAtDelivery: string;
    invoiceSummaryDetails: Array<{label: string; subLabel: string; value: string}>;
  };
  registrationData: Array<{label: string; value: string}>;
}

export interface HistoryItem {
  title: string;
  previously: string;
  now: string;
  time: string;
  date: string;
  user: string;
}

export interface Note {
  content: string;
  time: string;
  date: string;
  user: string;
}

export interface FinancialSummaryItem {
  relationship: string;
  value: string;
}

export interface FinancialSummaryTabData {
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
    requested: FinancialSummaryTabData;
    approved: FinancialSummaryTabData;
    customer: FinancialSummaryTabData;
  };
}

// New interface for DealStructure
export interface DealStructureItem {
  name: string;
  label: string;
  value: string;
}

export interface DealStructureStipulation {
  customerRole: string;
  requestedDocument: string;
  status: 'Submitted' | 'Pending' | 'Not Submitted';
  date: string;
}

export interface DealStructureOffer {
  lenderName: string;
  status?: string;
  requested: DealStructureItem[];
  approved: DealStructureItem[];
  customer: DealStructureItem[];
  stipulations: DealStructureStipulation[];
  contractStatus: string;
  collapsedView: {
    termLength: string;
    monthlyPayments: string;
    dueAtSigning: string;
  };
}

export interface ApplicationFullDetails {
  details: ApplicationDetails;
  applicantInfo: ApplicantInfo;
  coApplicantInfo?: ApplicantInfo;
  vehicleData: VehicleData;
  appDtReferences: AppDTReferences;
  orderDetails: OrderDetail;
  history: HistoryItem[];
  notes: Note[];
  financialSummary: FinancialSummary;
  dealStructure: DealStructureOffer[];
}
