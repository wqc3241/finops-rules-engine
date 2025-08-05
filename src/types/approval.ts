export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "IN_REVIEW";

export type UserRole = "FS_OPS" | "FS_ADMIN" | "admin";

export interface ChangeRequest {
  id: string;
  createdBy: string;
  createdAt: string;
  status: ApprovalStatus;
  versionId: string;
  comment?: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ChangeDetail {
  requestId: string;
  table: string;
  ruleKey: string;
  oldValue: any;
  newValue: any;
  status: ApprovalStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  comment?: string;
}

export interface RuleVersion {
  id: string;
  table: string;
  ruleKey: string;
  value: any;
  versionId: string;
  createdAt: string;
}

export interface TableChangesSummary {
  table: string;
  schemaId: string;
  changedRowsCount: number;
  changes: ChangeDetail[];
  status: ApprovalStatus;
}

export interface ChangeRequestWithDetails extends ChangeRequest {
  tableChanges: TableChangesSummary[];
  totalChanges: number;
}