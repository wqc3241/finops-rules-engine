import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, User, RotateCcw } from "lucide-react";
import { TableVersion } from "@/hooks/useTableVersions";
import { formatDistanceToNow } from "date-fns";

interface TableVersionHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  versions: TableVersion[];
  onRestore?: (versionId: string) => void;
  canRestore: boolean;
  isLoading?: boolean;
}

const TableVersionHistory = ({
  open,
  onOpenChange,
  versions,
  onRestore,
  canRestore,
  isLoading = false
}: TableVersionHistoryProps) => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const handleRestore = (versionId: string) => {
    if (onRestore) {
      onRestore(versionId);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Table Version History
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4">
              {versions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No versions found for this table
                </div>
              ) : (
                versions.map((version) => (
                  <div
                    key={version.id}
                    className={`p-4 border rounded-lg transition-colors cursor-pointer ${
                      selectedVersion === version.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedVersion(version.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            Version {version.version}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4" />
                          <span>{version.createdBy}</span>
                        </div>
                        
                        {version.description && (
                          <p className="text-sm text-muted-foreground">
                            {version.description}
                          </p>
                        )}
                        
                        <div className="text-xs text-muted-foreground">
                          {version.data.length} rows • {version.schema.columns?.length || 0} columns
                        </div>
                      </div>
                      
                      {canRestore && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestore(version.id);
                          }}
                          className="ml-4"
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Restore
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TableVersionHistory;