
import { Report } from "@/types/application/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusReportData, ApplicationTypeReportData, TimelineReportData, FinancialReportData } from "@/types/application/report";
import { toast } from "@/components/ui/use-toast";

interface ReportDetailProps {
  report: Report;
  onBack: () => void;
}

const ReportDetail = ({ report, onBack }: ReportDetailProps) => {
  const handleDownload = () => {
    toast({
      title: "Download initiated",
      description: `${report.title} is being downloaded as a CSV file.`,
      duration: 3000,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Reports
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-1" />
          Download CSV
        </Button>
      </div>
      
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-lg">{report.title}</CardTitle>
          <div className="text-sm text-muted-foreground">{report.description}</div>
          <div className="text-xs text-muted-foreground">
            Generated: {new Date(report.generatedDate).toLocaleDateString()}
          </div>
        </CardHeader>
        <CardContent className="p-3">
          {report.type === 'status' && <StatusReportContent data={report.data as StatusReportData} />}
          {report.type === 'application' && <ApplicationTypeReportContent data={report.data as ApplicationTypeReportData} />}
          {report.type === 'timeline' && <TimelineReportContent data={report.data as TimelineReportData} />}
          {report.type === 'financial' && <FinancialReportContent data={report.data as FinancialReportData} />}
        </CardContent>
      </Card>
    </div>
  );
};

const StatusReportContent = ({ data }: { data: StatusReportData }) => (
  <div>
    <div className="mb-2">
      <strong className="text-sm">Total Applications:</strong> {data.totalApplications}
    </div>
    
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Count</TableHead>
          <TableHead>Percentage</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.statusDistribution.map((item) => (
          <TableRow key={item.status}>
            <TableCell>{item.status}</TableCell>
            <TableCell>{item.count}</TableCell>
            <TableCell>{item.percentage}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const ApplicationTypeReportContent = ({ data }: { data: ApplicationTypeReportData }) => (
  <div className="space-y-3">
    <div>
      <div className="mb-2">
        <strong className="text-sm">Total Applications:</strong> {data.totalApplications}
      </div>
      
      <div className="mb-2 text-sm font-medium">Type Distribution:</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Percentage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.typeDistribution.map((item) => (
            <TableRow key={item.type}>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.count}</TableCell>
              <TableCell>{item.percentage}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    
    <div>
      <div className="mb-2 text-sm font-medium">Approval Rates:</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Approved</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Approval Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.approvalRates.map((item) => (
            <TableRow key={item.type}>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.approved}</TableCell>
              <TableCell>{item.total}</TableCell>
              <TableCell>{item.rate}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

const TimelineReportContent = ({ data }: { data: TimelineReportData }) => (
  <div className="space-y-3">
    <div>
      <div className="mb-2">
        <strong className="text-sm">Average Processing Time:</strong> {data.averageProcessingTime} days
      </div>
      
      <div className="mb-2 text-sm font-medium">Status Transition Times:</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Average Days</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.statusTransitionTimes.map((item) => (
            <TableRow key={item.status}>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.averageDays}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    
    <div>
      <div className="mb-2 text-sm font-medium">Applications Over Time:</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Application Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.applicationsOverTime.map((item) => (
            <TableRow key={item.date}>
              <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
              <TableCell>{item.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

const FinancialReportContent = ({ data }: { data: FinancialReportData }) => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-2">
      <div className="p-2 border rounded">
        <div className="text-xs text-muted-foreground">Average Down Payment</div>
        <div className="text-lg font-semibold">${data.averageDownPayment.toLocaleString()}</div>
      </div>
      <div className="p-2 border rounded">
        <div className="text-xs text-muted-foreground">Average Term Length</div>
        <div className="text-lg font-semibold">{data.averageTermLength} months</div>
      </div>
      <div className="p-2 border rounded">
        <div className="text-xs text-muted-foreground">Average Monthly Payment</div>
        <div className="text-lg font-semibold">${data.averageMonthlyPayment}</div>
      </div>
    </div>
    
    <div>
      <div className="mb-2 text-sm font-medium">Average Rates:</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.averageRates.map((item) => (
            <TableRow key={item.type}>
              <TableCell>{item.type}</TableCell>
              <TableCell>
                {item.type === 'Loan' ? `${item.rate}% APR` : `${item.rate} MF`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export default ReportDetail;
