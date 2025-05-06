
import * as React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AddPricingTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPricingType: (typeCode: string, typeName: string) => void;
}

const AddPricingTypeModal = ({
  open,
  onOpenChange,
  onAddPricingType,
}: AddPricingTypeModalProps) => {
  const [typeCode, setTypeCode] = useState("");
  const [typeName, setTypeName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!typeCode.trim()) {
      toast.error("Type Code is required");
      return;
    }
    
    if (!typeName.trim()) {
      toast.error("Type Name is required");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onAddPricingType(typeCode, typeName);
      setIsSubmitting(false);
      
      // Reset form
      setTypeCode("");
      setTypeName("");
      
      // Close modal
      onOpenChange(false);
      
      toast.success("Pricing Type added successfully");
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Pricing Type</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="typeCode">Type Code</Label>
              <Input
                id="typeCode"
                placeholder="Enter type code"
                value={typeCode}
                onChange={(e) => setTypeCode(e.target.value)}
                maxLength={10}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="typeName">Type Name</Label>
              <Input
                id="typeName"
                placeholder="Enter type name"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Pricing Type"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPricingTypeModal;
