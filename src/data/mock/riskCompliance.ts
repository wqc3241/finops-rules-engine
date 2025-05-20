
import { RequiredNotice, ComplianceCheck, ActivityHistoryItem, QCError, RiskComplianceData } from '@/types/application';

// Mock data for required notices based on Screenshot 1
export const mockRequiredNotices: RequiredNotice[] = [
  { name: "GLBA Notice", data: "Date Action Completed", time: "Time", entry: "NA" },
  { name: "Privacy Notice", data: "Date Action Completed", time: "Time", entry: "NA" },
  { name: "E-Sign", data: "Date Action Completed", time: "Time", entry: "NA" },
  { name: "Permission to Pull Credit (Applicant)", data: "Date Action Completed", time: "Time", entry: "Employee" },
  { name: "Permission to Pull Credit (Co-Applicant)", data: "Date Action Completed", time: "Time", entry: "Employee" },
  { name: "Co-Applicant Notice", data: "Date Action Completed", time: "Time", entry: "Employee" },
  { name: "Adverse Action Notice", data: "Date Action Completed", time: "Time", entry: "Employee" },
  { name: "Declines", data: "Date Action Completed", time: "Time", entry: "Employee" },
  { name: "Counteroffer", data: "Date Action Completed", time: "Time", entry: "Employee" },
  { name: "Conditioned", data: "Date Action Completed", time: "Time", entry: "Employee" },
  { name: "Co-Signer Sent", data: "Date Action Completed", time: "Time", entry: "Employee" },
  { name: "Credit Score Disclosure Notice", data: "", time: "Time", entry: "Employee" },
  { name: "Approvals", data: "Date Action Completed", time: "Time", entry: "Employee" },
  { name: "Declines", data: "Date Action Completed", time: "Time", entry: "Employee" },
  { name: "Counteroffer", data: "Date Action Completed", time: "Time", entry: "Employee" },
  { name: "Conditioned", data: "Date Action Completed", time: "Time", entry: "Employee" },
  { name: "Co-Signer Sent", data: "Date Action Completed", time: "Time", entry: "Employee" }
];

// Mock data for compliance checks based on Screenshot 1
export const mockComplianceChecks: ComplianceCheck[] = [
  { name: "Application Date", data: "Date Action Completed", time: "Time", entry: "Employee" },
  { name: "Credit Report Pull Date", data: "Date Action Completed", time: "Time", entry: "Employee" },
  { name: "Compliance Check (other)", data: "", time: "", entry: "" },
  { name: "OFAC", data: "", time: "", entry: "" },
  { name: "ID Verification", data: "", time: "", entry: "" },
  { name: "Out of Wallet", data: "", time: "", entry: "" },
  { name: "Customer Investigation Report", data: "", time: "", entry: "" },
  { name: "Comms", data: "", time: "", entry: "" },
  { name: "Request for More Information", data: "Date Action Completed", time: "Time", entry: "Employee" },
  { name: "What other comms are sent???", data: "Date Action Completed", time: "Time", entry: "Employee" }
];

// Example activity history items
export const mockActivityHistory: ActivityHistoryItem[] = [
  {
    actionName: "Application Submitted",
    userName: "John Smith",
    date: "05/15/2025",
    time: "10:30 AM"
  },
  {
    actionName: "Credit Check Performed",
    userName: "Jane Doe",
    date: "05/15/2025",
    time: "11:45 AM"
  },
  {
    actionName: "Document Upload",
    userName: "John Smith",
    date: "05/16/2025",
    time: "09:15 AM"
  },
  {
    actionName: "Conditional Approval",
    userName: "Sarah Johnson",
    date: "05/17/2025",
    time: "02:30 PM"
  }
];

// Example QC errors based on Screenshot 2
export const mockQCErrors: QCError[] = [
  {
    isError: true,
    isCritical: true,
    errorType: "Missing Documentation",
    date: "05/18/2025",
    errorBy: "John Smith",
    description: "Customer's proof of income document is missing required information.",
    processStep: "Document Verification",
    area: "Maker"
  },
  {
    isError: true,
    isCritical: false,
    errorType: "Incorrect Information",
    date: "05/19/2025",
    errorBy: "Jane Doe",
    description: "Minor discrepancy in reported income on application vs. documentation.",
    processStep: "Application Review",
    area: "Qcer"
  }
];

// Mock data for risk compliance
export const mockRiskComplianceData: RiskComplianceData = {
  requiredNotices: mockRequiredNotices,
  complianceChecks: mockComplianceChecks,
  activityHistory: mockActivityHistory,
  qcErrors: mockQCErrors
};
