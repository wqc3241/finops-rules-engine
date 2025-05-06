import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ChevronDown, ChevronUp, Edit, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";

type BulletinPricing = {
  id: string;
  financialProgram: string;
  pricingConfig: string;
  pricingType: string;
  advertised: boolean | string;
  pricingValue: string;
  lenderList: string;
  geoCode: string;
  uploadDate?: string;
};

const initialData: BulletinPricing[] = [
  { id: "BT01", financialProgram: "AIPUNR07241", pricingConfig: "", pricingType: "SUBAPR", advertised: "Yes", pricingValue: "2.99", lenderList: "CMB, BAC", geoCode: "NA-US-CA" },
  { id: "BT02", financialProgram: "AIPUNR07241", pricingConfig: "PR002", pricingType: "SUBAPR", advertised: "Yes", pricingValue: "7.49", lenderList: "CMB, BAC", geoCode: "NA-US-CA" },
  { id: "BT03", financialProgram: "AIPUNL07241", pricingConfig: "PR003", pricingType: "ENHRV", advertised: "Yes", pricingValue: "60.50%", lenderList: "LFS", geoCode: "NA-US-CA" },
  { id: "BT04", financialProgram: "AIPUNL07241", pricingConfig: "PR003", pricingType: "SUBMF", advertised: "Yes", pricingValue: "60.50%", lenderList: "LFS", geoCode: "NA-US-CA" },
  { id: "BT05", financialProgram: "AIPUNR07241", pricingConfig: "PR001", pricingType: "MAXBDAPR", advertised: "Yes", pricingValue: "2", lenderList: "CMB", geoCode: "NA-US-CA" },
  { id: "BT06", financialProgram: "AIPUNR07241", pricingConfig: "PR002", pricingType: "MAXMUAPR", advertised: "Yes", pricingValue: "3", lenderList: "CMB", geoCode: "NA-US-CA" },
  { id: "BT05-1", financialProgram: "AIPUNR07241", pricingConfig: "PR001", pricingType: "MAXBDAPR", advertised: "Yes", pricingValue: "1.25", lenderList: "BAC", geoCode: "NA-US-CA" },
  { id: "BT06-1", financialProgram: "AIPUNR07241", pricingConfig: "PR002", pricingType: "MAXMUAPR", advertised: "Yes", pricingValue: "2.25", lenderList: "BAC", geoCode: "NA-US-CA" },
  { id: "BTKSA01-1", financialProgram: "SNBAIPUNL04251", pricingConfig: "KSAPR001", pricingType: "ADF", advertised: "", pricingValue: "3500.00", lenderList: "KSASNB", geoCode: "ME-KSA" },
  { id: "BTKSA01-2", financialProgram: "SNBAIPUNL04251", pricingConfig: "KSAPR001", pricingType: "INR", advertised: "", pricingValue: "2%", lenderList: "KSASNB", geoCode: "ME-KSA" },
  { id: "BTKSA01-3", financialProgram: "SNBAIPUNL04251", pricingConfig: "KSAPR001", pricingType: "PAPR", advertised: "", pricingValue: "2.50%", lenderList: "KSASNB", geoCode: "ME-KSA" },
  { id: "BTKSA01-4", financialProgram: "SNBAIPUNL04251", pricingConfig: "KSAPR001", pricingType: "NPAPR", advertised: "", pricingValue: "3.50%", lenderList: "KSASNB", geoCode: "ME-KSA" },
  { id: "BTKSA02-1", financialProgram: "AIBAIPUNL04251", pricingConfig: "KSAPR001", pricingType: "ADF", advertised: "", pricingValue: "3500.00", lenderList: "KSABA", geoCode: "ME-KSA" },
  { id: "BTKSA02-2", financialProgram: "AIBAIPUNL04251", pricingConfig: "KSAPR001", pricingType: "INR", advertised: "", pricingValue: "2%", lenderList: "KSABA", geoCode: "ME-KSA" },
  { id: "BTKSA02-3", financialProgram: "AIBAIPUNL04251", pricingConfig: "KSAPR001", pricingType: "PAPR", advertised: "", pricingValue: "2.50%", lenderList: "KSABA", geoCode: "ME-KSA" },
  { id: "BTKSA02-4", financialProgram: "AIBAIPUNL04251", pricingConfig: "KSAPR001", pricingType: "NPAPR", advertised: "", pricingValue: "3.50%", lenderList: "KSABA", geoCode: "ME-KSA" },
  { id: "BTKSA02-5", financialProgram: "AIBAIPUNL04251", pricingConfig: "KSAPR001", pricingType: "STDBP", advertised: "", pricingValue: "50.00%", lenderList: "KSABA", geoCode: "ME-KSA" },
  { id: "BTKSA02-6", financialProgram: "AIBAIPUNL04251", pricingConfig: "KSAPR001", pricingType: "STDDP", advertised: "", pricingValue: "50.00%", lenderList: "KSABA", geoCode: "ME-KSA" },
];

