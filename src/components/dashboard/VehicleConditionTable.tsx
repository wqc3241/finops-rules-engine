
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

const mockVehicleConditionData = [
  {
    id: "vc-new-ksa",
    type: "New",
    geoCode: "ME-KSA",
    titleStatus: "New",
    advertisedCondition: "New",
    minOdometer: "",
    maxOdometer: "",
    registrationStartDate: "",
    registrationEndDate: "",
    modelYear: "",
    priorSellToCustomer: "",
    applicableRVTable: ""
  },
  {
    id: "vc-new-uae",
    type: "New",
    geoCode: "ME-UAE",
    titleStatus: "New",
    advertisedCondition: "New",
    minOdometer: "",
    maxOdometer: "",
    registrationStartDate: "",
    registrationEndDate: "",
    modelYear: "",
    priorSellToCustomer: "",
    applicableRVTable: ""
  },
  {
    id: "vc-used",
    type: "Used",
    geoCode: "",
    titleStatus: "New",
    advertisedCondition: "New",
    minOdometer: "",
    maxOdometer: "",
    registrationStartDate: "",
    registrationEndDate: "",
    modelYear: "",
    priorSellToCustomer: "",
    applicableRVTable: ""
  },
  {
    id: "vc-demo",
    type: "Demo",
    geoCode: "",
    titleStatus: "",
    advertisedCondition: "",
    minOdometer: "",
    maxOdometer: "",
    registrationStartDate: "",
    registrationEndDate: "",
    modelYear: "",
    priorSellToCustomer: "",
    applicableRVTable: ""
  },
  {
    id: "vc-cpo",
    type: "CPO",
    geoCode: "",
    titleStatus: "",
    advertisedCondition: "",
    minOdometer: "",
    maxOdometer: "",
    registrationStartDate: "",
    registrationEndDate: "",
    modelYear: "",
    priorSellToCustomer: "",
    applicableRVTable: ""
  }
];

interface VehicleConditionTableProps {
  onEdit: (id: string) => void;
  onCopy: (id: string) => void;
  onRemove: (id: string) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const VehicleConditionTable = ({ 
  onEdit, 
  onCopy, 
  onRemove,
  onSelectionChange,
  selectedItems = []
}: VehicleConditionTableProps) => {
  const [data] = useState(mockVehicleConditionData);
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
              <TableHead>Financing Vehicle Condition Type</TableHead>
              <TableHead>Geo Code</TableHead>
              <TableHead>Title Status</TableHead>
              <TableHead>Advertised Condition</TableHead>
              <TableHead>Min Odometer</TableHead>
              <TableHead>Max Odometer</TableHead>
              <TableHead>Registration Start Date</TableHead>
              <TableHead>Registration End Date</TableHead>
              <TableHead>Model Year</TableHead>
              <TableHead>Prior Sell to Customer</TableHead>
              <TableHead>Applicable RV Table</TableHead>
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
                    aria-label={`Select ${row.type}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{row.type}</TableCell>
                <TableCell>{row.geoCode}</TableCell>
                <TableCell>{row.titleStatus}</TableCell>
                <TableCell>{row.advertisedCondition}</TableCell>
                <TableCell>{row.minOdometer}</TableCell>
                <TableCell>{row.maxOdometer}</TableCell>
                <TableCell>{row.registrationStartDate}</TableCell>
                <TableCell>{row.registrationEndDate}</TableCell>
                <TableCell>{row.modelYear}</TableCell>
                <TableCell>{row.priorSellToCustomer}</TableCell>
                <TableCell>{row.applicableRVTable}</TableCell>
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

export default VehicleConditionTable;
