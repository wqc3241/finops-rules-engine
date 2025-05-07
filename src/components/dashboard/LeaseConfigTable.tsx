
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
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const mockLeaseConfigData = [
  {
    id: "1",
    geoCode: "NA-US-CA",
    defaultCapitalizationItems: "Acquisition fee, doc fee",
    optionalCapitalizationItems: "Reg Fee, Electronic Filing Fee",
    mandatoryUpfrontItems: "Transportation fee, 1st monthly payment, CCR",
    salesTaxBasis: "Depreciation and Amortization",
    taxPaymentOption: "Monthly",
    tradeOnCCR: "TRUE",
    tradeTaxCreditEligibility: "TRUE"
  },
  {
    id: "2",
    geoCode: "NA-US-FL",
    defaultCapitalizationItems: "Acquisition fee, doc fee",
    optionalCapitalizationItems: "",
    mandatoryUpfrontItems: "",
    salesTaxBasis: "Vehicle Price",
    taxPaymentOption: "Monthly",
    tradeOnCCR: "FALSE",
    tradeTaxCreditEligibility: "FALSE"
  }
];

interface LeaseConfigTableProps {
  onEdit: (id: string) => void;
  onCopy: (id: string) => void;
  onRemove: (id: string) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const LeaseConfigTable = ({ 
  onEdit, 
  onCopy, 
  onRemove,
  onSelectionChange,
  selectedItems = []
}: LeaseConfigTableProps) => {
  const [data] = useState(mockLeaseConfigData);
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
              <TableHead>Geo Code</TableHead>
              <TableHead>Default Capitalization Items</TableHead>
              <TableHead>Optional Capitalization Items</TableHead>
              <TableHead>Mandatory Upfront items</TableHead>
              <TableHead>Sales tax basis</TableHead>
              <TableHead>Tax payment option</TableHead>
              <TableHead>Trade on CCR</TableHead>
              <TableHead>Trade Tax credit eligibility</TableHead>
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
                <TableCell className="font-medium">{row.geoCode}</TableCell>
                <TableCell>{row.defaultCapitalizationItems}</TableCell>
                <TableCell>{row.optionalCapitalizationItems}</TableCell>
                <TableCell>{row.mandatoryUpfrontItems}</TableCell>
                <TableCell>{row.salesTaxBasis}</TableCell>
                <TableCell>{row.taxPaymentOption}</TableCell>
                <TableCell>{row.tradeOnCCR}</TableCell>
                <TableCell>{row.tradeTaxCreditEligibility}</TableCell>
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

export default LeaseConfigTable;
