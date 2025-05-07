
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Copy, Trash2, Plus, Filter, ArrowUp, ArrowDown } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface FeeSectionProps {
  title: string;
  showAddFeeModal?: boolean;
  setShowAddFeeModal?: (show: boolean) => void;
  onAddFee?: (feeData: any) => void;
}

const FeeSection = ({ 
  title, 
  showAddFeeModal = false, 
  setShowAddFeeModal = () => {}, 
  onAddFee 
}: FeeSectionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [newFeeData, setNewFeeData] = useState({
    feeName: "",
    provider: "",
    feeType: "",
    amount: ""
  });
  
  const feeData = [
    {
      feeName: "Other Fees",
      provider: "",
      feeType: "",
      category: "",
      subCategory: "",
      taxable: "",
      payType: "",
      selfRegistration: "",
      description: "",
      vehicle: "",
      amount: "1500",
      rate: "",
      localePreference: "",
      capitalizationPreference: ""
    }
  ];

  const handleAddFeeClick = () => {
    setShowAddFeeModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddFee) {
      onAddFee(newFeeData);
    } else {
      toast.success("New fee has been added");
      setShowAddFeeModal(false);
    }
    // Reset form
    setNewFeeData({
      feeName: "",
      provider: "",
      feeType: "",
      amount: ""
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
          <Button variant="outline" size="sm" onClick={handleAddFeeClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Fee
          </Button>
        </div>
      </SectionHeader>
      
      {!isCollapsed && (
        <div className="rounded-md border mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fee Name</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Fee type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Sub-Category</TableHead>
                <TableHead>Taxable</TableHead>
                <TableHead>Pay Type</TableHead>
                <TableHead>Self Registration</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Locale Preference</TableHead>
                <TableHead>Capitalization Preference</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeData.map((fee, index) => (
                <TableRow key={index}>
                  <TableCell>{fee.feeName}</TableCell>
                  <TableCell>{fee.provider}</TableCell>
                  <TableCell>{fee.feeType}</TableCell>
                  <TableCell>{fee.category}</TableCell>
                  <TableCell>{fee.subCategory}</TableCell>
                  <TableCell>{fee.taxable}</TableCell>
                  <TableCell>{fee.payType}</TableCell>
                  <TableCell>{fee.selfRegistration}</TableCell>
                  <TableCell>{fee.description}</TableCell>
                  <TableCell>{fee.vehicle}</TableCell>
                  <TableCell>{fee.amount}</TableCell>
                  <TableCell>{fee.rate}</TableCell>
                  <TableCell>{fee.localePreference}</TableCell>
                  <TableCell>{fee.capitalizationPreference}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => toast.info("Edit fee")}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toast.success("Fee copied")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toast.success("Fee deleted")}>
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

      {/* Add Fee Modal */}
      <Dialog open={showAddFeeModal} onOpenChange={setShowAddFeeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Fee</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="feeName" className="text-right">Fee Name</Label>
                <Input
                  id="feeName"
                  value={newFeeData.feeName}
                  onChange={(e) => setNewFeeData({...newFeeData, feeName: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="provider" className="text-right">Provider</Label>
                <Input
                  id="provider"
                  value={newFeeData.provider}
                  onChange={(e) => setNewFeeData({...newFeeData, provider: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="feeType" className="text-right">Fee Type</Label>
                <Input
                  id="feeType"
                  value={newFeeData.feeType}
                  onChange={(e) => setNewFeeData({...newFeeData, feeType: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newFeeData.amount}
                  onChange={(e) => setNewFeeData({...newFeeData, amount: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Fee</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeeSection;
