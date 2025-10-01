// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdvertisedOfferWizardData, AdvertisedOfferConfig } from '@/types/advertisedOffer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

interface ProgramConfigurationStepProps {
  data: AdvertisedOfferWizardData;
  onUpdate: (updates: Partial<AdvertisedOfferWizardData>) => void;
}

interface ProgramMetadata {
  orderTypes: string[];
  minTerm: number;
  maxTerm: number;
  isLease: boolean;
  creditScoreRanges: { min: number; max: number }[];
}

const ProgramConfigurationStep = ({ data, onUpdate }: ProgramConfigurationStepProps) => {
  const [programMetadata, setProgramMetadata] = useState<Record<string, ProgramMetadata>>({});

  useEffect(() => {
    fetchProgramMetadata();
  }, [data.selected_programs]);

  const fetchProgramMetadata = async () => {
    const metadata: Record<string, ProgramMetadata> = {};

    for (const programCode of data.selected_programs) {
      try {
        const programResult: any = await supabase
          .from('financial_program_configs')
          .select('*')
          .eq('program_code', programCode)
          .maybeSingle();
        const programData = programResult.data;

        if (programData) {
          const orderTypes = programData.order_types ? programData.order_types.split(', ') : ['INV'];
          
          const pricingResult: any = await supabase
            .from('pricing_configs')
            .select('min_term, max_term')
            .eq('financial_program_code', programCode)
            .limit(1)
            .maybeSingle();
          const pricingData = pricingResult.data;

          const creditResult: any = await supabase
            .from('credit_profiles')
            .select('min_credit_score, max_credit_score')
            .order('min_credit_score', { ascending: true });
          const creditData = creditResult.data || [];

          metadata[programCode] = {
            orderTypes,
            minTerm: pricingData?.min_term || 12,
            maxTerm: pricingData?.max_term || 84,
            isLease: programData.financial_product_id?.toLowerCase().includes('lease') || false,
            creditScoreRanges: creditData.map((c: any) => ({
              min: c.min_credit_score,
              max: c.max_credit_score
            }))
          };
        }
      } catch (error) {
        console.error(`Error fetching metadata for ${programCode}:`, error);
      }
    }

    setProgramMetadata(metadata);
  };

  const handleConfigUpdate = (programCode: string, field: string, value: any) => {
    const currentConfig = data.program_configs[programCode] || {
      financial_program_code: programCode,
      order_type: '',
      term: 0
    };

    const newConfig: any = { ...currentConfig };
    newConfig[field] = value;

    const updatedConfigs: Record<string, AdvertisedOfferConfig> = {
      ...data.program_configs,
      [programCode]: newConfig
    };

    onUpdate({ program_configs: updatedConfigs });
  };

  const getAvailableTerms = (programCode: string) => {
    const meta = programMetadata[programCode];
    if (!meta) return [];

    const terms = [];
    for (let term = meta.minTerm; term <= meta.maxTerm; term += 12) {
      terms.push(term);
    }
    return terms;
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Configure offer details for each selected program
      </p>

      <Accordion type="multiple" className="space-y-2">
        {data.selected_programs.map((programCode) => {
          const config = data.program_configs[programCode];
          const meta = programMetadata[programCode];
          const isConfigured = config && config.order_type && config.term;

          return (
            <AccordionItem key={programCode} value={programCode}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="font-medium">{programCode}</span>
                  {isConfigured ? (
                    <Badge variant="default">Configured</Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order Type */}
                    <div className="space-y-2">
                      <Label>Order Type *</Label>
                      <Select
                        value={config?.order_type || ''}
                        onValueChange={(value) => handleConfigUpdate(programCode, 'order_type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select order type" />
                        </SelectTrigger>
                        <SelectContent>
                          {meta?.orderTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Term */}
                    <div className="space-y-2">
                      <Label>Term (months) *</Label>
                      <Select
                        value={config?.term?.toString() || ''}
                        onValueChange={(value) => handleConfigUpdate(programCode, 'term', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select term" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableTerms(programCode).map((term) => (
                            <SelectItem key={term} value={term.toString()}>{term} months</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Down Payment */}
                    <div className="space-y-2">
                      <Label>Down Payment ($)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={config?.down_payment || ''}
                        onChange={(e) => handleConfigUpdate(programCode, 'down_payment', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    {/* Credit Score Range */}
                    <div className="space-y-2">
                      <Label>Credit Score Range</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={config?.credit_score_min || ''}
                          onChange={(e) => handleConfigUpdate(programCode, 'credit_score_min', parseInt(e.target.value) || undefined)}
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={config?.credit_score_max || ''}
                          onChange={(e) => handleConfigUpdate(programCode, 'credit_score_max', parseInt(e.target.value) || undefined)}
                        />
                      </div>
                    </div>

                    {/* Annual Mileage (Lease only) */}
                    {meta?.isLease && (
                      <div className="space-y-2">
                        <Label>Annual Mileage</Label>
                        <Input
                          type="number"
                          placeholder="12000"
                          value={config?.annual_mileage || ''}
                          onChange={(e) => handleConfigUpdate(programCode, 'annual_mileage', parseInt(e.target.value) || undefined)}
                        />
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

export default ProgramConfigurationStep;
