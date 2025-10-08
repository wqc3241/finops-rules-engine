import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, FileText, Calendar, User } from "lucide-react";
import { useSupabaseApprovalWorkflow } from "@/hooks/useSupabaseApprovalWorkflow";
import { ApprovalStatus } from "@/types/approval";

interface ChangeRequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string | null;
}

const ChangeRequestDetailsModal = ({ isOpen, onClose, requestId }: ChangeRequestDetailsModalProps) => {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const { getChangeRequestWithDetails } = useSupabaseApprovalWorkflow();

  const request = requestId ? getChangeRequestWithDetails(requestId) : null;

  useEffect(() => {
    if (isOpen && request) {
      // Auto-expand first table when modal opens
      if (request.tableChanges.length > 0) {
        setExpandedTables(new Set([request.tableChanges[0].schemaId]));
      }
    }
  }, [isOpen, request]);

  const toggleTableExpansion = (tableId: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableId)) {
      newExpanded.delete(tableId);
    } else {
      newExpanded.add(tableId);
    }
    setExpandedTables(newExpanded);
  };

  const expandAll = () => {
    if (request) {
      setExpandedTables(new Set(request.tableChanges.map(t => t.schemaId)));
    }
  };

  const collapseAll = () => {
    setExpandedTables(new Set());
  };

  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED": return "bg-red-100 text-red-800 border-red-200";
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "IN_REVIEW": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!request) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Change Request Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Request Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">Request ID:</span>{" "}
                    <span className="font-mono text-xs">{request.id.split('-')[0]}...</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">Submitted:</span>{" "}
                    {new Date(request.submittedAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge className={getStatusColor(request.status)}>
                  {request.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {request.totalChanges} total change{request.totalChanges !== 1 ? 's' : ''} across {request.tableChanges.length} table{request.tableChanges.length !== 1 ? 's' : ''}
                </span>
              </div>
              {request.comment && (
                <div className="pt-2 border-t">
                  <span className="text-sm font-medium">Comment:</span>
                  <p className="text-sm text-muted-foreground mt-1">{request.comment}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Changes by Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Affected Tables & Changes
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={expandAll}>
                    Expand All
                  </Button>
                  <Button variant="outline" size="sm" onClick={collapseAll}>
                    Collapse All
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {request.tableChanges.map((table) => {
                  const isExpanded = expandedTables.has(table.schemaId);
                  
                  return (
                    <Collapsible 
                      key={table.schemaId} 
                      open={isExpanded} 
                      onOpenChange={() => toggleTableExpansion(table.schemaId)}
                    >
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
                                    {table.table.replace(/_/g, ' ').replace(/-/g, ' ')}
                                  </CardTitle>
                                  <p className="text-sm text-muted-foreground">
                                    {table.changedRowsCount} record{table.changedRowsCount !== 1 ? 's' : ''} changed
                                  </p>
                                </div>
                              </div>
                              <Badge className={getStatusColor(table.status)}>
                                {table.status}
                              </Badge>
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            {table.changes && table.changes.length > 0 ? (
                              <div className="space-y-3">
                                {table.changes.map((change, idx) => {
                                  const oldRecord = change.oldValue ? 
                                    (typeof change.oldValue === 'string' ? JSON.parse(change.oldValue) : change.oldValue) : 
                                    null;
                                  const newRecord = change.newValue ? 
                                    (typeof change.newValue === 'string' ? JSON.parse(change.newValue) : change.newValue) : 
                                    null;
                                  
                                  // Determine change type
                                  let changeType: 'added' | 'modified' | 'deleted' = 'modified';
                                  if (!oldRecord && newRecord) changeType = 'added';
                                  else if (oldRecord && !newRecord) changeType = 'deleted';
                                  
                                  const typeConfig = {
                                    added: {
                                      bgColor: 'bg-green-50',
                                      borderColor: 'border-green-200',
                                      textColor: 'text-green-800',
                                      label: 'New Record'
                                    },
                                    modified: {
                                      bgColor: 'bg-blue-50',
                                      borderColor: 'border-blue-200',
                                      textColor: 'text-blue-800',
                                      label: 'Modified Record'
                                    },
                                    deleted: {
                                      bgColor: 'bg-red-50',
                                      borderColor: 'border-red-200',
                                      textColor: 'text-red-800',
                                      label: 'Deleted Record'
                                    }
                                  };
                                  
                                  const config = typeConfig[changeType];
                                  
                                  // Get all fields from both records
                                  const allFields = new Set([
                                    ...Object.keys(oldRecord || {}), 
                                    ...Object.keys(newRecord || {})
                                  ]);
                                  const fields = Array.from(allFields).sort();
                                  
                                  return (
                                    <div key={idx} className={`border rounded-lg overflow-hidden ${config.borderColor}`}>
                                      <div className={`${config.bgColor} p-2 flex items-center justify-between`}>
                                        <span className="font-mono text-sm font-medium">{change.ruleKey}</span>
                                        <Badge variant="outline" className={config.textColor}>
                                          {config.label}
                                        </Badge>
                                      </div>
                                      
                                      <div className="overflow-x-auto">
                                        <table className="w-full">
                                          <thead>
                                            <tr className="border-b bg-muted/30">
                                              {fields.map(field => (
                                                <th key={field} className="text-left p-2 text-xs font-medium border-r last:border-r-0">
                                                  {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </th>
                                              ))}
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              {fields.map(field => {
                                                const oldValue = oldRecord?.[field];
                                                const newValue = newRecord?.[field];
                                                const hasChanged = JSON.stringify(oldValue) !== JSON.stringify(newValue);
                                                
                                                return (
                                                  <td key={field} className="p-2 border-r last:border-r-0 align-top">
                                                    {changeType === 'modified' && hasChanged ? (
                                                      <div className="space-y-1">
                                                        <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-mono">
                                                          {oldValue === null || oldValue === undefined ? 'null' : String(oldValue)}
                                                        </div>
                                                        <div className="text-center text-muted-foreground text-xs">↓</div>
                                                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono">
                                                          {newValue === null || newValue === undefined ? 'null' : String(newValue)}
                                                        </div>
                                                      </div>
                                                    ) : (
                                                      <div className="text-xs font-mono text-muted-foreground">
                                                        {(newValue ?? oldValue) === null || (newValue ?? oldValue) === undefined 
                                                          ? 'null' 
                                                          : String(newValue ?? oldValue)}
                                                      </div>
                                                    )}
                                                  </td>
                                                );
                                              })}
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  );
                                })}
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
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeRequestDetailsModal;
