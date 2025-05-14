

// Deal structure related types
export interface DealStructureItem {
  name: string;
  label: string;
  value: string;
}

export interface DealStructureStipulation {
  customerRole: string;
  requestedDocument: string;
  status: 'Submitted' | 'Pending' | 'Not Submitted';
  date: string;
}

export interface DealStructureOffer {
  lenderName: string;
  status?: string;
  applicationType?: 'Lease' | 'Loan';
  requested: DealStructureItem[];
  approved: DealStructureItem[];
  customer: DealStructureItem[];
  stipulations: DealStructureStipulation[];
  contractStatus: string;
  collapsedView: {
    termLength: string;
    monthlyPayments: string;
    dueAtSigning: string;
  };
}

