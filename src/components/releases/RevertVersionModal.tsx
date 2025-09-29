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
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle } from 'lucide-react';
import { DeploymentVersion } from '@/types/deployment';
import { formatVersionNumber } from '@/utils/deploymentUtils';
import { formatDistanceToNow } from 'date-fns';

interface RevertVersionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  targetVersion: DeploymentVersion | null;
  currentVersion: DeploymentVersion | null;
  isLoading?: boolean;
}

const RevertVersionModal = ({
  open,
  onOpenChange,
  onConfirm,
  targetVersion,
  currentVersion,
  isLoading = false
}: RevertVersionModalProps) => {
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (reason.trim() && confirmed) {
      onConfirm(reason);
      setReason('');
      setConfirmed(false);
    }
  };

  const canConfirm = reason.trim().length > 0 && confirmed && !isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Revert to Previous Version
          </DialogTitle>
          <DialogDescription>
            <strong className="text-destructive">Warning:</strong> This action will rollback your production data to a previous state.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Version:</span>
              <span className="font-mono font-medium">
                {currentVersion ? formatVersionNumber(currentVersion.version_number) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Target Version:</span>
              <span className="font-mono font-medium">
                {targetVersion ? formatVersionNumber(targetVersion.version_number) : 'N/A'}
              </span>
            </div>
            {targetVersion && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time Difference:</span>
                <span className="text-muted-foreground">
                  {formatDistanceToNow(new Date(targetVersion.deployed_at), { addSuffix: true })}
                </span>
              </div>
            )}
            {targetVersion?.snapshot_metadata && (
              <div className="border-t pt-2 mt-2">
                <p className="text-xs text-muted-foreground mb-2">Affected Tables:</p>
                <div className="space-y-1">
                  {Object.entries(targetVersion.snapshot_metadata.tables || {}).map(([table, count]) => (
                    <div key={table} className="flex justify-between text-xs">
                      <span className="font-mono">{table}</span>
                      <span className="text-muted-foreground">{count} changes</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-destructive">
              Reason for Rollback (Required) *
            </Label>
            <Textarea
              id="reason"
              placeholder="Explain why you need to revert to this version..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="border-destructive/50"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirm"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked as boolean)}
            />
            <label
              htmlFor="confirm"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I understand this will revert data changes and may cause data loss
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!canConfirm}
          >
            {isLoading ? 'Reverting...' : 'Revert to This Version'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RevertVersionModal;
