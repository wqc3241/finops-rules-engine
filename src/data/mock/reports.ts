
import { Application, Report } from "@/types/application";
import { applications } from "./mock/applicationsData";
import { generateAllReports } from "@/utils/reportUtils";

// Generate all reports using our mock application data
export const mockReports: Report[] = generateAllReports(applications);

// Function to get a report by ID
export const getReportById = (id: string): Report | undefined => {
  return mockReports.find(report => report.id === id);
};

// Function to get reports by type
export const getReportsByType = (type: Report['type']): Report[] => {
  return mockReports.filter(report => report.type === type);
};

// Helper function for generating mock chart data
export const generateChartData = (reports: Report[]) => {
  const chartData = [];
  
  // Generate chart data for status distribution report
  const statusReport = reports.find(r => r.id === 'status-distribution-report');
  if (statusReport) {
    chartData.push({
      id: 'status-distribution-pie',
      title: 'Application Status Distribution',
      type: 'pie',
      reportId: statusReport.id,
      data: statusReport.data.statusDistribution.map((item: any) => ({
        name: item.status,
        value: item.count
      }))
    });
    
    chartData.push({
      id: 'status-distribution-bar',
      title: 'Application Status Counts',
      type: 'bar',
      reportId: statusReport.id,
      data: statusReport.data.statusDistribution.map((item: any) => ({
        name: item.status,
        value: item.count
      }))
    });
  }
  
  // Generate chart data for application type report
  const typeReport = reports.find(r => r.id === 'application-type-report');
  if (typeReport) {
    chartData.push({
      id: 'application-type-pie',
      title: 'Lease vs. Loan Distribution',
      type: 'pie',
      reportId: typeReport.id,
      data: typeReport.data.typeDistribution.map((item: any) => ({
        name: item.type,
        value: item.count
      }))
    });
    
    chartData.push({
      id: 'application-approval-rates',
      title: 'Approval Rates by Type',
      type: 'bar',
      reportId: typeReport.id,
      data: typeReport.data.approvalRates.map((item: any) => ({
        name: item.type,
        value: item.rate
      }))
    });
  }
  
  // Generate chart data for timeline report
  const timelineReport = reports.find(r => r.id === 'timeline-performance-report');
  if (timelineReport) {
    chartData.push({
      id: 'applications-over-time',
      title: 'Applications Over Time',
      type: 'line',
      reportId: timelineReport.id,
      data: timelineReport.data.applicationsOverTime
    });
    
    chartData.push({
      id: 'status-transition-times',
      title: 'Average Days in Each Status',
      type: 'bar',
      reportId: timelineReport.id,
      data: timelineReport.data.statusTransitionTimes
    });
  }
  
  // Generate chart data for financial report
  const financialReport = reports.find(r => r.id === 'financial-metrics-report');
  if (financialReport) {
    chartData.push({
      id: 'financial-metrics-bar',
      title: 'Financial Metrics',
      type: 'bar',
      reportId: financialReport.id,
      data: [
        { name: 'Avg. Down Payment', value: financialReport.data.averageDownPayment },
        { name: 'Avg. Monthly Payment', value: financialReport.data.averageMonthlyPayment }
      ]
    });
  }
  
  return chartData;
};

// Generate mock chart data
export const mockChartData = generateChartData(mockReports);

// Function to get chart data by ID
export const getChartById = (id: string) => {
  return mockChartData.find(chart => chart.id === id);
};

// Function to get all chart data
export const getAllChartData = () => {
  return mockChartData;
};
