
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

// Report related types
export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'status' | 'application' | 'timeline' | 'financial';
  generatedDate: string;
  filters: any[];
  data: StatusReportData | ApplicationTypeReportData | TimelineReportData | FinancialReportData;
}

export interface StatusReportData {
  totalApplications: number;
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
}

export interface ApplicationTypeReportData {
  totalApplications: number;
  typeDistribution: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  approvalRates: Array<{
    type: string;
    approved: number;
    total: number;
    rate: number;
  }>;
}

export interface TimelineReportData {
  averageProcessingTime: number;
  statusTransitionTimes: Array<{
    status: string;
    averageDays: number;
  }>;
  applicationsOverTime: Array<{
    date: string;
    count: number;
  }>;
}

export interface FinancialReportData {
  averageDownPayment: number;
  averageTermLength: number;
  averageMonthlyPayment: number;
  averageRates: Array<{
    type: string;
    rate: number;
  }>;
}

// Database row type for standard reports
export interface StandardReportRow {
  id: string;
  title: string;
  description: string | null;
  report_type: 'status' | 'application' | 'timeline' | 'financial';
  report_data: StatusReportData | ApplicationTypeReportData | TimelineReportData | FinancialReportData;
  generated_date: string;
  created_by: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
  created_by_profile?: {
    email: string;
  };
  updated_by_profile?: {
    email: string;
  };
}
