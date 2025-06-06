
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
  'Customer Credit Change',
  'Vehicle Pricing Adjustment',
  'Trade-in Value Variance',
  'Additional Fees',
  'Documentation Requirements',
  'Lender Policy Change',
  'Other'
] as const;

export const LENDER_HELD_REASONS = [
  'Pending Income Verification',
  'Pending Insurance Documentation',
  'Pending Trade-in Title',
  'Credit Re-verification Required',
  'Stipulation Outstanding',
  'Contract Correction Needed',
  'Other'
] as const;

export type ShortFundingReason = typeof SHORT_FUNDING_REASONS[number];
export type LenderHeldReason = typeof LENDER_HELD_REASONS[number];
