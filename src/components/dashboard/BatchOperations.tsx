
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface BatchOperationsProps {
  selectedItems: string[];
  onClearSelection: () => void;
  onBatchDelete: () => void;
}

export const BatchOperations = ({
  selectedItems,
  onClearSelection,
  onBatchDelete,
}: BatchOperationsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleBatchDelete = () => {
    onBatchDelete();
    onClearSelection();
    setDeleteDialogOpen(false);
    toast.success(`${selectedItems.length} items deleted successfully`);
  };

  if (selectedItems.length === 0) return null;

  return (
    <div className="flex items-center gap-2 py-2">
      <span className="text-sm font-medium">
        {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""} selected
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onClearSelection()}
      >
        Clear selection
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setDeleteDialogOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-1" /> Delete selected
      </Button>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Items</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedItems.length} selected item{selectedItems.length !== 1 ? "s" : ""}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBatchDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
