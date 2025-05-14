
import { Report } from "@/types/application/report";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BarChart } from "lucide-react";

interface ReportCardProps {
  report: Report;
  onViewReport: (reportId: string) => void;
}

const ReportCard = ({ report, onViewReport }: ReportCardProps) => {
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
        
        {report.type === 'status' && (
          <div className="mt-2 text-xs">
            <div>Total Applications: {report.data.totalApplications}</div>
            <div>Most Common Status: {report.data.statusDistribution[0]?.status}</div>
          </div>
        )}
        
        {report.type === 'application' && (
          <div className="mt-2 text-xs">
            <div>Total Applications: {report.data.totalApplications}</div>
            <div>Types: {report.data.typeDistribution.map((t: any) => t.type).join(', ')}</div>
          </div>
        )}
        
        {report.type === 'timeline' && (
          <div className="mt-2 text-xs">
            <div>Avg. Processing Time: {report.data.averageProcessingTime} days</div>
          </div>
        )}
        
        {report.type === 'financial' && (
          <div className="mt-2 text-xs">
            <div>Avg. Monthly Payment: ${report.data.averageMonthlyPayment}</div>
            <div>Avg. Term Length: {report.data.averageTermLength} months</div>
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
