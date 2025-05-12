
// Basic application types
export interface Application {
  id: string;
  orderNumber: string;
  name: string;
  type: string;
  status: string;
  notes: string; // Keeping this for backward compatibility
  notesArray?: Note[]; // Adding array of notes
  date: string;
}

export interface ApplicationDetails {
  orderNumber: string;
  model: string;
  edition: string;
  orderedBy: string;
  status: string;
  type: string; // Making type required to match Lease or Loan
}

export interface ApplicationFullDetails {
  details: ApplicationDetails;
  applicantInfo: ApplicantInfo;
  coApplicantInfo?: ApplicantInfo;
  vehicleData: VehicleData;
  appDtReferences: AppDTReferences;
  orderDetails: OrderDetail;
  history: HistoryItem[];
  notes: Note[];
  financialSummary: FinancialSummary;
  dealStructure: DealStructureOffer[];
}

// Importing all types needed for the ApplicationFullDetails interface
import { ApplicantInfo } from './applicant';
import { VehicleData, AppDTReferences } from './vehicle';
import { OrderDetail } from './order';
import { HistoryItem, Note } from './history';
import { FinancialSummary } from './financial';
import { DealStructureOffer } from './deal';
