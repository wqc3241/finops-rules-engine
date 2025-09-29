import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface DeployNowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (notes?: string) => void;
  changeRequestIds: string[];
  summary: {
    totalChanges: number;
    tables: Record<string, number>;
  };
  isLoading?: boolean;
}

const DeployNowModal = ({
  open,
  onOpenChange,
  onConfirm,
  changeRequestIds,
  summary,
  isLoading = false
}: DeployNowModalProps) => {
  const [notes, setNotes] = useState('');

  const handleConfirm = () => {
    onConfirm(notes || undefined);
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Deploy Changes to Production
          </DialogTitle>
          <DialogDescription>
            This action will immediately deploy the selected changes to production.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Change Requests:</span>
              <span className="font-medium">{changeRequestIds.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Changes:</span>
              <span className="font-medium">{summary.totalChanges}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <p className="text-xs text-muted-foreground mb-2">Affected Tables:</p>
              <div className="space-y-1">
                {Object.entries(summary.tables).map(([table, count]) => (
                  <div key={table} className="flex justify-between text-xs">
                    <span className="font-mono">{table}</span>
                    <span className="text-muted-foreground">{count} changes</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Deployment Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add notes about this deployment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? 'Deploying...' : 'Deploy Now'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeployNowModal;
