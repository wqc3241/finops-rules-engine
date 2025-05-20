
// Risk and compliance related types

export interface RequiredNotice {
  name: string;
  data: string;
  time: string;
  entry: string;
}

export interface ComplianceCheck {
  name: string;
  data?: string;
  time?: string;
  entry?: string;
}

export interface QCError {
  isError: boolean;
  isCritical: boolean;
  errorType?: string;
  date?: string;
  errorBy?: string;
  description?: string;
  processStep?: string;
  area?: "Maker" | "Qcer" | "Funding" | string;
}

export interface ActivityHistoryItem {
  actionName: string;
  userName: string;
  date: string;
  time: string;
}

export interface RiskComplianceData {
  requiredNotices: RequiredNotice[];
  complianceChecks: ComplianceCheck[];
  activityHistory: ActivityHistoryItem[];
  qcErrors: QCError[];
}
