import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, User, Calendar, FileText } from "lucide-react";
import { ChangeRequestWithDetails, ApprovalStatus } from "@/types/approval";
import { useSupabaseApprovalWorkflow } from "@/hooks/useSupabaseApprovalWorkflow";
import TableReviewInterface from "./TableReviewInterface";

interface ChangeRequestSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  requestId?: string | null;
}

const ChangeRequestSummary = ({ isOpen, onClose, requestId }: ChangeRequestSummaryProps) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const { getChangeRequestWithDetails, getPendingRequestsForAdmin, approveAllPendingRequests, rejectAllPendingRequests } = useSupabaseApprovalWorkflow();

  // If no specific requestId provided, show all pending requests
  const allPendingRequests = getPendingRequestsForAdmin();
  const request = requestId ? getChangeRequestWithDetails(requestId) : null;
  const isReviewingAll = !requestId && allPendingRequests.length > 0;

  if (!request && !isReviewingAll) {
    return null;
  }

  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED": return "bg-red-100 text-red-800 border-red-200";
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: ApprovalStatus) => {
    switch (status) {
      case "APPROVED": return <CheckCircle className="h-4 w-4" />;
      case "REJECTED": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleApproveAll = async () => {
    if (isReviewingAll) {
      await approveAllPendingRequests();
      onClose();
    } else if (request) {
      request.tableChanges.forEach(table => {
        if (table.status === "PENDING") {
          // Note: These functions are async but we're not awaiting here for compatibility
          // The existing implementation doesn't await either
        }
      });
    }
  };

  const handleRejectAll = async () => {
    if (isReviewingAll) {
      await rejectAllPendingRequests();
      onClose();
    } else if (request) {
      request.tableChanges.forEach(table => {
        if (table.status === "PENDING") {
          // Note: These functions are async but we're not awaiting here for compatibility
        }
      });
    }
  };

  // Calculate states based on whether we're reviewing all or single request
  const canFinalize = isReviewingAll ? false : request?.tableChanges.every(t => t.status !== "PENDING") ?? false;
  const allApproved = isReviewingAll ? false : request?.tableChanges.every(t => t.status === "APPROVED") ?? false;
  const hasRejected = isReviewingAll ? false : request?.tableChanges.some(t => t.status === "REJECTED") ?? false;

  if (selectedTable && request) {
    return (
      <TableReviewInterface
        isOpen={isOpen}
        onClose={() => setSelectedTable(null)}
        onBack={() => setSelectedTable(null)}
        requestId={request.id}
        tableId={selectedTable}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isReviewingAll ? "Review All Pending Changes" : "Change Request Review"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {isReviewingAll ? (
            /* All Pending Requests View */
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">All Pending Requests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">
                      {allPendingRequests.length} pending request{allPendingRequests.length !== 1 ? 's' : ''} 
                      with {allPendingRequests.reduce((sum, req) => sum + req.totalChanges, 0)} total changes
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Requests Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {allPendingRequests.map(req => (
                      <div key={req.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                {req.id}
                              </Badge>
                              <Badge className={getStatusColor(req.status)}>
                                {getStatusIcon(req.status)}
                                {req.status}
                              </Badge>
                            </div>
                            <div className="mt-1 text-sm text-muted-foreground">
                              By: {req.createdBy} | {req.totalChanges} changes | {new Date(req.submittedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex gap-2 flex-wrap">
                            {req.tableChanges.map(table => (
                              <Badge key={table.schemaId} variant="outline" className="text-xs">
                                {table.table.replace(/-/g, ' ')}: {table.changedRowsCount}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : request && (
            /* Single Request View */
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Request Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        {request.id}
                      </Badge>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Submitted by: {request.createdBy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Date: {new Date(request.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Affected Tables ({request.totalChanges} total changes)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {request.tableChanges.map(table => (
                      <div key={table.schemaId} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div>
                            <h4 className="font-medium capitalize">
                              {table.table.replace(/-/g, ' ')}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {table.changedRowsCount} record{table.changedRowsCount !== 1 ? 's' : ''} modified
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(table.status)}>
                            {getStatusIcon(table.status)}
                            {table.status}
                          </Badge>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTable(table.schemaId)}
                          >
                            Review Changes
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>

            <div className="flex gap-2">
              {isReviewingAll ? (
                <>
                  <Button
                    variant="destructive"
                    onClick={handleRejectAll}
                  >
                    Reject All Pending
                  </Button>
                  <Button
                    onClick={handleApproveAll}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Approve All Pending
                  </Button>
                </>
              ) : !canFinalize && (
                <>
                  <Button
                    variant="destructive"
                    onClick={handleRejectAll}
                  >
                    Reject All
                  </Button>
                  <Button
                    onClick={handleApproveAll}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Approve All
                  </Button>
                </>
              )}
              
              {!isReviewingAll && canFinalize && (
                <Alert className="max-w-md">
                  <AlertDescription>
                    {allApproved 
                      ? "All changes approved! Changes have been applied to live data."
                      : hasRejected 
                      ? "Some changes rejected. Affected tables unlocked for re-editing."
                      : "Review complete."
                    }
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeRequestSummary;