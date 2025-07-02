export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  category: DocumentCategory;
  status: DocumentItemStatus;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  uploadedDate?: string;
  uploadedBy?: string;
  lastModified?: string;
  notes?: string;
  isRequired: boolean;
  expirationDate?: string;
}

export type DocumentCategory = 
  | 'order'
  | 'registration' 
  | 'customer'
  | 'stipulation'
  | 'compliance'
  | 'supporting';

export type DocumentItemStatus = 
  | 'not_submitted'
  | 'submitted'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'expired';

export interface DocumentCategoryInfo {
  id: DocumentCategory;
  label: string;
  description: string;
  icon: string;
}

export interface DocumentUpload {
  documentId: string;
  file: File;
  notes?: string;
}

export interface DocumentStatusUpdate {
  documentId: string;
  status: DocumentItemStatus;
  notes?: string;
  updatedBy: string;
}