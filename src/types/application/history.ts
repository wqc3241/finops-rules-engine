
// History and notes related types
export interface HistoryItem {
  title: string;
  previously?: string;
  now?: string;
  time: string;
  date: string;
  user: string;
  // Fields for version history
  previousPayment: string;
  paymentChange: string;
  paymentDirection: 'increase' | 'decrease';
  changes: Array<{
    field: string;
    previously: string;
    now: string;
  }>;
  // Enhanced fields for lender association
  versionId: string;
  lenderId?: string;
  lenderName?: string;
  lenderOffer?: {
    applicationType: 'Lease' | 'Loan';
    termLength: string;
    apr?: string;
    mf?: string;
    monthlyPayment: string;
    downPayment?: string;
    dueAtSigning?: string;
    status: string;
  };
  isShownToCustomer?: boolean;
}

export interface Note {
  content: string;
  time: string;
  date: string;
  user: string;
}
