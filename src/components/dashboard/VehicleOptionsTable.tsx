
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

const mockVehicleOptionsData = [
  {
    id: "OP1",
    code: "OP1",
    drivetrain: "AWD",
    color: "",
    design: "",
    roof: "",
    wheels: "",
    adas: "",
    soundSystem: "",
    priority: "1"
  },
  {
    id: "OP2",
    code: "OP2",
    drivetrain: "RWD",
    color: "",
    design: "",
    roof: "",
    wheels: "",
    adas: "",
    soundSystem: "",
    priority: "2"
  },
  {
    id: "OP3",
    code: "OP3",
    drivetrain: "AWD",
    color: "",
    design: "",
    roof: "",
    wheels: "22\" wheel",
    adas: "",
    soundSystem: "",
    priority: ""
  },
  {
    id: "KSAOP1",
    code: "KSAOP1",
    drivetrain: "AWE",
    color: "Blue",
    design: "Stealth",
    roof: "Glass",
    wheels: "21\" wheel",
    adas: "Pro",
    soundSystem: "Pro",
    priority: "1"
  }
];

interface VehicleOptionsTableProps {
  onEdit: (code: string) => void;
  onCopy: (code: string) => void;
  onRemove: (code: string) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const VehicleOptionsTable = ({ 
  onEdit, 
  onCopy, 
  onRemove,
  onSelectionChange,
  selectedItems = []
}: VehicleOptionsTableProps) => {
  const [data, setData] = useState(mockVehicleOptionsData);
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
              <TableHead>Code</TableHead>
              <TableHead>Drivetrain</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Design</TableHead>
              <TableHead>Roof</TableHead>
              <TableHead>Wheels</TableHead>
              <TableHead>ADAS</TableHead>
              <TableHead>Sound System</TableHead>
              <TableHead>Priority</TableHead>
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
                    aria-label={`Select ${row.code}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{row.code}</TableCell>
                <TableCell>{row.drivetrain}</TableCell>
                <TableCell>{row.color}</TableCell>
                <TableCell>{row.design}</TableCell>
                <TableCell>{row.roof}</TableCell>
                <TableCell>{row.wheels}</TableCell>
                <TableCell>{row.adas}</TableCell>
                <TableCell>{row.soundSystem}</TableCell>
                <TableCell>{row.priority}</TableCell>
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

export default VehicleOptionsTable;
