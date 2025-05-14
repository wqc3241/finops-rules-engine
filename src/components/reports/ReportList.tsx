
import { Report } from "@/types/application/report";
import ReportCard from "./ReportCard";

interface ReportListProps {
  reports: Report[];
  onViewReport: (reportId: string) => void;
}

const ReportList = ({ reports, onViewReport }: ReportListProps) => {
  if (reports.length === 0) {
    return (
      <div className="p-3 text-center text-sm text-muted-foreground">
        No reports found
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {reports.map(report => (
        <ReportCard 
          key={report.id} 
          report={report} 
          onViewReport={onViewReport} 
        />
      ))}
    </div>
  );
};

export default ReportList;