const PricingRulesTable = () => {
  const [data, setData] = useState<BulletinPricing[]>(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof BulletinPricing | null; direction: 'asc' | 'desc' | null }>({
    key: null,
    direction: null,
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  // Calculate the items for the current page
  const currentItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: keyof BulletinPricing) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }
    
    setSortConfig({ key, direction });
    
    // Sort the data based on the configuration
    if (direction === null) {
      // Reset to original order
      setData([...initialData]);
    } else {
      const sortedData = [...data].sort((a, b) => {
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
      });
      setData(sortedData);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => 
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([]);
    } else {
      const currentIds = currentItems.map((item) => item.id);
      setSelectedItems(currentIds);
    }
  };

  const handleEdit = (id: string) => {
    console.log(`Editing item with ID: ${id}`);
    toast.info(`Editing bulletin pricing with ID: ${id}`);
    // Implement edit functionality here
  };

  const handleCopy = (id: string) => {
    const itemToCopy = data.find(item => item.id === id);
    if (itemToCopy) {
      const newItem = {
        ...itemToCopy,
        id: `${itemToCopy.id}_COPY`,
      };
      setData([...data, newItem]);
      toast.success(`Copied bulletin pricing: ${itemToCopy.id}`);
    }
  };

  const handleDelete = (id: string) => {
    console.log(`Deleting item with ID: ${id}`);
    toast.success(`Bulletin pricing deleted successfully`);
    // Here you would delete the item and update state
    setData(data.filter((item) => item.id !== id));
    setSelectedItems(selectedItems.filter((item) => item !== id));
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Clear selected items when changing pages
      setSelectedItems([]);
    }
  };

  const getSortIcon = (key: keyof BulletinPricing) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="overflow-hidden border rounded-md">
      <Table className="min-w-full">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-[50px] px-2">
              <Checkbox
                checked={selectedItems.length === currentItems.length && currentItems.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('id')}>
              <div className="flex items-center">
                Bulletin ID {getSortIcon('id')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('financialProgram')}>
              <div className="flex items-center">
                Financial Program {getSortIcon('financialProgram')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('pricingConfig')}>
              <div className="flex items-center">
                Pricing Config {getSortIcon('pricingConfig')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('pricingType')}>
              <div className="flex items-center">
                Pricing Type {getSortIcon('pricingType')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('advertised')}>
              <div className="flex items-center">
                Advertised {getSortIcon('advertised')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('pricingValue')}>
              <div className="flex items-center">
                Pricing Value {getSortIcon('pricingValue')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('lenderList')}>
              <div className="flex items-center">
                Lender List {getSortIcon('lenderList')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('geoCode')}>
              <div className="flex items-center">
                Geo Code {getSortIcon('geoCode')}
              </div>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell className="px-2">
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => handleSelectItem(item.id)}
                />
              </TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.financialProgram}</TableCell>
              <TableCell>{item.pricingConfig}</TableCell>
              <TableCell>{item.pricingType}</TableCell>
              <TableCell>{item.advertised}</TableCell>
              <TableCell>{item.pricingValue}</TableCell>
              <TableCell>{item.lenderList}</TableCell>
              <TableCell>{item.geoCode}</TableCell>
              <TableCell className="space-x-2">
                <Button size="icon" variant="ghost" onClick={() => handleEdit(item.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleCopy(item.id)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {totalPages > 1 && (
        <div className="p-2 border-t bg-gray-50">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => handlePageChange(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default PricingRulesTable;
