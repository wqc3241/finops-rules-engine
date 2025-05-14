
import { Application } from "@/types/application";
import { Report, StatusReportData, ApplicationTypeReportData, TimelineReportData, FinancialReportData } from "@/types/application/report";

// Helper function to calculate percentages
const calculatePercentage = (value: number, total: number): number => {
  return parseFloat(((value / total) * 100).toFixed(2));
};

// Generate Status Distribution Report
export const generateStatusReport = (applications: Application[]): Report => {
  const totalApplications = applications.length;
  const statusCounts: Record<string, number> = {};
  
  // Count applications by status
  applications.forEach(app => {
    statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
  });
  
  // Calculate distribution percentages
  const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    percentage: calculatePercentage(count, totalApplications)
  }));
  
  // Sort by count descending
  statusDistribution.sort((a, b) => b.count - a.count);
  
  const reportData: StatusReportData = {
    totalApplications,
    statusDistribution
  };
  
  return {
    id: 'status-distribution-report',
    title: 'Application Status Distribution',
    description: 'Distribution of applications by their current status',
    type: 'status',
    generatedDate: new Date().toISOString(),
    filters: [],
    data: reportData
  };
};

// Generate Application Type Analysis Report
export const generateApplicationTypeReport = (applications: Application[]): Report => {
  const totalApplications = applications.length;
  const typeCounts: Record<string, number> = {};
  const typeApprovedCounts: Record<string, number> = {};
  const typeTotalCounts: Record<string, number> = {};
  
  // Count applications by type and approval status
  applications.forEach(app => {
    typeCounts[app.type] = (typeCounts[app.type] || 0) + 1;
    typeTotalCounts[app.type] = (typeTotalCounts[app.type] || 0) + 1;
    
    if (app.status === 'Approved' || app.status === 'Funded' || app.status === 'Booked') {
      typeApprovedCounts[app.type] = (typeApprovedCounts[app.type] || 0) + 1;
    }
  });
  
  // Calculate type distribution
  const typeDistribution = Object.entries(typeCounts).map(([type, count]) => ({
    type,
    count,
    percentage: calculatePercentage(count, totalApplications)
  }));
  
  // Calculate approval rates by type
  const approvalRates = Object.keys(typeTotalCounts).map(type => ({
    type,
    approved: typeApprovedCounts[type] || 0,
    total: typeTotalCounts[type],
    rate: calculatePercentage(typeApprovedCounts[type] || 0, typeTotalCounts[type])
  }));
  
  const reportData: ApplicationTypeReportData = {
    totalApplications,
    typeDistribution,
    approvalRates
  };
  
  return {
    id: 'application-type-report',
    title: 'Application Type Analysis',
    description: 'Analysis of application types and their approval rates',
    type: 'application',
    generatedDate: new Date().toISOString(),
    filters: [],
    data: reportData
  };
};

// Generate Timeline Performance Report
export const generateTimelineReport = (applications: Application[]): Report => {
  // For demo purposes, we'll create simulated timeline data based on application dates
  // In a real application, this would use actual timeline data from the system
  
  // Group applications by date
  const appByDate: Record<string, number> = {};
  applications.forEach(app => {
    const date = app.date;
    appByDate[date] = (appByDate[date] || 0) + 1;
  });
  
  // Create applications over time data
  const applicationsOverTime = Object.entries(appByDate)
    .map(([date, count]) => ({
      date,
      count
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Create simulated status transition times
  const statusTransitionTimes = [
    { status: 'Pending', averageDays: 1.5 },
    { status: 'Submitted', averageDays: 2.2 },
    { status: 'Conditionally Approved', averageDays: 3.0 },
    { status: 'Approved', averageDays: 4.5 },
    { status: 'Pending Signature', averageDays: 2.0 },
    { status: 'Booked', averageDays: 1.0 },
    { status: 'Funded', averageDays: 1.8 }
  ];
  
  const reportData: TimelineReportData = {
    averageProcessingTime: 10.5, // Example average time from submission to funding
    statusTransitionTimes,
    applicationsOverTime
  };
  
  return {
    id: 'timeline-performance-report',
    title: 'Application Timeline Performance',
    description: 'Analysis of application processing times and volume over time',
    type: 'timeline',
    generatedDate: new Date().toISOString(),
    filters: [],
    data: reportData
  };
};

// Generate Financial Metrics Report
export const generateFinancialReport = (_applications: Application[]): Report => {
  // For the financial report, we would normally extract data from applications
  // but our mock data doesn't contain detailed financial information
  // So we'll create example data
  
  const reportData: FinancialReportData = {
    averageDownPayment: 8500,
    averageTermLength: 48,
    averageMonthlyPayment: 725,
    averageRates: [
      { type: 'Loan', rate: 5.6 }, // APR for loans
      { type: 'Lease', rate: 0.0018 } // Money factor for leases
    ]
  };
  
  return {
    id: 'financial-metrics-report',
    title: 'Financial Performance Metrics',
    description: 'Average financial terms and metrics across all applications',
    type: 'financial',
    generatedDate: new Date().toISOString(),
    filters: [],
    data: reportData
  };
};

// Generate all reports
export const generateAllReports = (applications: Application[]): Report[] => {
  return [
    generateStatusReport(applications),
    generateApplicationTypeReport(applications),
    generateTimelineReport(applications),
    generateFinancialReport(applications)
  ];
};
