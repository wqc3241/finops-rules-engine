
import { useState } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Edit, Trash2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BatchOperations } from "./BatchOperations";
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

const mockStipulationData = [
  {
    id: "stip1",
    geoCode: "US",
    stipulationName: "Income Proof",
    description: "Proof of applicant income",
    applicant: "Both",
    documentList: "W2, Paycheck",
    customerInternal: "Customer",
    isActive: "Active"
  },
  {
    id: "stip2",
    geoCode: "EU",
    stipulationName: "Address Verification",
    description: "Proof of current address",
    applicant: "Primary",
    documentList: "Utility Bill, Bank Statement",
    customerInternal: "Customer",
    isActive: "Active"
  },
  {
    id: "stip3",
    geoCode: "CA",
    stipulationName: "ID Verification",
    description: "Government issued ID",
    applicant: "Both",
    documentList: "Passport, Driver License",
    customerInternal: "Internal",
    isActive: "Active"
  }
];

interface StipulationTableProps {
  onEdit: (id: string) => void;
  onCopy: (id: string) => void;
  onRemove: (id: string) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const StipulationTable = ({ 
  onEdit, 
  onCopy, 
  onRemove,
  onSelectionChange,
  selectedItems = []
}: StipulationTableProps) => {
  const [data, setData] = useState(mockStipulationData);
  const [localSelectedItems, setLocalSelectedItems] = useState<string[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Use either prop or local state for selections
  const effectiveSelectedItems = selectedItems.length ? selectedItems : localSelectedItems;

  const toggleSelectAll = () => {
    const allIds = data.map(item => item.id);
    const newSelection = effectiveSelectedItems.length === data.length ? [] : allIds;
    
    setLocalSelectedItems(newSelection);
    if (onSelectionChange) {
      onSelectionChange(newSelection);
    }
  };

  const toggleSelectItem = (id: string) => {
    const newSelection = effectiveSelectedItems.includes(id)
      ? effectiveSelectedItems.filter(itemId => itemId !== id)
      : [...effectiveSelectedItems, id];
    
    setLocalSelectedItems(newSelection);
    if (onSelectionChange) {
      onSelectionChange(newSelection);
    }
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData(current => current.filter(item => item.id !== itemToDelete));
      setLocalSelectedItems(current => current.filter(id => id !== itemToDelete));
      
      // Call the onRemove prop
      onRemove(itemToDelete);
      toast.success("Item deleted successfully");
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleBatchDelete = () => {
    setData(current => current.filter(item => !effectiveSelectedItems.includes(item.id)));
    // In a real app, you'd call an API to delete these items
    toast.success(`${effectiveSelectedItems.length} items deleted`);
    
    setLocalSelectedItems([]);
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  };

  return (
    <div className="space-y-4">
      <BatchOperations 
        selectedItems={effectiveSelectedItems}
        onClearSelection={() => {
          setLocalSelectedItems([]);
          if (onSelectionChange) onSelectionChange([]);
        }}
        onBatchDelete={handleBatchDelete}
      />
      
      <div className="rounded-md border">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-10">
                <Checkbox 
                  checked={effectiveSelectedItems.length === data.length && data.length > 0} 
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Geo Code</TableHead>
              <TableHead>Stipulation Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Primary/ Co-applicant</TableHead>
              <TableHead>Document List</TableHead>
              <TableHead>Customer/ Internal</TableHead>
              <TableHead>isActive</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox 
                    checked={effectiveSelectedItems.includes(row.id)}
                    onCheckedChange={() => toggleSelectItem(row.id)}
                    aria-label={`Select ${row.stipulationName}`}
                  />
                </TableCell>
                <TableCell>{row.geoCode}</TableCell>
                <TableCell className="font-medium">{row.stipulationName}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.applicant}</TableCell>
                <TableCell>{row.documentList}</TableCell>
                <TableCell>{row.customerInternal}</TableCell>
                <TableCell>{row.isActive}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(row.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onCopy(row.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(row.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
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

export default StipulationTable;
