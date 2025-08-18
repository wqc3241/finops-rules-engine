import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, AlertTriangle, FileText, ChevronDown, ChevronRight } from "lucide-react";
import { useChangeTracking } from "@/hooks/useChangeTracking";
import { useSupabaseApprovalWorkflow } from "@/hooks/useSupabaseApprovalWorkflow";
import DetailedChangeView from "./DetailedChangeView";

interface SubmitForReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const SubmitForReviewModal = ({ isOpen, onClose, onSubmit }: SubmitForReviewModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const { getChangesSummary, getTableChanges, trackedChanges } = useChangeTracking();
  const { submitForReview } = useSupabaseApprovalWorkflow();

  const changesSummary = getChangesSummary();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare table changes data
      const tableChanges: Record<string, { oldData: any[], newData: any[] }> = {};
      
      changesSummary.forEach(summary => {
        const changes = getTableChanges(summary.schemaId);
        if (changes) {
          tableChanges[summary.schemaId] = {
            oldData: changes.originalData,
            newData: changes.currentData
          };
        }
      });

      console.log('Submitting table changes:', tableChanges);
      const schemaIds = changesSummary.map(s => s.schemaId);
      const requestId = await submitForReview(schemaIds, tableChanges);
      
      if (requestId) {
        onSubmit();
        onClose();
      } else {
        setError('Failed to submit changes for review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting for review:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalChanges = changesSummary.reduce((sum, s) => sum + s.total, 0);

  const toggleTableExpansion = (schemaId: string) => {
    setExpandedTables(prev => {
      const newSet = new Set(prev);
      if (newSet.has(schemaId)) {
        newSet.delete(schemaId);
      } else {
        newSet.add(schemaId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedTables(new Set(changesSummary.map(s => s.schemaId)));
  };

  const collapseAll = () => {
    setExpandedTables(new Set());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Submit Changes for Review
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 pr-4">
            {changesSummary.length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No changes detected. Make some edits before submitting for review.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Ready to submit <strong>{totalChanges}</strong> changes across <strong>{changesSummary.length}</strong> table{changesSummary.length !== 1 ? 's' : ''} for admin approval.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Changes Summary:</h4>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={expandAll}
                        className="text-xs h-6 px-2"
                      >
                        Expand All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={collapseAll}
                        className="text-xs h-6 px-2"
                      >
                        Collapse All
                      </Button>
                    </div>
                  </div>

                  {changesSummary.map(summary => {
                    const tableChanges = getTableChanges(summary.schemaId);
                    const isExpanded = expandedTables.has(summary.schemaId);
                    
                    return (
                      <Collapsible
                        key={summary.schemaId}
                        open={isExpanded}
                        onOpenChange={() => toggleTableExpansion(summary.schemaId)}
                      >
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                            <div className="flex items-center gap-2">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="font-medium capitalize">
                                {summary.schemaId.replace(/-/g, ' ')}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              {summary.added > 0 && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  +{summary.added}
                                </Badge>
                              )}
                              {summary.modified > 0 && (
                                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                  ~{summary.modified}
                                </Badge>
                              )}
                              {summary.deleted > 0 && (
                                <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
                                  -{summary.deleted}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <div className="mt-2 ml-6 mr-2">
                            {tableChanges && (
                              <DetailedChangeView
                                schemaId={summary.schemaId}
                                originalData={tableChanges.originalData}
                                currentData={tableChanges.currentData}
                                primaryKey={trackedChanges[summary.schemaId]?.primaryKey}
                              />
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>

                <Alert className="border-warning bg-warning/5">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <AlertDescription className="text-sm">
                    Once submitted, these tables will be locked for editing until an admin approves or rejects the changes.
                  </AlertDescription>
                </Alert>

                {error && (
                  <Alert className="border-destructive bg-destructive/5">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-destructive">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={changesSummary.length === 0 || isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? "Submitting..." : "Submit for Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitForReviewModal;