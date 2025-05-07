
import { Application, ApplicationFullDetails, DealStructureOffer, FinancialSummaryTabData } from '../types/application';

export const applications: Application[] = [
  {
    id: '1',
    orderNumber: 'AD 24567-17246',
    name: 'Becca Yukelson',
    type: 'Loan',
    status: 'Approved',
    notes: 'A series of short comments may go here, a series of short comments may go here, a series of short comments may go here, a series of short comments may go here.',
    date: '2024-05-01'
  },
  {
    id: '2',
    orderNumber: 'AD 24567-17246',
    name: 'Becca Yukelson',
    type: 'Loan',
    status: 'Approved',
    notes: 'A series of short comments may go here, a series of short comments may go here, a series of short comments may go here, a series of short comments may go here.',
    date: '2024-04-20'
  },
  {
    id: '3',
    orderNumber: 'AD 24567-17246',
    name: 'Becca Yukelson',
    type: 'Loan',
    status: 'Approved',
    notes: 'A series of short comments may go here, a series of short comments may go here, a series of short comments may go here, a series of short comments may go here.',
    date: '2024-04-15'
  },
  {
    id: '4',
    orderNumber: 'AD 24567-17246',
    name: 'Becca Yukelson',
    type: 'Loan',
    status: 'Approved',
    notes: 'A series of short comments may go here, a series of short comments may go here, a series of short comments may go here, a series of short comments may go here.',
    date: '2024-04-10'
  }
];

