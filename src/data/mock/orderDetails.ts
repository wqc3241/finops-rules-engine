
import { OrderDetail } from '../../types/application';

export const orderDetails: OrderDetail = {
  deliveryDate: '2024-12-15',
  // vehicleTradeIn removed - now fetched from database via application_id
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
  registrationData: [
    { label: 'Registration Type', value: 'Personal' },
    { label: 'Global Region', value: 'North America' },
    { label: 'Registration Country', value: 'United States' },
    { label: 'Registration State/Province', value: 'California' }, // Changed from Illinois
    { label: 'Registration Street', value: '1000 Pine Tree Ln' },
    { label: 'Registration City', value: 'San Francisco' }, // Changed from Winnetka
    { label: 'Registration Zip/Postal Code', value: '94107' }, // Changed from 60093
    { label: 'Borough/Municipality', value: '' },
    { label: 'Buyer DOB', value: '8/20/1975' },
    { label: "Buyer's DL Expiration Date", value: '8/20/2026' },
    { label: 'Is Mailing Add different than Regis Add?', value: 'No' }
  ]
};
