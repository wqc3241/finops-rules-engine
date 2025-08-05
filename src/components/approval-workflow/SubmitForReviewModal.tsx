import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, FileText } from "lucide-react";
import { useChangeTracking } from "@/hooks/useChangeTracking";
import { useApprovalWorkflow } from "@/hooks/useApprovalWorkflow";

interface SubmitForReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const SubmitForReviewModal = ({ isOpen, onClose, onSubmit }: SubmitForReviewModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getChangesSummary, getTableChanges, trackedChanges } = useChangeTracking();
  const { submitForReview } = useApprovalWorkflow();

  const changesSummary = getChangesSummary();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
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

      const schemaIds = changesSummary.map(s => s.schemaId);
      const requestId = submitForReview(schemaIds, tableChanges);
      
      if (requestId) {
        onSubmit();
        onClose();
      }
    } catch (error) {
      console.error('Error submitting for review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalChanges = changesSummary.reduce((sum, s) => sum + s.total, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Submit Changes for Review
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Changes Summary:</h4>
                {changesSummary.map(summary => (
                  <div key={summary.schemaId} className="flex items-center justify-between p-2 border rounded-lg">
                    <span className="font-medium capitalize">
                      {summary.schemaId.replace(/-/g, ' ')}
                    </span>
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
                ))}
              </div>

              <Alert className="border-warning bg-warning/5">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-sm">
                  Once submitted, these tables will be locked for editing until an admin approves or rejects the changes.
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>

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