// Financial Summary data based on screenshot
const financialSummaryData: {
  requested: FinancialSummaryTabData;
  approved: FinancialSummaryTabData;
  customer: FinancialSummaryTabData;
} = {
  requested: {
    basePrice: '128,450',
    destFee: '1,500',
    msrp: '129,950',
    discounts: '9,250',
    cashPriceOnContract: '120,700',
    federalEvCredit: '7,500',
    additionalAdvanceAmount: '0',
    rebate: '7,500',
    capitalizedCostBase: '121,770',
    grossCapitalizedCost: '114,270',
    adjustedCapitalizedCost: '114,270',
    originalRvPercent: '55.65',
    subventedRvPercent: '65.65',
    enhancedRvPercent: '65.65',
    enhancedRv: '85,312.18',
    standardMf: '0.00437',
    customerMf: '0.00001',
    depreciationAndAmortizedAmounts: '28,957.83',
    rentCharge: '36',
    totalOfBaseMonthlyPayment: '28,993.825',
    leaseTerm: '18',
    baseMonthlyPayment: '1,610.77',
    monthlySalesTaxRate: '7',
    monthlySalesTax: '0',
    totalMonthlyPayment: '1,610.77',
    purchaseOptionFee: '450',
    dispositionFee: '450',
    nextPaymentDate: 'Jun 1, 2025',
    ccrTaxCap: '0',
    salesTaxCap: '0',
    totalCapitalizedTax: '0',
    ccrTaxUpfront: '0',
    salesTaxUpfront: '2,554.57',
    totalUpfrontTax: '2,554.57',
    documentationFee: '75',
    acquisitionFee: '995',
    totalCapitalizedFees: '1,070',
    optionalElectronicRegistrationFee: '25',
    registrationTransferTitlingFees: '416',
    totalGovtAndAdditionalFees: '441',
    cashPaidByCustomer: '4,606.34',
    amountFinanced: '119,164.23',
    acceptedOfferDate: 'Apr 27, 2025',
    transactionId: '77bc4c23-9708-4283-b311-66952c536be7',
    transactionVersion: '1'
  },
  approved: {
    basePrice: '128,450',
    destFee: '1,500',
    msrp: '129,950',
    discounts: '9,250',
    cashPriceOnContract: '120,700',
    federalEvCredit: '7,500',
    additionalAdvanceAmount: '0',
    rebate: '7,500',
    capitalizedCostBase: '121,770',
    grossCapitalizedCost: '114,270',
    adjustedCapitalizedCost: '114,270',
    originalRvPercent: '55.65',
    subventedRvPercent: '65.65',
    enhancedRvPercent: '65.65',
    enhancedRv: '85,312.18',
    standardMf: '0.00437',
    customerMf: '0.00001',
    depreciationAndAmortizedAmounts: '28,957.83',
    rentCharge: '36',
    totalOfBaseMonthlyPayment: '28,993.825',
    leaseTerm: '18',
    baseMonthlyPayment: '1,610.77',
    monthlySalesTaxRate: '7',
    monthlySalesTax: '0',
    totalMonthlyPayment: '1,610.77',
    purchaseOptionFee: '450',
    dispositionFee: '450',
    nextPaymentDate: 'Jun 1, 2025',
    ccrTaxCap: '0',
    salesTaxCap: '0',
    totalCapitalizedTax: '0',
    ccrTaxUpfront: '0',
    salesTaxUpfront: '2,554.57',
    totalUpfrontTax: '2,554.57',
    documentationFee: '75',
    acquisitionFee: '995',
    totalCapitalizedFees: '1,070',
    optionalElectronicRegistrationFee: '25',
    registrationTransferTitlingFees: '416',
    totalGovtAndAdditionalFees: '441',
    cashPaidByCustomer: '4,606.34',
    amountFinanced: '119,164.23',
    acceptedOfferDate: 'Apr 27, 2025',
    transactionId: '77bc4c23-9708-4283-b311-66952c536be7',
    transactionVersion: '1'
  },
  customer: {
    basePrice: '128,450',
    destFee: '1,500',
    msrp: '129,950',
    discounts: '9,250',
    cashPriceOnContract: '120,700',
    federalEvCredit: '7,500',
    additionalAdvanceAmount: '0',
    rebate: '7,500',
    capitalizedCostBase: '121,770',
    grossCapitalizedCost: '114,270',
    adjustedCapitalizedCost: '114,270',
    originalRvPercent: '55.65',
    subventedRvPercent: '65.65',
    enhancedRvPercent: '65.65',
    enhancedRv: '85,312.18',
    standardMf: '0.00437',
    customerMf: '0.00001',
    depreciationAndAmortizedAmounts: '28,957.83',
    rentCharge: '36',
    totalOfBaseMonthlyPayment: '28,993.825',
    leaseTerm: '18',
    baseMonthlyPayment: '1,610.77',
    monthlySalesTaxRate: '7',
    monthlySalesTax: '0',
    totalMonthlyPayment: '1,610.77',
    purchaseOptionFee: '450',
    dispositionFee: '450',
    nextPaymentDate: 'Jun 1, 2025',
    ccrTaxCap: '0',
    salesTaxCap: '0',
    totalCapitalizedTax: '0',
    ccrTaxUpfront: '0',
    salesTaxUpfront: '2,554.57',
    totalUpfrontTax: '2,554.57',
    documentationFee: '75',
    acquisitionFee: '995',
    totalCapitalizedFees: '1,070',
    optionalElectronicRegistrationFee: '25',
    registrationTransferTitlingFees: '416',
    totalGovtAndAdditionalFees: '441',
    cashPaidByCustomer: '4,606.34',
    amountFinanced: '119,164.23',
    acceptedOfferDate: 'Apr 27, 2025',
    transactionId: '77bc4c23-9708-4283-b311-66952c536be7',
    transactionVersion: '1'
  }
};

