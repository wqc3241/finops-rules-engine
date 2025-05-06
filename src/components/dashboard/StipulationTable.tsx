
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

const mockStipulationData = [
  {
    geoCode: "US",
    stipulationName: "Income Proof",
    description: "Proof of applicant income",
    applicant: "Both",
    documentList: "W2, Paycheck",
    customerInternal: "Customer",
    isActive: "Active"
  }
];

interface StipulationTableProps {
  onEdit: (name: string) => void;
  onCopy: (name: string) => void;
  onRemove: (name: string) => void;
}

const StipulationTable = ({ onEdit, onCopy, onRemove }: StipulationTableProps) => {
  return (
    <div>
      <div className="rounded-md border">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50">
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
            {mockStipulationData.map((row, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
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
                      onClick={() => onEdit(row.stipulationName)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onCopy(row.stipulationName)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(row.stipulationName)}
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

export default StipulationTable;
