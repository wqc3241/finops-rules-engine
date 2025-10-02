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
  availableTerms: number[];
  isLease: boolean;
  creditScoreRanges: string[];
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
          // Parse order types from comma-separated string
          const orderTypes = programData.order_types 
            ? programData.order_types.split(',').map((type: string) => type.trim()) 
            : ['INV'];
          
          // Extract pricing configs and credit profiles from template_metadata
          const templateMetadata = programData.template_metadata || {};
          const pricingTypeConfigs = templateMetadata.pricingTypeConfigs || {};
          
          // Collect all unique pricing config IDs
          const pricingConfigIds = new Set<string>();
          const creditProfileIds = new Set<string>();
          
          Object.values(pricingTypeConfigs).forEach((config: any) => {
            if (config.pricingConfigs && Array.isArray(config.pricingConfigs)) {
              config.pricingConfigs.forEach((id: string) => pricingConfigIds.add(id));
            }
            if (config.creditProfiles && Array.isArray(config.creditProfiles)) {
              config.creditProfiles.forEach((id: string) => creditProfileIds.add(id));
            }
          });

          // Fetch all pricing configs to get terms
          let availableTerms: number[] = [];
          if (pricingConfigIds.size > 0) {
            const pricingResult: any = await supabase
              .from('pricing_configs')
              .select('min_term, max_term')
              .in('pricing_rule_id', Array.from(pricingConfigIds));
            
            const termsSet = new Set<number>();
            (pricingResult.data || []).forEach((config: any) => {
              if (config.min_term && config.max_term) {
                for (let term = config.min_term; term <= config.max_term; term += 12) {
                  termsSet.add(term);
                }
              }
            });
            availableTerms = Array.from(termsSet).sort((a, b) => a - b);
          }

          // Fetch all credit profiles to get score ranges
          let creditScoreRanges: string[] = [];
          if (creditProfileIds.size > 0) {
            const creditResult: any = await supabase
              .from('credit_profiles')
              .select('min_credit_score, max_credit_score')
              .in('profile_id', Array.from(creditProfileIds));
            
            const rangesSet = new Set<string>();
            (creditResult.data || []).forEach((profile: any) => {
              if (profile.min_credit_score !== null && profile.max_credit_score !== null) {
                rangesSet.add(`${profile.min_credit_score}-${profile.max_credit_score}`);
              }
            });
            creditScoreRanges = Array.from(rangesSet).sort((a, b) => {
              const [minA] = a.split('-').map(Number);
              const [minB] = b.split('-').map(Number);
              return minA - minB;
            });
          }

          // Fetch product type
          let productType = 'N/A';
          if (programData.financial_product_id) {
            const productResult: any = await supabase
              .from('financial_products')
              .select('product_type')
              .eq('product_id', programData.financial_product_id)
              .maybeSingle();
            productType = productResult.data?.product_type || 'N/A';
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
              .eq('financing_vehicle_condition_type', programData.financing_vehicle_condition)
              .maybeSingle();
            condition = conditionResult.data?.advertised_condition || programData.financing_vehicle_condition;
          }

          // Format date range
          const dateRange = {
            start: programData.program_start_date || 'N/A',
            end: programData.program_end_date || 'N/A'
          };

          metadata[programCode] = {
            orderTypes,
            availableTerms,
            isLease: programData.financial_product_id?.toLowerCase().includes('lease') || false,
            creditScoreRanges,
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
    return meta?.availableTerms || [];
  };

  const getCreditScoreRangeOptions = (programCode: string) => {
    const meta = programMetadata[programCode];
    return meta?.creditScoreRanges || [];
  };

  const getOrderTypeOptions = (programCode: string) => {
    const meta = programMetadata[programCode];
    if (!meta || !meta.orderTypes) return [];

    const orderTypeLabels: Record<string, string> = {
      'INV': 'INV (Inventory)',
      'CON': 'CON (Configurator)'
    };

    const options = meta.orderTypes.map(type => ({
      value: type,
      label: orderTypeLabels[type] || type
    }));

    // Add "Both" option if there are multiple order types
    if (meta.orderTypes.length > 1) {
      options.push({
        value: meta.orderTypes.join(','),
        label: 'Both'
      });
    }

    return options;
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
                    <div className="grid grid-cols-4 gap-4">
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
                            {getOrderTypeOptions(programCode).map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
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
                        <Select
                          value={
                            config?.credit_score_max !== undefined && config?.credit_score_max !== null
                              ? `${config.credit_score_min ?? 0}-${config.credit_score_max}` 
                              : ''
                          }
                          onValueChange={(value) => {
                            const [min, max] = value.split('-').map(Number);
                            handleConfigUpdate(programCode, 'credit_score_min', min);
                            handleConfigUpdate(programCode, 'credit_score_max', max);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent>
                            {getCreditScoreRangeOptions(programCode).map((range) => (
                              <SelectItem key={range} value={range}>
                                {range}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Annual Mileage (Lease only) */}
                    {meta?.isLease && (
                      <div className="mt-4 space-y-2">
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
