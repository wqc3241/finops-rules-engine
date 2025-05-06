
import { Application, ApplicationFullDetails } from '../types/application';

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
      acceptedOffer: Array(4).fill(Array(3).fill({ relationship: 'Relationship', value: 'Placeholder text' })),
      residualValue: Array(2).fill(Array(3).fill({ relationship: 'Relationship', value: 'Placeholder text' })),
      payment: Array(3).fill(Array(3).fill({ relationship: 'Relationship', value: 'Placeholder text' })),
      paymentContd: Array(2).fill(Array(3).fill({ relationship: 'Relationship', value: 'Placeholder text' })),
      capitalizedTax: Array(1).fill(Array(3).fill({ relationship: 'Relationship', value: 'Placeholder text' })),
      upfrontTax: Array(1).fill(Array(3).fill({ relationship: 'Relationship', value: 'Placeholder text' })),
      capitalizedFees: Array(1).fill(Array(3).fill({ relationship: 'Relationship', value: 'Placeholder text' })),
      upfrontFees: Array(1).fill(Array(3).fill({ relationship: 'Relationship', value: 'Placeholder text' }))
    }
  }
};
