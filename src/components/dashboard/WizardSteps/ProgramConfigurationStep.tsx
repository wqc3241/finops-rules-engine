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
import { Calendar, Car, Package, Tag } from 'lucide-react';

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
  vehicleInfo?: {
    make: string;
    model: string;
    year: string;
    trim: string;
  };
  vehicleDisplay?: string;
  productType?: string;
  condition?: string;
  dateRange?: {
    start: string;
    end: string;
  };
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

          // Fetch product type
          let productType = 'N/A';
          if (programData.financial_product_id) {
            const productResult: any = await supabase
              .from('financial_products')
              .select('product_type')
              .eq('product_id', programData.financial_product_id)
              .maybeSingle();
            productType = productResult.data?.product_type || 'N/A';
            console.log('Product type lookup for', programData.financial_product_id, ':', productResult.data);
          }

          // Fetch vehicle information
          let vehicleInfo = { make: 'N/A', model: 'N/A', year: 'N/A', trim: 'N/A' };
          let vehicleDisplay = 'N/A';
          if (programData.vehicle_style_id) {
            const vehicleResult: any = await supabase
              .from('vehicle_style_coding')
              .select('make, model, model_year, trim')
              .eq('vehicle_style_id', programData.vehicle_style_id)
              .maybeSingle();
            console.log('Vehicle lookup for', programData.vehicle_style_id, ':', vehicleResult.data);
            if (vehicleResult.data) {
              const parts = [];
              if (vehicleResult.data.model_year) parts.push(vehicleResult.data.model_year.toString());
              if (vehicleResult.data.make) parts.push(vehicleResult.data.make);
              if (vehicleResult.data.model) parts.push(vehicleResult.data.model);
              if (vehicleResult.data.trim) parts.push(vehicleResult.data.trim);
              vehicleDisplay = parts.length > 0 ? parts.join(' ') : 'N/A';
              
              vehicleInfo = {
                make: vehicleResult.data.make || 'N/A',
                model: vehicleResult.data.model || 'N/A',
                year: vehicleResult.data.model_year?.toString() || 'N/A',
                trim: vehicleResult.data.trim || 'N/A'
              };
            }
          }

          // Fetch vehicle condition
          let condition = programData.financing_vehicle_condition || 'N/A';
          if (programData.financing_vehicle_condition) {
            const conditionResult: any = await supabase
              .from('vehicle_conditions')
              .select('advertised_condition')
              .eq('type', programData.financing_vehicle_condition)
              .maybeSingle();
            condition = conditionResult.data?.advertised_condition || programData.financing_vehicle_condition;
            console.log('Condition lookup for', programData.financing_vehicle_condition, ':', conditionResult.data);
          }

          // Format date range
          const dateRange = {
            start: programData.program_start_date || 'N/A',
            end: programData.program_end_date || 'N/A'
          };

          metadata[programCode] = {
            orderTypes,
            minTerm: pricingData?.min_term || 12,
            maxTerm: pricingData?.max_term || 84,
            isLease: programData.financial_product_id?.toLowerCase().includes('lease') || false,
            creditScoreRanges: creditData.map((c: any) => ({
              min: c.min_credit_score,
              max: c.max_credit_score
            })),
            vehicleInfo,
            vehicleDisplay,
            productType,
            condition,
            dateRange
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
                {/* Combined Program Information and Configuration */}
                <Card className="p-6">
                  {meta && (
                    <div className="mb-6 pb-6 border-b">
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Vehicle:</span>
                          <span className="font-medium">{meta.vehicleDisplay}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Product:</span>
                          <Badge variant="secondary">{meta.productType}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Condition:</span>
                          <Badge variant="outline">{meta.condition}</Badge>
                        </div>
                        
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Period:</span>
                        <span className="font-medium">
                          {meta.dateRange?.start ? new Date(meta.dateRange.start + 'T00:00:00').toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          }) : 'N/A'}
                          {' - '}
                          {meta.dateRange?.end ? new Date(meta.dateRange.end + 'T00:00:00').toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          }) : 'N/A'}
                        </span>
                      </div>
                      </div>
                    </div>
                  )}

                  {/* Configuration Fields */}
                  <div>
                    <h3 className="text-sm font-semibold mb-4">Offer Configuration</h3>
                    <div className="space-y-4">
                      {/* Order Type and Term in one row */}
                      <div className="grid grid-cols-2 gap-4">
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
                      </div>

                      {/* Down Payment and Credit Score in one row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Down Payment ($)</Label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={config?.down_payment || ''}
                            onChange={(e) => handleConfigUpdate(programCode, 'down_payment', parseFloat(e.target.value) || 0)}
                          />
                        </div>

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
