
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
  country?: string;
  // Reapplication tracking fields
  originalApplicationId?: string; // Links to the first application in the reapply chain
  parentApplicationId?: string; // Links to the immediate previous application
  reapplicationSequence?: number; // Tracks the sequence (1 for original, 2 for first reapply, etc.)
  reapplyEnabled?: boolean; // Indicates if this application can be reapplied
}

export interface Note {
  content: string;
  date: string;
  time: string;
  user: string;
}
