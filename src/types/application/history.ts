
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
}

export interface Note {
  content: string;
  time: string;
  date: string;
  user: string;
}
