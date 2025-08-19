import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, User, Calendar, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { ChangeRequestWithDetails, ApprovalStatus } from "@/types/approval";
import { useSupabaseApprovalWorkflow } from "@/hooks/useSupabaseApprovalWorkflow";
import TableReviewInterface from "./TableReviewInterface";
import DetailedChangeView from "./DetailedChangeView";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ChangeRequestSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  requestId?: string | null;
}

const ChangeRequestSummary = ({ isOpen, onClose, requestId }: ChangeRequestSummaryProps) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const { getChangeRequestWithDetails, getPendingRequestsForAdmin, approveAllPendingRequests, rejectAllPendingRequests } = useSupabaseApprovalWorkflow();

  const toggleTableExpansion = (tableKey: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableKey)) {
      newExpanded.delete(tableKey);
    } else {
      newExpanded.add(tableKey);
    }
    setExpandedTables(newExpanded);
  };

  const expandAll = () => {
    if (isReviewingAll) {
      const allTableKeys = allPendingRequests.flatMap(req => 
        req.tableChanges.map(table => `${req.id}-${table.schemaId}`)
      );
      setExpandedTables(new Set(allTableKeys));
    }
  };

  const collapseAll = () => {
    setExpandedTables(new Set());
  };

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
                  <CardTitle className="text-lg flex items-center justify-between">
                    Changes Summary:
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={expandAll}>
                        Expand All
                      </Button>
                      <Button variant="outline" size="sm" onClick={collapseAll}>
                        Collapse All
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                        Refresh
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allPendingRequests.map(req => 
                      req.tableChanges.map(table => {
                        const tableKey = `${req.id}-${table.schemaId}`;
                        const isExpanded = expandedTables.has(tableKey);
                        const detailRequest = getChangeRequestWithDetails(req.id);
                        const tableDetail = detailRequest?.tableChanges.find(t => t.schemaId === table.schemaId);
                        
                        return (
                          <Collapsible key={tableKey} open={isExpanded} onOpenChange={() => toggleTableExpansion(tableKey)}>
                            <Card className="border">
                              <CollapsibleTrigger asChild>
                                <CardHeader className="cursor-pointer hover:bg-muted/50 pb-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      {isExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronUp className="h-4 w-4" />
                                      )}
                                      <div>
                                        <CardTitle className="text-base capitalize">
                                          {table.table.replace(/-/g, ' ')}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                          Request: {req.id.split('-')[0]}...
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        ~{table.changedRowsCount}
                                      </Badge>
                                      <Badge className={getStatusColor(table.status)}>
                                        {getStatusIcon(table.status)}
                                        {table.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </CardHeader>
                              </CollapsibleTrigger>
                              
                              <CollapsibleContent>
                                <CardContent className="pt-0">
                                  {tableDetail && tableDetail.changes && tableDetail.changes.length > 0 ? (
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                          Modified Records ({tableDetail.changes.length})
                                        </Badge>
                                      </div>
                                      
                                      <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                          <thead>
                                            <tr className="border-b">
                                              <th className="text-left p-2 text-sm font-medium">Rule Key</th>
                                              <th className="text-left p-2 text-sm font-medium">Before</th>
                                              <th className="text-left p-2 text-sm font-medium">After</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {tableDetail.changes.map((change, idx) => (
                                              <tr key={idx} className="border-b hover:bg-muted/50">
                                                <td className="p-2 font-mono text-sm">
                                                  {change.ruleKey}
                                                </td>
                                                <td className="p-2">
                                                  <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-mono max-w-xs">
                                                    {change.oldValue === null ? 'null' : JSON.stringify(change.oldValue)}
                                                  </div>
                                                </td>
                                                <td className="p-2">
                                                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono max-w-xs">
                                                    {change.newValue === null ? 'null' : JSON.stringify(change.newValue)}
                                                  </div>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-sm text-muted-foreground p-4 text-center">
                                      No detailed changes available for this table
                                    </div>
                                  )}
                                </CardContent>
                              </CollapsibleContent>
                            </Card>
                          </Collapsible>
                        );
                      })
                    )}
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