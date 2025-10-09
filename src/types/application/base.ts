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
  
  // Additional fields from transformation
  amount?: number;
  model?: string;
  edition?: string;
  orderedBy?: string;
  
  // Nested data structures
  applicantInfo?: any;
  coApplicantInfo?: any;
  vehicleData?: any;
  appDtReferences?: any;
  orderDetails?: any;
  financialSummary?: any;
  dealStructure?: any[];
  history?: any[];
  
  // Reapplication tracking fields
  originalApplicationId?: string;
  parentApplicationId?: string;
  reapplicationSequence?: number;
  reapplyEnabled?: boolean;
}

export interface Note {
  content: string;
  date: string;
  time: string;
  user: string;
}
