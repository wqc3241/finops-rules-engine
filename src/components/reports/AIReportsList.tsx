import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye, Calendar, Bot } from 'lucide-react';
import { useAIGeneratedReports, useDeleteAIReport } from '@/hooks/useAIReports';
import { formatDistanceToNow } from 'date-fns';

interface AIReportsListProps {
  onViewReport: (reportId: string) => void;
}

const AIReportsList: React.FC<AIReportsListProps> = ({ onViewReport }) => {
  const { data: aiReports, isLoading } = useAIGeneratedReports();
  const deleteReport = useDeleteAIReport();

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">Loading AI-generated reports...</p>
      </div>
    );
  }

  if (!aiReports || aiReports.length === 0) {
    return (
      <div className="p-4 text-center">
        <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">No AI-generated reports yet</p>
        <p className="text-xs text-muted-foreground">
          Use the AI Assistant to generate reports using natural language
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {aiReports.map((report) => (
        <Card key={report.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg line-clamp-2">{report.title}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <Bot className="h-3 w-3 mr-1" />
                    AI Generated
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {report.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {report.description}
              </p>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
              </span>
            </div>

            {report.report_data && (
              <div className="text-xs space-y-1">
                <p>Total Applications: <span className="font-medium">{report.report_data.totalApplications}</span></p>
                {report.report_data.summary?.averageAmount && (
                  <p>Average Amount: <span className="font-medium">${report.report_data.summary.averageAmount.toLocaleString()}</span></p>
                )}
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewReport(report.id)}
                className="flex-1 mr-2"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Report
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteReport.mutate(report.id)}
                disabled={deleteReport.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AIReportsList;