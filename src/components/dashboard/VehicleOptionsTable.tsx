
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

const mockVehicleOptionsData = [
  {
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
}

const VehicleOptionsTable = ({ onEdit, onCopy, onRemove }: VehicleOptionsTableProps) => {
  return (
    <div>
      <div className="rounded-md border">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50">
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
            {mockVehicleOptionsData.map((row) => (
              <TableRow key={row.code} className="hover:bg-gray-50">
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
                      onClick={() => onEdit(row.code)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onCopy(row.code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(row.code)}
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

export default VehicleOptionsTable;