const dealStructureData: DealStructureOffer[] = [
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

export const applicationDetails: ApplicationFullDetails = {
  details: {
    orderNumber: 'AD 24567-17246',
    model: 'Air Dream Edition (GT)',
    edition: 'Dream Edition',
    orderedBy: 'Stephanie Nelson',
    status: 'Approved'
  },
  applicantInfo: {
    relationship: 'Spouse',
    firstName: 'Bandit',
    middleName: 'Jules',
    lastName: 'Heeler',
    emailAddress: 'bjheeler@gmail.com',
    contactNumber: '(650) 888-8888',
    dob: '03/12/1990',
    residenceType: 'Mortgage',
    housingPaymentAmount: '$7,000.00',
    address: '211 Surfbird Isle',
    city: 'Foster City',
    state: 'CA',
    zipCode: '94404',
    employmentType: 'Self-employed',
    employerName: 'Ludo Studio',
    jobTitle: 'Actor',
    incomeAmount: '$83,333.33',
    otherSourceOfIncome: 'Consultant',
    otherIncomeAmount: '$10,000.00'
  },
  coApplicantInfo: {
    relationship: 'Spouse',
    firstName: 'Chilli',
    middleName: 'K',
    lastName: 'Heeler',
    emailAddress: 'Chilliheeler@gmail.com',
    contactNumber: '(650) 777-7777',
    dob: '06/11/1988',
    residenceType: 'Mortgage',
    housingPaymentAmount: '$7,000.00',
    address: '211 Surfbird Isle',
    city: 'Foster City',
    state: 'CA',
    zipCode: '94404',
    employmentType: 'Self-employed',
    employerName: 'Ludo Studio',
    jobTitle: 'Actress',
    incomeAmount: '$83,333.33',
    otherSourceOfIncome: 'Consultant',
    otherIncomeAmount: '$10,000.00'
  },
  vehicleData: {
    vin: '50EA1PGA9RA004169',
    trim: 'Grand Touring AWD',
    year: '2025',
    model: 'Air',
    msrp: '$125,000.00',
    gccCashPrice: '$115,000.00',
    applicableDiscounts: 'On-site, Referral, etc.',
    totalDiscountAmount: '$10,000.00'
  },
  appDtReferences: {
    dtPortalState: '50EA1PGA9RA004169',
    dtId: '600XXXXX',
    applicationDate: '08/11/2024'
  },
  orderDetails: {
    vehicleTradeIn: {
      year: 'Placeholder Text',
      make: 'Placeholder Text',
      model: 'Placeholder Text',
      trim: 'Placeholder Text',
      lienHolder: 'Placeholder Text',
      totalValue: 'Placeholder Text',
      payoffAmount: 'Placeholder Text'
    },
    sale: {
      invoiceSummary: {
        model: 'Air',
        trim: 'Touring',
        options: [
          { name: 'Option', price: '$10,000.00' },
          { name: 'Option', price: '$2,000.00' },
          { name: 'Option', price: '$5,500.00' },
          { name: 'Option', price: '$3,200.00' },
        ],
        discounts: [
          { name: 'Studio Unit', value: '' },
          { name: 'January Program', value: '' },
        ],
        subTotal: '$113,700.00'
      },
      credits: {
        items: [
          { name: 'Referral', value: '$2,000.00' },
          { name: 'Deposit', value: '$1,000.00' },
        ],
        subTotal: '$3,000.00'
      },
      taxesAndFees: {
        salesTax: { rate: '10%', amount: '$11,370.00' },
        registrationFees: { type: 'DMV', amount: '$500.00' },
        otherFees: { type: 'FL Doc Stamp', amount: '$12.00' },
        total: '$11,882.00'
      },
      amountFinanced: '$100,000.00',
      totalDueAtDelivery: '$22,582.00',
      invoiceSummaryDetails: Array(20).fill({ label: 'Label', subLabel: 'Sub - Label', value: 'Placeholder Text' })
    },
    registrationData: Array(8).fill({ label: 'Label', value: 'Placeholder Text' })
  },
  history: Array(4).fill({
    title: 'History Title',
    previously: 'Placeholder Text',
    now: 'Placeholder Text',
    time: '11.22 am',
    date: 'Friday, Feb 14',
    user: 'Michael McCann'
  }),
  notes: [
    {
      content: 'Hey @Tom, this customer is the best',
      time: '11.22 am',
      date: 'Friday, Feb 14',
      user: 'Michael McCann'
    }
  ],
  financialSummary: {
    lfs: {
      tabs: ['Requested', 'Approved', 'Customer'],
      activeTab: 'Approved',
      requested: financialSummaryData.requested,
      approved: financialSummaryData.approved,
      customer: financialSummaryData.customer
    }
  },
  dealStructure: dealStructureData
};
