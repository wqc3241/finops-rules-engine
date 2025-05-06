
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

export interface FinancialSummary {
  lfs: {
    tabs: string[];
    activeTab: string;
    acceptedOffer: FinancialSummaryItem[][];
    residualValue: FinancialSummaryItem[][];
    payment: FinancialSummaryItem[][];
    paymentContd: FinancialSummaryItem[][];
    capitalizedTax: FinancialSummaryItem[][];
    upfrontTax: FinancialSummaryItem[][];
    capitalizedFees: FinancialSummaryItem[][];
    upfrontFees: FinancialSummaryItem[][];
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
}
