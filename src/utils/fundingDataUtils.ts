
import { ApplicationFullDetails, DealStructureOffer } from '@/types/application';
import { FundingKPIs } from '@/types/application/funding';

export const extractFundingKPIs = (applicationData: ApplicationFullDetails): FundingKPIs => {
  // Find the contracted/selected lender (first approved offer for now)
  const contractedOffer = applicationData.dealStructure?.find(offer => 
    offer.contractStatus === 'Contracted' || offer.approved?.length > 0
  );

  // Extract total deal value from order details
  const totalDealValue = parseFloat(
    applicationData.orderDetails?.sale?.amountFinanced?.replace(/[$,]/g, '') || '0'
  );

  // Extract down payment from contracted offer
  const downPaymentAmount = contractedOffer?.customer?.find(item => 
    item.name === 'downPayment' || item.name === 'ccrDownPayment'
  )?.value ? parseFloat(contractedOffer.customer.find(item => 
    item.name === 'downPayment' || item.name === 'ccrDownPayment'
  )!.value.replace(/[$,]/g, '')) : 0;

  // Extract monthly payment from contracted offer
  const monthlyPayment = contractedOffer?.collapsedView?.monthlyPayments ? 
    parseFloat(contractedOffer.collapsedView.monthlyPayments.replace(/[$,]/g, '')) : 0;

  // Calculate LTV ratio
  const vehicleValue = parseFloat(
    applicationData.vehicleData?.msrp?.replace(/[$,]/g, '') || '0'
  );
  const ltvRatio = vehicleValue > 0 ? (totalDealValue / vehicleValue) * 100 : 0;

  // Calculate expected funding date (application date + estimated processing time)
  const applicationDate = new Date(applicationData.appDtReferences?.applicationDate || Date.now());
  const expectedFundingDate = new Date(applicationDate);
  expectedFundingDate.setDate(expectedFundingDate.getDate() + 14); // 14 days from application

  const today = new Date();
  const daysToFunding = Math.ceil(
    (expectedFundingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    totalDealValue,
    downPaymentAmount,
    monthlyPayment,
    ltvRatio: Math.round(ltvRatio * 100) / 100,
    expectedFundingDate: expectedFundingDate.toLocaleDateString(),
    daysToFunding: Math.max(0, daysToFunding)
  };
};

export const getContractedLender = (dealStructure: DealStructureOffer[]): DealStructureOffer | null => {
  return dealStructure?.find(offer => 
    offer.contractStatus === 'Contracted' || 
    offer.status === 'Approved'
  ) || dealStructure?.[0] || null;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export const calculateVariance = (expected: number | null, actual: number | null): number | null => {
  if (expected === null || actual === null) return null;
  return expected - actual;
};
