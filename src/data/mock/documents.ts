import { DocumentItem, DocumentCategoryInfo } from '@/types/application/documents';

export const documentCategories: DocumentCategoryInfo[] = [
  {
    id: 'order',
    label: 'Order Documents',
    description: 'Purchase order, sales contract, and lease agreement',
    icon: 'FileText'
  },
  {
    id: 'registration',
    label: 'Registration Documents', 
    description: 'Vehicle registration, title transfer, and license plates',
    icon: 'Car'
  },
  {
    id: 'customer',
    label: 'Customer Documents',
    description: 'Driver license, insurance, and personal identification',
    icon: 'User'
  },
  {
    id: 'stipulation',
    label: 'Stipulation Documents',
    description: 'Documents required by lenders for approval',
    icon: 'AlertCircle'
  },
  {
    id: 'compliance',
    label: 'Compliance Documents',
    description: 'Regulatory forms and compliance requirements',
    icon: 'Shield'
  },
  {
    id: 'supporting',
    label: 'Supporting Documents',
    description: 'Additional financial and verification documents',
    icon: 'Folder'
  }
];

export const mockDocuments: DocumentItem[] = [
  // Order Documents
  {
    id: 'doc-001',
    name: 'Purchase Order',
    type: 'Purchase Order',
    category: 'order',
    status: 'approved',
    fileUrl: '/documents/purchase-order-2024-15.pdf',
    fileName: 'purchase-order-2024-15.pdf',
    fileSize: '2.3 MB',
    uploadedDate: '2025-05-01',
    uploadedBy: 'Michael McCann',
    lastModified: '2025-05-01',
    isRequired: true,
    notes: 'Original purchase order signed by customer'
  },
  {
    id: 'doc-002',
    name: 'Sales Contract',
    type: 'Sales Contract',
    category: 'order',
    status: 'approved',
    fileUrl: '/documents/sales-contract-2024-15.pdf',
    fileName: 'sales-contract-2024-15.pdf',
    fileSize: '1.8 MB',
    uploadedDate: '2025-05-01',
    uploadedBy: 'Michael McCann',
    lastModified: '2025-05-02',
    isRequired: true,
    notes: 'Executed sales contract with all terms'
  },
  {
    id: 'doc-003',
    name: 'Lease Agreement',
    type: 'Lease Agreement',
    category: 'order',
    status: 'pending_review',
    fileUrl: '/documents/lease-agreement-2024-15.pdf',
    fileName: 'lease-agreement-2024-15.pdf',
    fileSize: '3.1 MB',
    uploadedDate: '2025-05-03',
    uploadedBy: 'Jennifer Liu',
    lastModified: '2025-05-03',
    isRequired: true,
    notes: 'Pending final review by legal team'
  },

  // Registration Documents
  {
    id: 'doc-004',
    name: 'Vehicle Registration',
    type: 'Vehicle Registration',
    category: 'registration',
    status: 'submitted',
    fileUrl: '/documents/vehicle-registration-2024-15.pdf',
    fileName: 'vehicle-registration-2024-15.pdf',
    fileSize: '0.8 MB',
    uploadedDate: '2025-05-04',
    uploadedBy: 'Tom Williams',
    lastModified: '2025-05-04',
    isRequired: true,
    notes: 'State vehicle registration certificate'
  },
  {
    id: 'doc-005',
    name: 'Title Transfer',
    type: 'Title Transfer',
    category: 'registration',
    status: 'not_submitted',
    isRequired: true,
    notes: 'Awaiting title transfer documentation'
  },
  {
    id: 'doc-006',
    name: 'License Plates',
    type: 'License Plates',
    category: 'registration',
    status: 'not_submitted',
    isRequired: false,
    notes: 'Temporary plates assigned, permanent pending'
  },

  // Customer Documents
  {
    id: 'doc-007',
    name: 'Driver License',
    type: 'Driver License',
    category: 'customer',
    status: 'approved',
    fileUrl: '/documents/driver-license-john-doe.pdf',
    fileName: 'driver-license-john-doe.pdf',
    fileSize: '0.5 MB',
    uploadedDate: '2025-05-01',
    uploadedBy: 'Michael McCann',
    lastModified: '2025-05-01',
    isRequired: true,
    expirationDate: '2027-03-15',
    notes: 'Valid driver license, expires 2027'
  },
  {
    id: 'doc-008',
    name: 'Insurance Card',
    type: 'Insurance Card',
    category: 'customer',
    status: 'approved',
    fileUrl: '/documents/insurance-card-john-doe.pdf',
    fileName: 'insurance-card-john-doe.pdf',
    fileSize: '0.3 MB',
    uploadedDate: '2025-05-01',
    uploadedBy: 'Michael McCann',
    lastModified: '2025-05-01',
    isRequired: true,
    expirationDate: '2025-12-31',
    notes: 'Current insurance policy, comprehensive coverage'
  },
  {
    id: 'doc-009',
    name: 'Social Security Card',
    type: 'Social Security Card',
    category: 'customer',
    status: 'approved',
    fileUrl: '/documents/ssn-card-john-doe.pdf',
    fileName: 'ssn-card-john-doe.pdf',
    fileSize: '0.2 MB',
    uploadedDate: '2025-05-01',
    uploadedBy: 'Michael McCann',
    lastModified: '2025-05-01',
    isRequired: true,
    notes: 'Valid SSN verification'
  },

  // Stipulation Documents
  {
    id: 'doc-010',
    name: 'Proof of Income',
    type: 'Pay Stub',
    category: 'stipulation',
    status: 'approved',
    fileUrl: '/documents/paystub-john-doe-april.pdf',
    fileName: 'paystub-john-doe-april.pdf',
    fileSize: '0.4 MB',
    uploadedDate: '2025-05-02',
    uploadedBy: 'Jennifer Liu',
    lastModified: '2025-05-02',
    isRequired: true,
    notes: 'Recent pay stub showing current income'
  },
  {
    id: 'doc-011',
    name: 'Address Verification',
    type: 'Utility Bill',
    category: 'stipulation',
    status: 'approved',
    fileUrl: '/documents/utility-bill-john-doe.pdf',
    fileName: 'utility-bill-john-doe.pdf',
    fileSize: '0.6 MB',
    uploadedDate: '2025-05-02',
    uploadedBy: 'Jennifer Liu',
    lastModified: '2025-05-02',
    isRequired: true,
    notes: 'Utility bill confirming current address'
  },
  {
    id: 'doc-012',
    name: 'ID Verification',
    type: 'Passport',
    category: 'stipulation',
    status: 'pending_review',
    fileUrl: '/documents/passport-john-doe.pdf',
    fileName: 'passport-john-doe.pdf',
    fileSize: '0.7 MB',
    uploadedDate: '2025-05-03',
    uploadedBy: 'Tom Williams',
    lastModified: '2025-05-03',
    isRequired: true,
    expirationDate: '2029-08-20',
    notes: 'US Passport for secondary ID verification'
  },

  // Compliance Documents
  {
    id: 'doc-013',
    name: 'DR0026 Form',
    type: 'Regulatory Form',
    category: 'compliance',
    status: 'approved',
    fileUrl: '/documents/dr0026-form-2024-15.pdf',
    fileName: 'dr0026-form-2024-15.pdf',
    fileSize: '1.2 MB',
    uploadedDate: '2025-05-04',
    uploadedBy: 'Sarah Johnson',
    lastModified: '2025-05-04',
    isRequired: true,
    notes: 'Completed DR0026 regulatory form'
  },
  {
    id: 'doc-014',
    name: 'ST556 Form',
    type: 'State Tax Form',
    category: 'compliance',
    status: 'submitted',
    fileUrl: '/documents/st556-form-2024-15.pdf',
    fileName: 'st556-form-2024-15.pdf',
    fileSize: '0.9 MB',
    uploadedDate: '2025-05-04',
    uploadedBy: 'Sarah Johnson',
    lastModified: '2025-05-04',
    isRequired: true,
    notes: 'State tax documentation form'
  },
  {
    id: 'doc-015',
    name: 'Letter of Guarantee',
    type: 'Financial Guarantee',
    category: 'compliance',
    status: 'approved',
    fileUrl: '/documents/letter-guarantee-2024-15.pdf',
    fileName: 'letter-guarantee-2024-15.pdf',
    fileSize: '0.5 MB',
    uploadedDate: '2025-05-05',
    uploadedBy: 'Michael McCann',
    lastModified: '2025-05-05',
    isRequired: true,
    notes: 'Financial guarantee letter from bank'
  },

  // Supporting Documents
  {
    id: 'doc-016',
    name: 'Bank Statement',
    type: 'Bank Statement',
    category: 'supporting',
    status: 'approved',
    fileUrl: '/documents/bank-statement-april-2025.pdf',
    fileName: 'bank-statement-april-2025.pdf',
    fileSize: '1.1 MB',
    uploadedDate: '2025-05-02',
    uploadedBy: 'Jennifer Liu',
    lastModified: '2025-05-02',
    isRequired: false,
    notes: 'Most recent bank statement for financial verification'
  },
  {
    id: 'doc-017',
    name: 'Employment Verification',
    type: 'Employment Letter',
    category: 'supporting',
    status: 'approved',
    fileUrl: '/documents/employment-verification-john-doe.pdf',
    fileName: 'employment-verification-john-doe.pdf',
    fileSize: '0.4 MB',
    uploadedDate: '2025-05-02',
    uploadedBy: 'Jennifer Liu',
    lastModified: '2025-05-02',
    isRequired: false,
    notes: 'Letter from employer confirming employment status'
  },
  {
    id: 'doc-018',
    name: 'Trade-in Appraisal',
    type: 'Vehicle Appraisal',
    category: 'supporting',
    status: 'rejected',
    fileUrl: '/documents/trade-in-appraisal-2024-15.pdf',
    fileName: 'trade-in-appraisal-2024-15.pdf',
    fileSize: '0.8 MB',
    uploadedDate: '2025-05-03',
    uploadedBy: 'Tom Williams',
    lastModified: '2025-05-04',
    isRequired: false,
    notes: 'Trade-in vehicle appraisal - needs updated valuation'
  }
];