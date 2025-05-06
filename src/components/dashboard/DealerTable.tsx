
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

const mockDealerData = [
  {
    id: "DL001",
    gatewayDealerId: "625801",
    gatewayId: "NA-US-00DT",
    geoCode: "",
    dbaName: "Lucid Group USA, Inc. NY",
    sellingState: "NY",
    financingFormList: "State-Specific",
    legalEntityName: "Lucid Motor Group, Inc",
    legalEntityAddress: "",
    gatewayDealershipAddress: ""
  },
  {
    id: "KSADL001",
    gatewayDealerId: "",
    gatewayId: "",
    geoCode: "ME-KSA",
    dbaName: "",
    sellingState: "",
    financingFormList: "",
    legalEntityName: "",
    legalEntityAddress: "",
    gatewayDealershipAddress: ""
  }
];

interface DealerTableProps {
  onEdit: (id: string) => void;
  onCopy: (id: string) => void;
  onRemove: (id: string) => void;
}

const DealerTable = ({ onEdit, onCopy, onRemove }: DealerTableProps) => {
  return (
    <div>
      <div className="rounded-md border">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>ID</TableHead>
              <TableHead>Gateway Dealer ID</TableHead>
              <TableHead>Gateway ID</TableHead>
              <TableHead>Geo Code</TableHead>
              <TableHead>DBA Name</TableHead>
              <TableHead>Selling State</TableHead>
              <TableHead>Financing Form List</TableHead>
              <TableHead>Legal Entity Name</TableHead>
              <TableHead>Legal Entity Address</TableHead>
              <TableHead>Gateway Dealership Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDealerData.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell>{row.gatewayDealerId}</TableCell>
                <TableCell>{row.gatewayId}</TableCell>
                <TableCell>{row.geoCode}</TableCell>
                <TableCell>{row.dbaName}</TableCell>
                <TableCell>{row.sellingState}</TableCell>
                <TableCell>{row.financingFormList}</TableCell>
                <TableCell>{row.legalEntityName}</TableCell>
                <TableCell>{row.legalEntityAddress}</TableCell>
                <TableCell>{row.gatewayDealershipAddress}</TableCell>
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

export default DealerTable;
