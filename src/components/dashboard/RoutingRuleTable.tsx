
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

const mockRoutingRuleData = [
  {
    id: "RR001",
    dealer: "DL001",
    lender: "L001",
    geoCode: "NA-US-CA",
    financialProduct: "Lease",
    vehicleCondition: "New",
    creditProfile: "P001",
    isActive: "Y",
    routingPriority: "1"
  },
  {
    id: "RR002",
    dealer: "DL002",
    lender: "L002",
    geoCode: "NA-US-FL-?",
    financialProduct: "",
    vehicleCondition: "",
    creditProfile: "",
    isActive: "",
    routingPriority: "2"
  },
  {
    id: "RR003",
    dealer: "DL003",
    lender: "L003",
    geoCode: "NA-US-FL-??",
    financialProduct: "",
    vehicleCondition: "",
    creditProfile: "",
    isActive: "",
    routingPriority: "3"
  },
  {
    id: "KSARR001",
    dealer: "KSADL001",
    lender: "KSAL001",
    geoCode: "ME-KSA",
    financialProduct: "Balloon",
    vehicleCondition: "New",
    creditProfile: "KSAP001",
    isActive: "Y",
    routingPriority: "1"
  }
];

interface RoutingRuleTableProps {
  onEdit: (id: string) => void;
  onCopy: (id: string) => void;
  onRemove: (id: string) => void;
}

const RoutingRuleTable = ({ onEdit, onCopy, onRemove }: RoutingRuleTableProps) => {
  return (
    <div>
      <div className="rounded-md border">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Rule ID</TableHead>
              <TableHead>Dealer</TableHead>
              <TableHead>Lender</TableHead>
              <TableHead>Geo Code</TableHead>
              <TableHead>Financial Product</TableHead>
              <TableHead>Vehicle Condition</TableHead>
              <TableHead>Credit Profile</TableHead>
              <TableHead>isActive</TableHead>
              <TableHead>Routing Priority</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockRoutingRuleData.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell>{row.dealer}</TableCell>
                <TableCell>{row.lender}</TableCell>
                <TableCell>{row.geoCode}</TableCell>
                <TableCell>{row.financialProduct}</TableCell>
                <TableCell>{row.vehicleCondition}</TableCell>
                <TableCell>{row.creditProfile}</TableCell>
                <TableCell>{row.isActive}</TableCell>
                <TableCell>{row.routingPriority}</TableCell>
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

export default RoutingRuleTable;
