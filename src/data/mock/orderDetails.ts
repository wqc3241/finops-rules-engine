
import { OrderDetail } from '../../types/application';

export const orderDetails: OrderDetail = {
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
};
