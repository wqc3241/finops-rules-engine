
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

const mockGeoData = [
  {
    id: "1",
    geoCode: "NA-US-CA",
    geoLevel: "State",
    countryName: "United States of America",
    countryCode: "US",
    currency: "USD",
    stateCode: "CA",
    stateName: "California",
    locationName: "",
    locationCode: ""
  },
  {
    id: "2",
    geoCode: "NA-CA-BC",
    geoLevel: "State",
    countryName: "Canada",
    countryCode: "CA",
    currency: "CAD",
    stateCode: "BC",
    stateName: "British Columbia",
    locationName: "",
    locationCode: ""
  },
  {
    id: "3",
    geoCode: "NA-US",
    geoLevel: "Country",
    countryName: "United States of America",
    countryCode: "US",
    currency: "USD",
    stateCode: "",
    stateName: "",
    locationName: "",
    locationCode: ""
  },
  {
    id: "4",
    geoCode: "NA-US-CA-Torrence-SD",
    geoLevel: "Location",
    countryName: "United States of America",
    countryCode: "US",
    currency: "USD",
    stateCode: "CA",
    stateName: "California",
    locationName: "Torrence",
    locationCode: "NA-US-CA-Torrence-SD"
  },
  {
    id: "5",
    geoCode: "ME-KSA",
    geoLevel: "Country",
    countryName: "The Kingdom of Saudi Arabia",
    countryCode: "KSA",
    currency: "SAR",
    stateCode: "",
    stateName: "",
    locationName: "",
    locationCode: ""
  },
  {
    id: "6",
    geoCode: "ME-UAE",
    geoLevel: "Country",
    countryName: "United Arab Emirates",
    countryCode: "UAE",
    currency: "AED",
    stateCode: "",
    stateName: "",
    locationName: "",
    locationCode: ""
  }
];

interface GeoTableProps {
  onEdit: (id: string) => void;
  onCopy: (id: string) => void;
  onRemove: (id: string) => void;
  onSelectionChange?: (items: string[]) => void;
  selectedItems?: string[];
}

const GeoTable = ({ 
  onEdit, 
  onCopy, 
  onRemove,
  onSelectionChange,
  selectedItems = []
}: GeoTableProps) => {
  const [data] = useState(mockGeoData);
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
              <TableHead>Geo Level</TableHead>
              <TableHead>Country Name</TableHead>
              <TableHead>Country Code</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>State/Provinces Code</TableHead>
              <TableHead>State Name</TableHead>
              <TableHead>Location Name</TableHead>
              <TableHead>Location Code</TableHead>
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
                    aria-label={`Select ${row.geoCode}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{row.geoCode}</TableCell>
                <TableCell>{row.geoLevel}</TableCell>
                <TableCell>{row.countryName}</TableCell>
                <TableCell>{row.countryCode}</TableCell>
                <TableCell>{row.currency}</TableCell>
                <TableCell>{row.stateCode}</TableCell>
                <TableCell>{row.stateName}</TableCell>
                <TableCell>{row.locationName}</TableCell>
                <TableCell>{row.locationCode}</TableCell>
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

export default GeoTable;
