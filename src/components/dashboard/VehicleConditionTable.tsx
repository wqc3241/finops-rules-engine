
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

const mockVehicleConditionData = [
  {
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
  onEdit: (type: string) => void;
  onCopy: (type: string) => void;
  onRemove: (type: string) => void;
}

const VehicleConditionTable = ({ onEdit, onCopy, onRemove }: VehicleConditionTableProps) => {
  return (
    <div>
      <div className="rounded-md border">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50">
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
            {mockVehicleConditionData.map((row, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
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
                      onClick={() => onEdit(row.type)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onCopy(row.type)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(row.type)}
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
