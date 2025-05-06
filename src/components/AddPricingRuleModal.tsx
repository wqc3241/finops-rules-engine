
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent } from "react";
import { toast } from "sonner";

interface PricingRuleData {
  programName: string;
  programType: string;
  term: number;
  buyRate: number;
  maxMarkup: number;
  dealerDiscount: number;
  programFee: number;
}

interface AddPricingRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PricingRuleData) => void;
}

const AddPricingRuleModal = ({ isOpen, onClose, onSave }: AddPricingRuleModalProps) => {
  const [formData, setFormData] = useState<PricingRuleData>({
    programName: "",
    programType: "Loan",
    term: 0,
    buyRate: 0,
    maxMarkup: 0,
    dealerDiscount: 0,
    programFee: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (["term", "buyRate", "maxMarkup", "dealerDiscount", "programFee"].includes(name)) {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.programName) {
      toast.error("Program Name is required");
      return;
    }
    
    onSave(formData);
    toast.success("Pricing rule added successfully!");
    onClose();
    
    // Reset form
    setFormData({
      programName: "",
      programType: "Loan",
      term: 0,
      buyRate: 0,
      maxMarkup: 0,
      dealerDiscount: 0,
      programFee: 0
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Pricing Rule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label htmlFor="programName">Program Name</Label>
              <Input 
                id="programName" 
                name="programName"
                value={formData.programName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="programType">Program Type</Label>
              <select 
                id="programType"
                name="programType"
                value={formData.programType}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                required
              >
                <option value="Loan">Loan</option>
                <option value="Lease">Lease</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="term">Term (months)</Label>
              <Input 
                id="term" 
                name="term"
                type="number"
                min="0"
                value={formData.term}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="buyRate">Buy Rate (%)</Label>
              <Input 
                id="buyRate" 
                name="buyRate"
                type="number"
                min="0"
                step="0.1"
                value={formData.buyRate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="maxMarkup">Max Markup (%)</Label>
              <Input 
                id="maxMarkup" 
                name="maxMarkup"
                type="number"
                min="0"
                step="0.1"
                value={formData.maxMarkup}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="dealerDiscount">Dealer Discount (%)</Label>
              <Input 
                id="dealerDiscount" 
                name="dealerDiscount"
                type="number"
                min="0"
                step="0.1"
                value={formData.dealerDiscount}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="programFee">Program Fee ($)</Label>
              <Input 
                id="programFee" 
                name="programFee"
                type="number"
                min="0"
                value={formData.programFee}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Rule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPricingRuleModal;
