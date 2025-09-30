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

type PricingTypeCategory = 'lenderSpecific' | 'all';

const PricingTypesStep = ({ data, onUpdate }: PricingTypesStepProps) => {
  const { pricingTypes, addPricingType } = usePricingTypes();

  // Modal state for adding new
  const [modalOpen, setModalOpen] = useState(false);
  const [typeCode, setTypeCode] = useState("");
  const [typeName, setTypeName] = useState("");
  const [isLenderSpecific, setIsLenderSpecific] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Separate pricing types by category and filter by selected financial product
  // Only show pricing types if a financial product is selected
  const lenderSpecificTypes = data.financialProduct 
    ? pricingTypes
        .filter(type => type.isLenderSpecific)
        .filter(type => 
          type.financialProducts.length === 0 || 
          type.financialProducts.includes(data.financialProduct)
        )
    : [];
  
  const allPricingTypes = data.financialProduct
    ? pricingTypes
        .filter(type => !type.isLenderSpecific)
        .filter(type => 
          type.financialProducts.length === 0 || 
          type.financialProducts.includes(data.financialProduct)
        )
    : [];

  // Get currently selected types
  const selectedLenderSpecific = data.lenderSpecificPricingTypes || [];
  const selectedAll = data.allPricingTypes || [];

  const handlePricingTypeToggle = (typeCode: string, checked: boolean, category: PricingTypeCategory) => {
    if (category === 'lenderSpecific') {
      const updatedTypes = checked
        ? [...selectedLenderSpecific, typeCode]
        : selectedLenderSpecific.filter(code => code !== typeCode);
      
      // Clear "All Pricing Types" selections when selecting lender-specific
      onUpdate({ 
        lenderSpecificPricingTypes: updatedTypes,
        allPricingTypes: updatedTypes.length > 0 ? [] : selectedAll
      });
    } else {
      const updatedTypes = checked
        ? [...selectedAll, typeCode]
        : selectedAll.filter(code => code !== typeCode);
      
      // Clear "Lender Specific" selections when selecting all
      onUpdate({ 
        allPricingTypes: updatedTypes,
        lenderSpecificPricingTypes: updatedTypes.length > 0 ? [] : selectedLenderSpecific
      });
    }
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
    const ok = await addPricingType(typeCode.trim(), typeName.trim(), undefined, isLenderSpecific);
    setIsSubmitting(false);
    if (!ok) {
      toast.error("That Type Code already exists");
      return;
    }
    setTypeCode("");
    setTypeName("");
    setIsLenderSpecific(true);
    setModalOpen(false);
    toast.success("Pricing Type added successfully");
  };

  const totalSelected = selectedLenderSpecific.length + selectedAll.length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Pricing Types Configuration</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select pricing types for this financial program. You can choose either lender-specific types (with lender column) or universal types (applies to all lenders).
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isLenderSpecific"
                  checked={isLenderSpecific}
                  onCheckedChange={(checked) => setIsLenderSpecific(checked as boolean)}
                />
                <Label htmlFor="isLenderSpecific" className="text-sm cursor-pointer">
                  Lender-Specific (requires lender column in bulletin template)
                </Label>
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

      {/* Lender Specific Pricing Types Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-md font-semibold mb-2">Lender Specific Pricing Types</h4>
          <p className="text-xs text-muted-foreground mb-4">
            These pricing types require lender-specific configuration and will include a Lender column in the bulletin template.
          </p>
        </div>

        {!data.financialProduct ? (
          <div className="text-sm text-muted-foreground italic p-4 border rounded-lg bg-muted/20">
            Please select a Financial Product first
          </div>
        ) : lenderSpecificTypes.length === 0 ? (
          <div className="text-sm text-muted-foreground italic p-4 border rounded-lg bg-muted/20">
            No lender-specific pricing types available for selected financial product
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lenderSpecificTypes.map((type) => (
              <div 
                key={type.typeCode} 
                className={`flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors ${
                  selectedAll.length > 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <Checkbox
                  id={`lender-${type.typeCode}`}
                  checked={selectedLenderSpecific.includes(type.typeCode)}
                  onCheckedChange={(checked) => handlePricingTypeToggle(type.typeCode, checked as boolean, 'lenderSpecific')}
                  disabled={selectedAll.length > 0}
                />
                <div className="flex-1">
                  <Label 
                    htmlFor={`lender-${type.typeCode}`} 
                    className={`text-sm font-medium ${selectedAll.length > 0 ? '' : 'cursor-pointer'}`}
                  >
                    {type.typeCode}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {type.typeName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Pricing Types Section */}
      <div className="space-y-4">
        <div>
          <h4 className="text-md font-semibold mb-2">All Pricing Types</h4>
          <p className="text-xs text-muted-foreground mb-4">
            These pricing types apply to all lenders universally and will NOT include a Lender column in the bulletin template.
          </p>
        </div>

        {!data.financialProduct ? (
          <div className="text-sm text-muted-foreground italic p-4 border rounded-lg bg-muted/20">
            Please select a Financial Product first
          </div>
        ) : allPricingTypes.length === 0 ? (
          <div className="text-sm text-muted-foreground italic p-4 border rounded-lg bg-muted/20">
            No universal pricing types available for selected financial product
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allPricingTypes.map((type) => (
              <div 
                key={type.typeCode} 
                className={`flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors ${
                  selectedLenderSpecific.length > 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <Checkbox
                  id={`all-${type.typeCode}`}
                  checked={selectedAll.includes(type.typeCode)}
                  onCheckedChange={(checked) => handlePricingTypeToggle(type.typeCode, checked as boolean, 'all')}
                  disabled={selectedLenderSpecific.length > 0}
                />
                <div className="flex-1">
                  <Label 
                    htmlFor={`all-${type.typeCode}`} 
                    className={`text-sm font-medium ${selectedLenderSpecific.length > 0 ? '' : 'cursor-pointer'}`}
                  >
                    {type.typeCode}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {type.typeName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalSelected > 0 && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-800">
            <strong>Selected Pricing Types:</strong> {totalSelected} type(s)
          </p>
          {selectedLenderSpecific.length > 0 && (
            <div className="text-xs text-purple-700 mt-2">
              <strong>Lender-Specific:</strong> {selectedLenderSpecific.join(", ")}
            </div>
          )}
          {selectedAll.length > 0 && (
            <div className="text-xs text-purple-700 mt-2">
              <strong>Universal (All Lenders):</strong> {selectedAll.join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PricingTypesStep;
