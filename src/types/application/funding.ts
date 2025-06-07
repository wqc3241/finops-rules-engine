
// Funding-related types
export interface FundingInputData {
  estShortFundingAmount: number | null;
  shortFundingReason: string;
  shortFundNotes: string;
  lenderHeldOfferingReason: string;
}

export interface VarianceData {
  expectedFundingAmount: number | null;
  actualFundingAmount: number | null;
  variance: number | null; // calculated field
  varianceNotes: string;
}

export interface DocumentStatus {
  dr0026Form: 'pending' | 'generated' | 'submitted' | 'approved';
  st556Form: 'pending' | 'generated' | 'submitted' | 'approved';
  letterOfGuarantee: 'pending' | 'generated' | 'submitted' | 'approved';
}

export interface CaseStatus {
  currentCaseId: string | null;
  status: 'none' | 'open' | 'pending-docs' | 'ready-for-funding' | 'funded' | 'closed';
  autoOpenedAt: string | null;
  autoClosedAt: string | null;
}

export interface FundingDateTimes {
  initiatedDateTime: string | null;
  originalFundingSubmissionDateTime: string | null;
  latestFundingSubmissionDateTime: string | null;
  originalContractPendingDocsDateTime: string | null;
  latestContractPendingDocsDateTime: string | null;
  originalContractReturnedDateTime: string | null;
  latestContractReturnedDateTime: string | null;
  contractPartiallySignedDateTime: string | null;
  contractSignedDateTime: string | null;
  bookedDateTime: string | null;
  originalAppSubmittedDateTime: string | null;
  latestAppSubmittedDateTime: string | null;
  currentDecisionDateTime: string | null;
}

export interface FundingData {
  inputs: FundingInputData;
  variance: VarianceData;
  documents: DocumentStatus;
  caseManagement: CaseStatus;
  dateTimes: FundingDateTimes;
}

// Picklist options
export const SHORT_FUNDING_REASONS = [
  'Taxes',
  'Money Factor',
  'APR'
] as const;

export const LENDER_HELD_REASONS = [
  'Bona-fide Error',
  'Vehicle Pricing Error',
  'Capitalized Cost Reduction',
  'Incorrect Applicant Information',
  'Incorrect Taxes/Fees',
  'Missing Taxes/Fees',
  'Trade-in Error',
  '2nd payment',
  'Buydown Approval',
  'Commerical Address',
  'Invalid Signature',
  'Missing POI',
  'Missing PoR',
  'Missing PRC/Non-Resident Documents',
  'Payment Due Date',
  'Rounding Error'
] as const;

export type ShortFundingReason = typeof SHORT_FUNDING_REASONS[number];
export type LenderHeldReason = typeof LENDER_HELD_REASONS[number];
