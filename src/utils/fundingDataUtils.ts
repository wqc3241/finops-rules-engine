
import { ApplicationFullDetails, DealStructureOffer } from '@/types/application';
import { FundingDateTimes } from '@/types/application/funding';

export const extractFundingDateTimes = (applicationData: ApplicationFullDetails): FundingDateTimes => {
  // Extract datetime values from application data
  const applicationDate = applicationData.appDtReferences?.applicationDate;
  
  return {
    initiatedDateTime: applicationDate || null,
    originalFundingSubmissionDateTime: null, // Would come from funding submission records
    latestFundingSubmissionDateTime: null,
    originalContractPendingDocsDateTime: null, // Would come from contract status changes
    latestContractPendingDocsDateTime: null,
    originalContractReturnedDateTime: null,
    latestContractReturnedDateTime: null,
    contractPartiallySignedDateTime: null, // Would come from signature tracking
    contractSignedDateTime: null,
    bookedDateTime: null, // Would come from booking records
    originalAppSubmittedDateTime: applicationDate || null,
    latestAppSubmittedDateTime: applicationDate || null,
    currentDecisionDateTime: null // Would come from latest decision record
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

export const formatDateTime = (dateTime: string | null): string => {
  if (!dateTime) return 'Not Set';
  return new Date(dateTime).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const calculateVariance = (expected: number | null, actual: number | null): number | null => {
  if (expected === null || actual === null) return null;
  return expected - actual;
};
