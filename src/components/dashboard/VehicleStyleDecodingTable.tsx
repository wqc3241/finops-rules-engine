
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

const mockVehicleStyleData = [
  {
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
}

const VehicleStyleDecodingTable = ({ onEdit, onCopy, onRemove }: VehicleStyleDecodingTableProps) => {
  return (
    <div>
      <div className="rounded-md border">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50">
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
            {mockVehicleStyleData.map((row) => (
              <TableRow key={row.styleId} className="hover:bg-gray-50">
                <TableCell className="font-medium">{row.styleId}</TableCell>
                <TableCell>{row.algCode}</TableCell>
                <TableCell>{row.geoCode}</TableCell>
                <TableCell>{row.modelYear}</TableCell>
                <TableCell>{row.make}</TableCell>
                <TableCell>{row.model}</TableCell>
                <TableCell>{row.trim}</TableCell>
                <TableCell>{row.optionCode}</TableCell>
                <TableCell>{row.priority}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(row.styleId)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onCopy(row.styleId)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(row.styleId)}
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

export default VehicleStyleDecodingTable;
