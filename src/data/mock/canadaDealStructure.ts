import { DealStructureOffer } from '@/types/application';

// SCI Lease Deal Structure Template
export const sciLeaseDealStructure: DealStructureOffer = {
  lenderName: 'SCI',
  status: 'Approved',
  applicationType: 'Lease',
  requested: [
    { name: 'termLength', label: 'Term Length', value: '36 months' },
    { name: 'monthlyPayment', label: 'Monthly Payment', value: '$453.92' },
    { name: 'dueAtSigning', label: 'Due at Signing', value: '$3,948.92' },
    { name: 'mileageAllowance', label: 'Mileage Allowance', value: '60,000 km' },
    { name: 'excessMileageCharge', label: 'Excess Mileage Charge', value: '$0.20/km' },
    { name: 'residualValue', label: 'Residual Value', value: '$26,693.00' },
    { name: 'residualPercent', label: 'Residual Percent', value: '60.05%' },
    { name: 'moneyFactor', label: 'Money Factor', value: '0.00035' },
    { name: 'acquisitionFee', label: 'Acquisition Fee', value: '$995.00' },
    { name: 'dispositionFee', label: 'Disposition Fee', value: '$495.00' }
  ],
  approved: [
    { name: 'termLength', label: 'Term Length', value: '36 months' },
    { name: 'monthlyPayment', label: 'Monthly Payment', value: '$425.72' },
    { name: 'dueAtSigning', label: 'Due at Signing', value: '$4,420.72' },
    { name: 'mileageAllowance', label: 'Mileage Allowance', value: '60,000 km' },
    { name: 'excessMileageCharge', label: 'Excess Mileage Charge', value: '$0.20/km' },
    { name: 'residualValue', label: 'Residual Value', value: '$26,670.00' },
    { name: 'residualPercent', label: 'Residual Percent', value: '60.00%' },
    { name: 'moneyFactor', label: 'Money Factor', value: '0.00030' },
    { name: 'acquisitionFee', label: 'Acquisition Fee', value: '$995.00' },
    { name: 'dispositionFee', label: 'Disposition Fee', value: '$495.00' }
  ],
  customer: [
    { name: 'termLength', label: 'Term Length', value: '36 months' },
    { name: 'monthlyPayment', label: 'Monthly Payment', value: '$425.72' },
    { name: 'dueAtSigning', label: 'Due at Signing', value: '$4,420.72' },
    { name: 'mileageAllowance', label: 'Mileage Allowance', value: '60,000 km' },
    { name: 'excessMileageCharge', label: 'Excess Mileage Charge', value: '$0.20/km' },
    { name: 'residualValue', label: 'Residual Value', value: '$26,670.00' },
    { name: 'residualPercent', label: 'Residual Percent', value: '60.00%' },
    { name: 'moneyFactor', label: 'Money Factor', value: '0.00030' },
    { name: 'acquisitionFee', label: 'Acquisition Fee', value: '$995.00' },
    { name: 'dispositionFee', label: 'Disposition Fee', value: '$495.00' }
  ],
  stipulations: [
    { customerRole: 'Applicant', requestedDocument: 'Proof of Canadian Residence', status: 'Submitted', date: '2024-01-15' },
    { customerRole: 'Applicant', requestedDocument: 'Proof of Income', status: 'Submitted', date: '2024-01-15' },
    { customerRole: 'Applicant', requestedDocument: 'Valid Driver\'s License', status: 'Submitted', date: '2024-01-14' }
  ],
  contractStatus: 'Offer Is On Track',
  collapsedView: {
    termLength: '36',
    monthlyPayments: '$425.72',
    dueAtSigning: '$4,420.72'
  }
};

// RBC Loan Deal Structure Template
export const rbcLoanDealStructure: DealStructureOffer = {
  lenderName: 'RBC',
  status: 'Approved',
  applicationType: 'Loan',
  requested: [
    { name: 'termLength', label: 'Term Length', value: '60 months' },
    { name: 'monthlyPayment', label: 'Monthly Payment', value: '$735.26' },
    { name: 'downPayment', label: 'Down Payment', value: '$8,500.00' },
    { name: 'customerApr', label: 'Customer APR', value: '5.99%' },
    { name: 'bankApr', label: 'Bank APR', value: '5.49%' },
    { name: 'amountFinanced', label: 'Amount Financed', value: '$38,643.75' },
    { name: 'totalInterest', label: 'Total Interest', value: '$5,615.60' },
    { name: 'ltv', label: 'LTV Ratio', value: '85.50%' },
    { name: 'dti', label: 'DTI Ratio', value: '28.50%' },
    { name: 'pti', label: 'PTI Ratio', value: '14.20%' }
  ],
  approved: [
    { name: 'termLength', label: 'Term Length', value: '60 months' },
    { name: 'monthlyPayment', label: 'Monthly Payment', value: '$705.18' },
    { name: 'downPayment', label: 'Down Payment', value: '$10,000.00' },
    { name: 'customerApr', label: 'Customer APR', value: '5.49%' },
    { name: 'bankApr', label: 'Bank APR', value: '4.99%' },
    { name: 'amountFinanced', label: 'Amount Financed', value: '$36,593.25' },
    { name: 'totalInterest', label: 'Total Interest', value: '$5,060.80' },
    { name: 'ltv', label: 'LTV Ratio', value: '80.25%' },
    { name: 'dti', label: 'DTI Ratio', value: '25.80%' },
    { name: 'pti', label: 'PTI Ratio', value: '12.50%' }
  ],
  customer: [
    { name: 'termLength', label: 'Term Length', value: '60 months' },
    { name: 'monthlyPayment', label: 'Monthly Payment', value: '$705.18' },
    { name: 'downPayment', label: 'Down Payment', value: '$10,000.00' },
    { name: 'customerApr', label: 'Customer APR', value: '5.49%' },
    { name: 'bankApr', label: 'Bank APR', value: '4.99%' },
    { name: 'amountFinanced', label: 'Amount Financed', value: '$36,593.25' },
    { name: 'totalInterest', label: 'Total Interest', value: '$5,060.80' },
    { name: 'ltv', label: 'LTV Ratio', value: '80.25%' },
    { name: 'dti', label: 'DTI Ratio', value: '25.80%' },
    { name: 'pti', label: 'PTI Ratio', value: '12.50%' }
  ],
  stipulations: [
    { customerRole: 'Applicant', requestedDocument: 'Proof of Canadian Residence', status: 'Submitted', date: '2024-01-15' },
    { customerRole: 'Applicant', requestedDocument: 'Proof of Employment', status: 'Submitted', date: '2024-01-15' },
    { customerRole: 'Applicant', requestedDocument: 'Valid Driver\'s License', status: 'Submitted', date: '2024-01-14' },
    { customerRole: 'Applicant', requestedDocument: 'Bank Statements (Last 3 Months)', status: 'Submitted', date: '2024-01-16' }
  ],
  contractStatus: 'Offer Is On Track',
  collapsedView: {
    termLength: '60',
    monthlyPayments: '$705.18',
    downPayment: '$10,000.00'
  }
};
