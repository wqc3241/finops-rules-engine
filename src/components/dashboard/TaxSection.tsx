
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Copy, Trash2, Plus, Filter, ArrowUp, ArrowDown } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface TaxSectionProps {
  title: string;
  showAddTaxModal?: boolean;
  setShowAddTaxModal?: (show: boolean) => void;
  onAddTax?: (taxData: any) => void;
}

const TaxSection = ({ 
  title, 
  showAddTaxModal = false, 
  setShowAddTaxModal = () => {}, 
  onAddTax 
}: TaxSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [newTaxData, setNewTaxData] = useState({
    taxName: "",
    locale: "",
    rate: "",
    description: ""
  });
  
  const taxData = [
    {
      taxName: "State Tax",
      locale: "California",
      rate: "7.25%",
      description: "California state tax",
      payType: "Up Front",
      applicability: "Vehicle Price"
    }
  ];

  const handleAddTaxClick = () => {
    setShowAddTaxModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddTax) {
      onAddTax(newTaxData);
    } else {
      toast.success("New tax has been added");
      setShowAddTaxModal(false);
    }
    // Reset form
    setNewTaxData({
      taxName: "",
      locale: "",
      rate: "",
      description: ""
    });
  };

  const handleFilterClick = () => {
    toast.info(`Filter functionality for ${title} activated`);
  };

  const handleSortAscClick = () => {
    toast.info(`Sort ascending for ${title} activated`);
  };

  const handleSortDescClick = () => {
    toast.info(`Sort descending for ${title} activated`);
  };

  return (
    <div className="p-4">
      <SectionHeader 
        title={title} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
      >
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleFilterClick}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" onClick={handleSortAscClick}>
            <ArrowUp className="h-4 w-4 mr-2" />
            Sort Asc
          </Button>
          <Button variant="outline" size="sm" onClick={handleSortDescClick}>
            <ArrowDown className="h-4 w-4 mr-2" />
            Sort Desc
          </Button>
          <Button variant="outline" size="sm" onClick={handleAddTaxClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Tax
          </Button>
        </div>
      </SectionHeader>
      
      {!isCollapsed && (
        <div className="rounded-md border mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tax Name</TableHead>
                <TableHead>Locale</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Pay Type</TableHead>
                <TableHead>Applicability</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxData.map((tax, index) => (
                <TableRow key={index}>
                  <TableCell>{tax.taxName}</TableCell>
                  <TableCell>{tax.locale}</TableCell>
                  <TableCell>{tax.rate}</TableCell>
                  <TableCell>{tax.description}</TableCell>
                  <TableCell>{tax.payType}</TableCell>
                  <TableCell>{tax.applicability}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => toast.info("Edit tax")}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toast.success("Tax copied")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toast.success("Tax deleted")}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Tax Modal */}
      <Dialog open={showAddTaxModal} onOpenChange={setShowAddTaxModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tax</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="taxName" className="text-right">Tax Name</Label>
                <Input
                  id="taxName"
                  value={newTaxData.taxName}
                  onChange={(e) => setNewTaxData({...newTaxData, taxName: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="locale" className="text-right">Locale</Label>
                <Input
                  id="locale"
                  value={newTaxData.locale}
                  onChange={(e) => setNewTaxData({...newTaxData, locale: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rate" className="text-right">Rate (%)</Label>
                <Input
                  id="rate"
                  value={newTaxData.rate}
                  onChange={(e) => setNewTaxData({...newTaxData, rate: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input
                  id="description"
                  value={newTaxData.description}
                  onChange={(e) => setNewTaxData({...newTaxData, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Tax</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaxSection;
