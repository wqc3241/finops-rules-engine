
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import VehicleSelectionStep from "./WizardSteps/VehicleSelectionStep";
import FinancialProductStep from "./WizardSteps/FinancialProductStep";
import PricingTypesStep from "./WizardSteps/PricingTypesStep";
import CreditProfileStep from "./WizardSteps/CreditProfileStep";
import PricingConfigStep from "./WizardSteps/PricingConfigStep";
import ProgramDateStep from "./WizardSteps/ProgramDateStep";
import LenderGeoStep from "./WizardSteps/LenderGeoStep";
import ConfirmationStep from "./WizardSteps/ConfirmationStep";

export interface WizardData {
  vehicleStyleId: string;
  vehicleCondition: string;
  financialProducts: string[];
  pricingTypes: string[];
  creditProfile: any;
  pricingConfig: any;
  programStartDate: string;
  programEndDate: string;
  lenders: string[];
  geoCodes: string[];
  programCode?: string;
}

interface FinancialProgramWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (data: WizardData) => void;
}

const WIZARD_STEPS = [
  { id: 1, title: "Vehicle Selection", description: "Select vehicle style and condition" },
  { id: 2, title: "Financial Product", description: "Choose financial products" },
  { id: 3, title: "Pricing Types", description: "Select available pricing types" },
  { id: 4, title: "Credit Profile", description: "Configure credit profile" },
  { id: 5, title: "Pricing Config", description: "Set up pricing configuration" },
  { id: 6, title: "Program Dates", description: "Define program date range" },
  { id: 7, title: "Lender & Geography", description: "Select lenders and geo codes" },
  { id: 8, title: "Confirmation", description: "Review and confirm" }
];

const FinancialProgramWizard = ({ open, onOpenChange, onComplete }: FinancialProgramWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    vehicleStyleId: "",
    vehicleCondition: "",
    financialProducts: [],
    pricingTypes: [],
    creditProfile: null,
    pricingConfig: null,
    programStartDate: "",
    programEndDate: "",
    lenders: [],
    geoCodes: []
  });

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return wizardData.vehicleStyleId && wizardData.vehicleCondition;
      case 2:
        return wizardData.financialProducts.length > 0;
      case 3:
        return wizardData.pricingTypes.length > 0;
      case 4:
        return wizardData.creditProfile !== null;
      case 5:
        return wizardData.pricingConfig !== null;
      case 6:
        return wizardData.programStartDate && wizardData.programEndDate;
      case 7:
        return wizardData.lenders.length > 0 && wizardData.geoCodes.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceed()) {
      if (currentStep < WIZARD_STEPS.length) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error("Please complete all required fields before proceeding.");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const programCode = generateProgramCode(wizardData);
    const finalData = { ...wizardData, programCode };
    onComplete(finalData);
    onOpenChange(false);
    toast.success("Financial program created successfully!");
  };

  const generateProgramCode = (data: WizardData): string => {
    const productCode = data.financialProducts[0]?.substring(0, 3) || "FIN";
    const vehicleCode = data.vehicleStyleId.substring(0, 3) || "VEH";
    const dateCode = new Date().getFullYear().toString().substring(2);
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${productCode}${vehicleCode}${dateCode}${randomSuffix}`;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <VehicleSelectionStep data={wizardData} onUpdate={updateWizardData} />;
      case 2:
        return <FinancialProductStep data={wizardData} onUpdate={updateWizardData} />;
      case 3:
        return <PricingTypesStep data={wizardData} onUpdate={updateWizardData} />;
      case 4:
        return <CreditProfileStep data={wizardData} onUpdate={updateWizardData} />;
      case 5:
        return <PricingConfigStep data={wizardData} onUpdate={updateWizardData} />;
      case 6:
        return <ProgramDateStep data={wizardData} onUpdate={updateWizardData} />;
      case 7:
        return <LenderGeoStep data={wizardData} onUpdate={updateWizardData} />;
      case 8:
        return <ConfirmationStep data={wizardData} onUpdate={updateWizardData} />;
      default:
        return null;
    }
  };

  const progress = (currentStep / WIZARD_STEPS.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Financial Program - Step {currentStep} of {WIZARD_STEPS.length}</DialogTitle>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              {WIZARD_STEPS[currentStep - 1]?.description}
            </p>
          </div>
        </DialogHeader>

        <div className="py-6">
          {renderCurrentStep()}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {currentStep < WIZARD_STEPS.length ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                Create Program
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FinancialProgramWizard;
