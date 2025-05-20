
import { Report, StatusReportData, ApplicationTypeReportData, TimelineReportData, FinancialReportData } from "@/types/application/report";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BarChart } from "lucide-react";

interface ReportCardProps {
  report: Report;
  onViewReport: (reportId: string) => void;
}

const ReportCard = ({ report, onViewReport }: ReportCardProps) => {
  // Helper functions to safely access data based on report type
  const getStatusData = (): StatusReportData | undefined => 
    report.type === 'status' ? report.data as StatusReportData : undefined;
  
  const getApplicationTypeData = (): ApplicationTypeReportData | undefined => 
    report.type === 'application' ? report.data as ApplicationTypeReportData : undefined;
  
  const getTimelineData = (): TimelineReportData | undefined => 
    report.type === 'timeline' ? report.data as TimelineReportData : undefined;
  
  const getFinancialData = (): FinancialReportData | undefined => 
    report.type === 'financial' ? report.data as FinancialReportData : undefined;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {report.title}
        </CardTitle>
        <CardDescription className="text-xs">{report.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        <div className="text-xs text-muted-foreground">
          Generated: {new Date(report.generatedDate).toLocaleDateString()}
        </div>
        
        {report.type === 'status' && getStatusData() && (
          <div className="mt-2 text-xs">
            <div>Total Applications: {getStatusData()?.totalApplications}</div>
            <div>Most Common Status: {getStatusData()?.statusDistribution[0]?.status}</div>
          </div>
        )}
        
        {report.type === 'application' && getApplicationTypeData() && (
          <div className="mt-2 text-xs">
            <div>Total Applications: {getApplicationTypeData()?.totalApplications}</div>
            <div>Types: {getApplicationTypeData()?.typeDistribution.map(t => t.type).join(', ')}</div>
          </div>
        )}
        
        {report.type === 'timeline' && getTimelineData() && (
          <div className="mt-2 text-xs">
            <div>Avg. Processing Time: {getTimelineData()?.averageProcessingTime} days</div>
          </div>
        )}
        
        {report.type === 'financial' && getFinancialData() && (
          <div className="mt-2 text-xs">
            <div>Avg. Monthly Payment: ${getFinancialData()?.averageMonthlyPayment}</div>
            <div>Avg. Term Length: {getFinancialData()?.averageTermLength} months</div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs" 
          onClick={() => onViewReport(report.id)}
        >
          <BarChart className="h-3 w-3 mr-1" />
          View Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportCard;
