import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { WizardData } from "../FinancialProgramWizard";
import { useState } from "react";
import { usePricingTypes } from "@/hooks/usePricingTypes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PricingTypesStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

const PricingTypesStep = ({ data, onUpdate }: PricingTypesStepProps) => {
  const { pricingTypes, addPricingType } = usePricingTypes();

  // Modal state for adding new
  const [modalOpen, setModalOpen] = useState(false);
  const [typeCode, setTypeCode] = useState("");
  const [typeName, setTypeName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePricingTypeToggle = (typeCode: string, checked: boolean) => {
    const updatedTypes = checked
      ? [...data.pricingTypes, typeCode]
      : data.pricingTypes.filter(code => code !== typeCode);
    
    onUpdate({ pricingTypes: updatedTypes });
  };

  // Handle add new pricing type
  const handleAddNewPricingType = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!typeCode.trim()) {
      toast.error("Type Code is required");
      return;
    }
    if (!typeName.trim()) {
      toast.error("Type Name is required");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const ok = addPricingType(typeCode.trim(), typeName.trim());
      setIsSubmitting(false);
      if (!ok) {
        toast.error("That Type Code already exists");
        return;
      }
      setTypeCode("");
      setTypeName("");
      setModalOpen(false);
      toast.success("Pricing Type added successfully");
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Pricing Types</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select the pricing types that will be available for this financial program.
        </p>
      </div>

      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          onClick={() => setModalOpen(true)}
          size="sm"
        >
          + Add Pricing Type
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Pricing Type</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddNewPricingType}>
            <div className="grid gap-4 py-2">
              <div>
                <Label htmlFor="typeCode">Type Code</Label>
                <Input 
                  id="typeCode"
                  value={typeCode}
                  onChange={e => setTypeCode(e.target.value)}
                  maxLength={10}
                  placeholder="Enter type code"
                />
              </div>
              <div>
                <Label htmlFor="typeName">Type Name</Label>
                <Input 
                  id="typeName"
                  value={typeName}
                  onChange={e => setTypeName(e.target.value)}
                  placeholder="Enter type name"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Pricing Type"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pricingTypes.map((type) => (
          <div key={type.typeCode} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
            <Checkbox
              id={type.typeCode}
              checked={data.pricingTypes.includes(type.typeCode)}
              onCheckedChange={(checked) => handlePricingTypeToggle(type.typeCode, checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor={type.typeCode} className="text-sm font-medium cursor-pointer">
                {type.typeCode}
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                {type.typeName}
              </p>
            </div>
            {!type.isLenderSpecific && (
              <span className="text-sm text-green-600 self-center">Universal</span>
            )}
          </div>
        ))}
      </div>

      {data.pricingTypes.length > 0 && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-800">
            <strong>Selected Pricing Types:</strong> {data.pricingTypes.length} type(s)
          </p>
          <div className="text-xs text-purple-700 mt-2">
            {data.pricingTypes.join(", ")}
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingTypesStep;
