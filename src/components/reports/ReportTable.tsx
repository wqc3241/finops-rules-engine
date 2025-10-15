import { StandardReportRow } from '@/types/application/report';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface ReportTableProps {
  reports: StandardReportRow[];
  onViewReport: (reportId: string) => void;
  onDeleteReport?: (reportId: string) => void;
  isLoading?: boolean;
}

const ReportTable = ({ reports, onViewReport, onDeleteReport, isLoading }: ReportTableProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading reports...
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No reports found
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Report Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Generated Date</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Updated By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.title}</TableCell>
              <TableCell className="max-w-md truncate">
                {report.description || '-'}
              </TableCell>
              <TableCell>
                {format(new Date(report.generated_date), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                {report.created_by_profile?.email || '-'}
              </TableCell>
              <TableCell>
                {report.updated_by_profile?.email || '-'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewReport(report.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {onDeleteReport && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteReport(report.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportTable;
