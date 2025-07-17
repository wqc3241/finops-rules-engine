import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DealStructureItem } from '@/types/application';
import { Clock, RotateCcw } from 'lucide-react';

export interface DealVersion {
  id: string;
  timestamp: Date;
  items: DealStructureItem[];
  description: string;
}

interface DealVersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  versions: DealVersion[];
  onRestoreVersion: (version: DealVersion) => void;
  applicationType?: 'Lease' | 'Loan';
}

const DealVersionHistory: React.FC<DealVersionHistoryProps> = ({
  isOpen,
  onClose,
  versions,
  onRestoreVersion,
  applicationType = 'Lease'
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  const getDisplayValue = (items: DealStructureItem[], fieldName: string) => {
    const item = items.find(item => 
      item.name.toLowerCase().includes(fieldName.toLowerCase())
    );
    return item?.value || 'N/A';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Requested Deal History
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {versions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No previous versions available
            </p>
          ) : (
            versions.map((version, index) => (
              <div 
                key={version.id} 
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">
                      {index === 0 ? 'Current Version' : `Version ${versions.length - index}`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(version.timestamp)}
                    </div>
                    {version.description && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {version.description}
                      </div>
                    )}
                  </div>
                  {index !== 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRestoreVersion(version)}
                      className="flex items-center gap-1"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Restore
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Term Length:</span> {getDisplayValue(version.items, 'term')}
                  </div>
                  {applicationType === 'Lease' && (
                    <div>
                      <span className="font-medium">Mileage Allowance:</span> {getDisplayValue(version.items, 'mileage')}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">
                      {applicationType === 'Lease' ? 'Due at Signing:' : 'Down Payment:'}
                    </span> {getDisplayValue(version.items, 'down') || getDisplayValue(version.items, 'payment')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DealVersionHistory;