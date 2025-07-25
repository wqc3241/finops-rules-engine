
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const mockLenderData = [
  {
    id: "L001",
    gatewayLenderId: "CMB",
    lienHolderName: "JPMorgan Chase Bank, N.A",
    gatewayLenderName: "Chase",
    lenderFullName: "JPMorgan Chase Bank, N.A",
    lenderAddress: "PO BOX 901033, Fort Worth, TX 76101-2033, US"
  },
  {
    id: "KSAENBD",
    gatewayLenderId: "ENBD",
    lienHolderName: "ENBD",
    gatewayLenderName: "",
    lenderFullName: "",
    lenderAddress: ""
  },
  {
    id: "KSASNB",
    gatewayLenderId: "SNB",
    lienHolderName: "SNB",
    gatewayLenderName: "",
    lenderFullName: "",
    lenderAddress: ""
  },
  {
    id: "KSAAIB",
    gatewayLenderId: "AIB",
    lienHolderName: "Al-Inma Bank",
    gatewayLenderName: "",
    lenderFullName: "",
    lenderAddress: ""
  },
  {
    id: "KSAJB",
    gatewayLenderId: "J-B",
    lienHolderName: "J-B",
    gatewayLenderName: "",
    lenderFullName: "",
    lenderAddress: ""
  },
  {
    id: "KSAABB",
    gatewayLenderId: "ABB",
    lienHolderName: "Al-Bilad Bank",
    gatewayLenderName: "",
    lenderFullName: "",
    lenderAddress: ""
  }
];

interface LenderTableProps {
  onEdit: (id: string) => void;
  onCopy: (id: string) => void;
  onRemove: (id: string) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const LenderTable = ({ 
  onEdit, 
  onCopy, 
  onRemove,
  onSelectionChange,
  selectedItems = []
}: LenderTableProps) => {
  const [data] = useState(mockLenderData);
  const [localSelectedItems, setLocalSelectedItems] = useState<string[]>([]);
  
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
  
  return (
    <div>
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
              <TableHead>ID</TableHead>
              <TableHead>Gateway Lender ID</TableHead>
              <TableHead>Lien Holder Name</TableHead>
              <TableHead>Gateway Lender Name</TableHead>
              <TableHead>Lender Full Name</TableHead>
              <TableHead>Lender Address</TableHead>
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
                    aria-label={`Select ${row.id}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell>{row.gatewayLenderId}</TableCell>
                <TableCell>{row.lienHolderName}</TableCell>
                <TableCell>{row.gatewayLenderName}</TableCell>
                <TableCell>{row.lenderFullName}</TableCell>
                <TableCell>{row.lenderAddress}</TableCell>
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
                      onClick={() => onRemove(row.id)}
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
    </div>
  );
};

export default LenderTable;
