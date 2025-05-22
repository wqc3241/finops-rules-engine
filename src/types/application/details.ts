
// Application details types
export interface ApplicationDetails {
  orderNumber: string;
  model: string;
  edition: string;
  orderedBy: string;
  status: string;
  type: string;
}

export interface ApplicationFullDetails {
  details: ApplicationDetails;
  applicantInfo?: any;
  coApplicantInfo?: any;
  vehicleData?: any;
  appDtReferences?: any;
  orderDetails?: any;
  history?: any[];
  notes?: any[];
  financialSummary?: any;
  dealStructure?: any[];
}
