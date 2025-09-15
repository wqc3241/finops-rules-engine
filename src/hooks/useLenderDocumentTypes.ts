import { useQuery } from '@tanstack/react-query';

export interface LenderDocumentType {
  code: string;
  name: string;
  description?: string;
  category?: string;
  required?: boolean;
}

// Mock data for lender document types
// In a real application, this would come from your backend or DT API
const mockLenderDocumentTypes: LenderDocumentType[] = [
  {
    code: 'DRIVERS_LICENSE',
    name: "Driver's License",
    description: 'Valid driver license document',
    category: 'Identity',
    required: true
  },
  {
    code: 'CREDIT_APPLICATION',
    name: 'Credit Application',
    description: 'Completed credit application form',
    category: 'Application',
    required: true
  },
  {
    code: 'INSURANCE_DECLARATION',
    name: 'Insurance Declaration',
    description: 'Insurance coverage declaration page',
    category: 'Insurance',
    required: true
  },
  {
    code: 'PURCHASE_ORDER',
    name: 'Purchase Order',
    description: 'Vehicle purchase order or agreement',
    category: 'Order',
    required: true
  },
  {
    code: 'TRADE_IN_TITLE',
    name: 'Trade-in Title',
    description: 'Title document for trade-in vehicle',
    category: 'Trade-in'
  },
  {
    code: 'VEHICLE_REGISTRATION',
    name: 'Vehicle Registration',
    description: 'Current vehicle registration document',
    category: 'Registration'
  },
  {
    code: 'INCOME_VERIFICATION',
    name: 'Income Verification',
    description: 'Pay stub, salary letter, or income proof',
    category: 'Financial',
    required: true
  },
  {
    code: 'BANK_STATEMENT',
    name: 'Bank Statement',
    description: 'Recent bank account statement',
    category: 'Financial'
  },
  {
    code: 'TAX_DOCUMENT',
    name: 'Tax Document',
    description: 'Tax return or W2 form',
    category: 'Financial'
  },
  {
    code: 'EMPLOYMENT_VERIFICATION',
    name: 'Employment Verification',
    description: 'Letter of employment or verification',
    category: 'Employment'
  },
  {
    code: 'RESIDENCE_PROOF',
    name: 'Proof of Residence',
    description: 'Utility bill or lease agreement',
    category: 'Address'
  },
  {
    code: 'SSN_CARD',
    name: 'Social Security Card',
    description: 'Social security card or verification',
    category: 'Identity'
  },
  {
    code: 'PASSPORT',
    name: 'Passport',
    description: 'Valid passport document',
    category: 'Identity'
  },
  {
    code: 'BIRTH_CERTIFICATE',
    name: 'Birth Certificate',
    description: 'Official birth certificate',
    category: 'Identity'
  },
  {
    code: 'MILITARY_ID',
    name: 'Military ID',
    description: 'Military identification document',
    category: 'Identity'
  },
  {
    code: 'POWER_OF_ATTORNEY',
    name: 'Power of Attorney',
    description: 'Legal power of attorney document',
    category: 'Legal'
  },
  {
    code: 'DIVORCE_DECREE',
    name: 'Divorce Decree',
    description: 'Final divorce decree document',
    category: 'Legal'
  },
  {
    code: 'BANKRUPTCY_DISCHARGE',
    name: 'Bankruptcy Discharge',
    description: 'Bankruptcy discharge papers',
    category: 'Legal'
  },
  {
    code: 'STIPULATION_DOCUMENT',
    name: 'Stipulation Document',
    description: 'Additional required stipulation document',
    category: 'Stipulation'
  },
  {
    code: 'OTHER',
    name: 'Other Document',
    description: 'Other supporting document',
    category: 'Other'
  }
];

export const useLenderDocumentTypes = () => {
  return useQuery({
    queryKey: ['lender-document-types'],
    queryFn: async (): Promise<LenderDocumentType[]> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real application, you would fetch this from your backend:
      // const { data, error } = await supabase
      //   .from('lender_document_types')
      //   .select('*')
      //   .order('name');
      
      return mockLenderDocumentTypes;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};