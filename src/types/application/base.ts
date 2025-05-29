
// Base application type
export interface Application {
  id: string;
  orderNumber: string;
  name: string;
  status: string;
  type: string;
  date: string;
  notes?: string;
  notesArray?: Array<{
    content: string;
    date: string;
    time: string;
    user: string;
  }>;
  state?: string;
  country?: string; // Add country property to Application type
}

export interface Note {
  content: string;
  date: string;
  time: string;
  user: string;
}
