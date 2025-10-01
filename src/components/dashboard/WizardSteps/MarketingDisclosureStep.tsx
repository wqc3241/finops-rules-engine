import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AdvertisedOfferWizardData } from '@/types/advertisedOffer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText } from 'lucide-react';

interface MarketingDisclosureStepProps {
  data: AdvertisedOfferWizardData;
  onUpdate: (updates: Partial<AdvertisedOfferWizardData>) => void;
}

const MarketingDisclosureStep = ({ data, onUpdate }: MarketingDisclosureStepProps) => {
  const handleOfferDetailUpdate = (programCode: string, field: string, value: string) => {
    const currentDetails = data.offer_details[programCode] || {};
    const updatedDetails = {
      ...data.offer_details,
      [programCode]: {
        ...currentDetails,
        [field]: value
      }
    };
    onUpdate({ offer_details: updatedDetails });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-4">
        <FileText className="w-5 h-5" />
        <p>Add marketing descriptions and disclosures for each offer</p>
      </div>

      <Accordion type="multiple" className="space-y-2">
        {data.selected_programs.map((programCode) => {
          const details = data.offer_details[programCode] || {};

          return (
            <AccordionItem key={programCode} value={programCode}>
              <AccordionTrigger className="hover:no-underline">
                <span className="font-medium">{programCode}</span>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="p-6">
                  <div className="space-y-6">
                    {/* Marketing Description */}
                    <div className="space-y-2">
                      <Label htmlFor={`marketing-${programCode}`}>
                        Marketing Description
                      </Label>
                      <Textarea
                        id={`marketing-${programCode}`}
                        placeholder="Enter a compelling marketing description for this offer..."
                        value={details.marketing_description || ''}
                        onChange={(e) => handleOfferDetailUpdate(programCode, 'marketing_description', e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        This will be displayed to customers promoting the offer
                      </p>
                    </div>

                    {/* Disclosure */}
                    <div className="space-y-2">
                      <Label htmlFor={`disclosure-${programCode}`}>
                        Legal Disclosure
                      </Label>
                      <Textarea
                        id={`disclosure-${programCode}`}
                        placeholder="Enter legal disclosure and terms & conditions..."
                        value={details.disclosure || ''}
                        onChange={(e) => handleOfferDetailUpdate(programCode, 'disclosure', e.target.value)}
                        rows={6}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        Include all required legal disclosures and terms
                      </p>
                    </div>

                    {/* Preview */}
                    {details.marketing_description && (
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Preview</p>
                        <p className="text-sm">{details.marketing_description}</p>
                        {details.disclosure && (
                          <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                            {details.disclosure}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default MarketingDisclosureStep;
