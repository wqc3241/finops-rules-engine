
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface FinancialProductsTableProps {
  onEdit: (id: string) => void;
  onCopy: (id: string) => void;
  onRemove: (id: string) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const mockFinancialProductsData = [
  {
    id: "USLN",
    productType: "Loan",
    productSubtype: null,
    geoCode: "NA-US",
    category: "Personal",
    isActive: true
  },
  {
    id: "USLE",
    productType: "Lease",
    productSubtype: null,
    geoCode: "NA-US",
    category: "Personal",
    isActive: true
  },
  {
    id: "DEL",
    productType: "Loan",
    productSubtype: null,
    geoCode: "EU-DE",
    category: "Personal",
    isActive: true
  },
  {
    id: "DELC",
    productType: "Loan",
    productSubtype: null,
    geoCode: "EU-DE",
    category: "Commercial",
    isActive: true
  },
  {
    id: "DELE",
    productType: "Lease",
    productSubtype: "Full service",
    geoCode: "EU-DE",
    category: "Personal",
    isActive: true
  },
  {
    id: "DELO",
    productType: "Lease",
    productSubtype: "Operating",
    geoCode: "EU-DE",
    category: "Personal",
    isActive: true
  },
  {
    id: "KSABM",
    productType: "Balloon",
    productSubtype: "Monthly",
    geoCode: "ME-KSA",
    category: "Personal",
    isActive: true
  },
  {
    id: "KSABA",
    productType: "Balloon",
    productSubtype: "Annual 50-50",
    geoCode: "ME-KSA",
    category: "Personal",
    isActive: true
  }
];

const FinancialProductsTable = ({ 
  onEdit, 
  onCopy, 
  onRemove,
  onSelectionChange,
  selectedItems = []
}: FinancialProductsTableProps) => {
  return (
    <div>
      <div className="rounded-md border">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Product ID</TableHead>
              <TableHead>Product Type</TableHead>
              <TableHead>Product Subtype</TableHead>
              <TableHead>Geo Code</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockFinancialProductsData.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell>{row.productType}</TableCell>
                <TableCell>{row.productSubtype || ""}</TableCell>
                <TableCell>{row.geoCode}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.isActive ? "Active" : "Inactive"}</TableCell>
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

export default FinancialProductsTable;
