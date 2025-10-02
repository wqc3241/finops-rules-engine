import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SetupAndProgramsStep from './WizardSteps/SetupAndProgramsStep';
import ConfigurationAndDetailsStep from './WizardSteps/ConfigurationAndDetailsStep';
import OfferConfirmationStep from './WizardSteps/OfferConfirmationStep';
import { AdvertisedOfferWizardData, AdvertisedOffer } from '@/types/advertisedOffer';
import { useAdvertisedOffers } from '@/hooks/useAdvertisedOffers';
import { toast } from 'sonner';

interface AdvertisedOffersWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editOffer?: AdvertisedOffer | null;
  isEditMode?: boolean;
}

const STEPS = [
  { id: 1, title: 'Setup & Programs', component: SetupAndProgramsStep },
  { id: 2, title: 'Configuration & Details', component: ConfigurationAndDetailsStep },
  { id: 3, title: 'Review & Confirm', component: OfferConfirmationStep },
];

const AdvertisedOffersWizard = ({ open, onOpenChange, editOffer, isEditMode = false }: AdvertisedOffersWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<AdvertisedOfferWizardData>({
    offer_start_date: '',
    offer_end_date: '',
    selected_programs: [],
    program_configs: {},
    offer_details: {}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createOffers, updateOffer } = useAdvertisedOffers();

  // Pre-populate data when editing
  useEffect(() => {
    if (isEditMode && editOffer && open) {
      setWizardData({
        offer_start_date: editOffer.offer_start_date,
        offer_end_date: editOffer.offer_end_date,
        selected_programs: [editOffer.financial_program_code],
        program_configs: {
          [editOffer.financial_program_code]: {
            financial_program_code: editOffer.financial_program_code,
            order_type: editOffer.order_type,
            term: editOffer.term,
            down_payment: editOffer.down_payment,
            credit_score_min: editOffer.credit_score_min,
            credit_score_max: editOffer.credit_score_max,
            annual_mileage: editOffer.annual_mileage,
          }
        },
        offer_details: {
          [editOffer.financial_program_code]: {
            offer_name: editOffer.offer_name,
            marketing_description: editOffer.marketing_description,
            disclosure: editOffer.disclosure,
            monthly_payment: editOffer.monthly_payment,
            apr: editOffer.apr,
            loan_amount_per_10k: editOffer.loan_amount_per_10k,
            total_cost_of_credit: editOffer.total_cost_of_credit,
            lender: editOffer.lender,
          }
        }
      });
    } else if (!open) {
      resetWizard();
    }
  }, [isEditMode, editOffer, open]);

  const CurrentStepComponent = STEPS[currentStep - 1].component;
  const progress = (currentStep / STEPS.length) * 100;

  const handleUpdate = (updates: Partial<AdvertisedOfferWizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        // Step 1: Setup & Programs - require dates and at least one selected program
        return wizardData.offer_start_date && wizardData.offer_end_date && wizardData.selected_programs.length > 0;
      case 2:
        // Step 2: Configuration & Details - require all programs configured
        return Object.keys(wizardData.program_configs).length === wizardData.selected_programs.length &&
               Object.keys(wizardData.offer_details).length > 0;
      case 3:
        // Step 3: Review & Confirm
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (isEditMode && editOffer) {
        // Update existing offer
        const programCode = wizardData.selected_programs[0];
        const config = wizardData.program_configs[programCode];
        const details = wizardData.offer_details[programCode] || {};

        await updateOffer(editOffer.id, {
          offer_name: details.offer_name || `${programCode} - ${config.order_type} - ${config.term}mo`,
          financial_program_code: programCode,
          lender: details.lender,
          order_type: config.order_type,
          term: config.term,
          down_payment: config.down_payment,
          credit_score_min: config.credit_score_min,
          credit_score_max: config.credit_score_max,
          annual_mileage: config.annual_mileage,
          monthly_payment: details.monthly_payment,
          apr: details.apr,
          loan_amount_per_10k: details.loan_amount_per_10k,
          total_cost_of_credit: details.total_cost_of_credit,
          disclosure: details.disclosure,
          marketing_description: details.marketing_description,
          offer_start_date: wizardData.offer_start_date,
          offer_end_date: wizardData.offer_end_date,
        });
      } else {
        // Create new offers
        const offersToCreate = wizardData.selected_programs.map(programCode => {
          const config = wizardData.program_configs[programCode];
          const details = wizardData.offer_details[programCode] || {};

          return {
            offer_name: details.offer_name || `${programCode} - ${config.order_type} - ${config.term}mo`,
            financial_program_code: programCode,
            lender: details.lender,
            order_type: config.order_type,
            term: config.term,
            down_payment: config.down_payment,
            credit_score_min: config.credit_score_min,
            credit_score_max: config.credit_score_max,
            annual_mileage: config.annual_mileage,
            monthly_payment: details.monthly_payment,
            apr: details.apr,
            loan_amount_per_10k: details.loan_amount_per_10k,
            total_cost_of_credit: details.total_cost_of_credit,
            disclosure: details.disclosure,
            marketing_description: details.marketing_description,
            offer_start_date: wizardData.offer_start_date,
            offer_end_date: wizardData.offer_end_date,
            is_active: true
          };
        });

        await createOffers(offersToCreate);
      }
      
      onOpenChange(false);
      resetWizard();
    } catch (error) {
      console.error('Error saving offers:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setWizardData({
      offer_start_date: '',
      offer_end_date: '',
      selected_programs: [],
      program_configs: {},
      offer_details: {}
    });
  };

  const handleClose = () => {
    if (currentStep > 1) {
      if (confirm('Are you sure you want to close? All progress will be lost.')) {
        resetWizard();
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditMode ? 'Edit Advertised Offer' : 'Create Advertised Offers'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {STEPS.length}</span>
              <span>{STEPS[currentStep - 1].title}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            <CurrentStepComponent 
              data={wizardData} 
              onUpdate={handleUpdate}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canProceed()}
                >
                  {isSubmitting 
                    ? (isEditMode ? 'Updating...' : 'Creating...') 
                    : (isEditMode ? 'Update Offer' : 'Create Offers')
                  }
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvertisedOffersWizard;
