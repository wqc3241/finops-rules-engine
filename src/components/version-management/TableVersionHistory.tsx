import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, RotateCcw } from 'lucide-react';
import { TableData } from '@/types/dynamicTable';
import { useAuth } from '@/hooks/useAuth';

export interface TableVersion {
  id: string;
  timestamp: Date;
  data: TableData[];
  description: string;
  createdBy: string;
  version: number;
}

interface TableVersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  versions: TableVersion[];
  onRestoreVersion: (version: TableVersion) => void;
  tableName: string;
}

const TableVersionHistory: React.FC<TableVersionHistoryProps> = ({
  isOpen,
  onClose,
  versions,
  onRestoreVersion,
  tableName
}) => {
  const { isFSAdmin } = useAuth();

  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {tableName} Version History
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {versions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No version history available
            </p>
          ) : (
            versions.map((version, index) => (
              <div 
                key={version.id} 
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {index === 0 ? 'Current Version' : `Version ${version.version}`}
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {version.data.length} records
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(version.timestamp)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Created by: {version.createdBy}
                    </div>
                    {version.description && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {version.description}
                      </div>
                    )}
                  </div>
                  {index !== 0 && isFSAdmin() && (
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
                
                <div className="text-sm border-t pt-2">
                  <div className="text-muted-foreground">
                    {version.description || 'No description provided'}
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

export default TableVersionHistory;