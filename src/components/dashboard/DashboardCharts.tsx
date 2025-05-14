
import { mockChartData } from "@/data/mock/reports";
import StatusChart from "./charts/StatusChart";
import ApplicationTypeChart from "./charts/ApplicationTypeChart";
import ApprovalRatesChart from "./charts/ApprovalRatesChart";
import TimelineChart from "./charts/TimelineChart";
import FinancialMetricsChart from "./charts/FinancialMetricsChart";
import StatusTransitionChart from "./charts/StatusTransitionChart";

const DashboardCharts = () => {
  // Get all charts from our mock data
  const statusChart = mockChartData.find(chart => chart.id === 'status-distribution-pie');
  const applicationTypeChart = mockChartData.find(chart => chart.id === 'application-type-pie');
  const approvalRatesChart = mockChartData.find(chart => chart.id === 'application-approval-rates');
  const timelineChart = mockChartData.find(chart => chart.id === 'applications-over-time');
  const financialMetricsChart = mockChartData.find(chart => chart.id === 'financial-metrics-bar');
  const statusTransitionChart = mockChartData.find(chart => chart.id === 'status-transition-times');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {statusChart && <StatusChart data={statusChart.data} />}
      {applicationTypeChart && <ApplicationTypeChart data={applicationTypeChart.data} />}
      {approvalRatesChart && <ApprovalRatesChart data={approvalRatesChart.data} />}
      {timelineChart && <TimelineChart data={timelineChart.data} />}
      {financialMetricsChart && <FinancialMetricsChart data={financialMetricsChart.data} />}
      {statusTransitionChart && <StatusTransitionChart data={statusTransitionChart.data} />}
    </div>
  );
};

export default DashboardCharts;
