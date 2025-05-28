
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, FileText, Shield, CreditCard, Eye } from "lucide-react";

interface TasksSummaryProps {
  showMyTasksOnly?: boolean;
  currentUser?: string;
}

const TasksSummary: React.FC<TasksSummaryProps> = ({ showMyTasksOnly = false, currentUser = "" }) => {
  // Mock data - in a real app this would be filtered based on the user
  const getTaskCounts = () => {
    if (showMyTasksOnly) {
      return {
        pendingApplications: 8,
        contractsToRedraft: 3,
        ofacReview: 5,
        creditNotice: 2,
        reviewCopy: 6
      };
    }
    
    return {
      pendingApplications: 24,
      contractsToRedraft: 8,
      ofacReview: 12,
      creditNotice: 6,
      reviewCopy: 15
    };
  };

  const counts = getTaskCounts();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {showMyTasksOnly ? "My Pending Applications" : "Pending Applications"}
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{counts.pendingApplications}</div>
          <p className="text-xs text-muted-foreground">
            Applications awaiting review
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {showMyTasksOnly ? "My Contracts to Re-draft" : "Contracts to Re-draft"}
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{counts.contractsToRedraft}</div>
          <p className="text-xs text-muted-foreground">
            Contracts requiring revision
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {showMyTasksOnly ? "My OFAC Review Pending" : "OFAC Review Pending"}
          </CardTitle>
          <Shield className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{counts.ofacReview}</div>
          <p className="text-xs text-muted-foreground">
            Applications not OFAC reviewed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {showMyTasksOnly ? "My Credit Notice Pending" : "Credit Notice Pending"}
          </CardTitle>
          <CreditCard className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{counts.creditNotice}</div>
          <p className="text-xs text-muted-foreground">
            Credit score notices not sent
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {showMyTasksOnly ? "My Review Copy Needed" : "Review Copy Needed"}
          </CardTitle>
          <Eye className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{counts.reviewCopy}</div>
          <p className="text-xs text-muted-foreground">
            Applications need review copy
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksSummary;
