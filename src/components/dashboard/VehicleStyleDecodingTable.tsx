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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { useVehicleOptions } from "@/hooks/useVehicleOptions";

const mockVehicleStyleData = [
  {
    id: "L25A1",
    styleId: "L25A1",
    algCode: "ZL_MV001",
    geoCode: "",
    modelYear: "2025",
    make: "Lucid",
    model: "Air",
    trim: "Grand Touring",
    optionCode: "OP1",
    priority: "1"
  },
  {
    id: "L25A2",
    styleId: "L25A2",
    algCode: "ZL_MV002",
    geoCode: "",
    modelYear: "2025",
    make: "Lucid",
    model: "Air",
    trim: "Pure",
    optionCode: "OP2",
    priority: "1"
  },
  {
    id: "L25A3",
    styleId: "L25A3",
    algCode: "ZL_MV003",
    geoCode: "",
    modelYear: "2025",
    make: "Lucid",
    model: "Air",
    trim: "Pure",
    optionCode: "",
    priority: "2"
  },
  {
    id: "KSA25A1",
    styleId: "KSA25A1",
    algCode: "",
    geoCode: "ME-KSA",
    modelYear: "2025",
    make: "Lucid",
    model: "Air",
    trim: "Pure",
    optionCode: "KSAOP1",
    priority: "1"
  }
];

interface VehicleStyleDecodingTableProps {
  onEdit: (id: string) => void;
  onCopy: (id: string) => void;
  onRemove: (id: string) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const VehicleStyleDecodingTable = ({ 
  onEdit, 
  onCopy, 
  onRemove,
  onSelectionChange,
  selectedItems = []
}: VehicleStyleDecodingTableProps) => {
  const [data, setData] = useState(mockVehicleStyleData);
  const [localSelectedItems, setLocalSelectedItems] = useState<string[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingOptionCode, setEditingOptionCode] = useState<string | null>(null);
  
  const vehicleOptions = useVehicleOptions();
  
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

  const handleOptionCodeUpdate = (styleId: string, newOptionCode: string) => {
    // Convert "none" back to empty string for storage
    const actualOptionCode = newOptionCode === "none" ? "" : newOptionCode;
    
    setData(current => 
      current.map(item => 
        item.id === styleId 
          ? { ...item, optionCode: actualOptionCode }
          : item
      )
    );
    setEditingOptionCode(null);
    toast.success("Option code updated successfully");
  };

  const getOptionDisplayText = (optionCode: string) => {
    if (!optionCode) return "";
    
    const option = vehicleOptions.find(opt => opt.code === optionCode);
    if (!option) return optionCode;
    
    const details = [];
    if (option.drivetrain) details.push(option.drivetrain);
    if (option.color) details.push(option.color);
    if (option.design) details.push(option.design);
    if (option.roof) details.push(option.roof);
    if (option.wheels) details.push(option.wheels);
    if (option.adas) details.push(option.adas);
    if (option.soundSystem) details.push(option.soundSystem);
    
    return details.length > 0 ? `${optionCode} - ${details.join(", ")}` : optionCode;
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
              <TableHead>Style ID</TableHead>
              <TableHead>ALG Code (Local RV code)</TableHead>
              <TableHead>Geo code</TableHead>
              <TableHead>Model Year</TableHead>
              <TableHead>Make</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Trim</TableHead>
              <TableHead>Option Code</TableHead>
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
                    aria-label={`Select ${row.styleId}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{row.styleId}</TableCell>
                <TableCell>{row.algCode}</TableCell>
                <TableCell>{row.geoCode}</TableCell>
                <TableCell>{row.modelYear}</TableCell>
                <TableCell>{row.make}</TableCell>
                <TableCell>{row.model}</TableCell>
                <TableCell>{row.trim}</TableCell>
                <TableCell>
                  {editingOptionCode === row.id ? (
                    <Select
                      value={row.optionCode || "none"}
                      onValueChange={(value) => handleOptionCodeUpdate(row.id, value)}
                      onOpenChange={(open) => {
                        if (!open) setEditingOptionCode(null);
                      }}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-white max-h-60">
                        <SelectItem value="none">
                          (No option code)
                        </SelectItem>
                        {vehicleOptions.map(option => (
                          <SelectItem key={option.code} value={option.code}>
                            {getOptionDisplayText(option.code)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div 
                      className="cursor-pointer hover:bg-gray-100 p-1 rounded min-h-[20px]"
                      onClick={() => setEditingOptionCode(row.id)}
                    >
                      {row.optionCode || <span className="text-gray-400">Click to select</span>}
                    </div>
                  )}
                </TableCell>
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

export default VehicleStyleDecodingTable;
