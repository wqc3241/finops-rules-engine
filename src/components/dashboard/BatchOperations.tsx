
import { Button } from "@/components/ui/button";
import { X, Trash } from "lucide-react";

interface BatchOperationsProps {
  selectedItems: string[];
  onClearSelection: () => void;
  onBatchDelete: () => void;
}

const BatchOperations = ({ 
  selectedItems,
  onClearSelection,
  onBatchDelete
}: BatchOperationsProps) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg border p-2 flex items-center gap-2">
      <span className="text-xs font-medium">{selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected</span>
      
      <Button 
        onClick={onBatchDelete}
        size="sm"
        variant="destructive"
        className="h-7 text-xs"
      >
        <Trash className="h-3 w-3 mr-1" />
        Delete
      </Button>
      
      <Button 
        onClick={onClearSelection}
        size="sm" 
        variant="outline"
        className="h-7 text-xs"
      >
        <X className="h-3 w-3 mr-1" />
        Clear Selection
      </Button>
    </div>
  );
};

export { BatchOperations };
