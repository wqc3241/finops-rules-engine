
// Report-related types
export interface ReportFilter {
  field: string;
  operator: string;
  value: string | number | boolean;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'status' | 'application' | 'timeline' | 'financial' | 'credit';
  generatedDate: string;
  filters: ReportFilter[];
  data: any; // Type will vary based on report type
}

export interface StatusReportData {
  totalApplications: number;
  statusDistribution: {
    status: string;
    count: number;
    percentage: number;
  }[];
}

export interface ApplicationTypeReportData {
  totalApplications: number;
  typeDistribution: {
    type: string;
    count: number;
    percentage: number;
  }[];
  approvalRates: {
    type: string;
    approved: number;
    total: number;
    rate: number;
  }[];
}

export interface TimelineReportData {
  averageProcessingTime: number; // in days
  statusTransitionTimes: {
    status: string;
    averageDays: number;
  }[];
  applicationsOverTime: {
    date: string;
    count: number;
  }[];
}

export interface FinancialReportData {
  averageDownPayment: number;
  averageTermLength: number;
  averageMonthlyPayment: number;
  averageRates: {
    type: string;
    rate: number;
  }[];
}

export interface ChartData {
  id: string;
  title: string;
  type: 'pie' | 'bar' | 'line' | 'area' | 'scatter';
  reportId: string;
  data: any; // Formatted specifically for the chart type
}
