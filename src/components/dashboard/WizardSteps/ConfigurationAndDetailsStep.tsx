// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdvertisedOfferWizardData, AdvertisedOfferConfig } from '@/types/advertisedOffer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Calendar, Car, Package, Tag, DollarSign, Percent } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
interface ConfigurationAndDetailsStepProps {
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
  geoCode?: string;
  vehicleYear?: number;
  vehicleModel?: string;
}
const ConfigurationAndDetailsStep = ({
  data,
  onUpdate
}: ConfigurationAndDetailsStepProps) => {
  const [programMetadata, setProgramMetadata] = useState<Record<string, ProgramMetadata>>({});
  const [calculations, setCalculations] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [availableDiscounts, setAvailableDiscounts] = useState<Record<string, any[]>>({});
  useEffect(() => {
    fetchProgramMetadata();
  }, [data.selected_programs]);
  useEffect(() => {
    if (Object.keys(data.program_configs).length > 0) {
      calculateFinancials();
    }
  }, [data.program_configs]);
  useEffect(() => {
    if (Object.keys(programMetadata).length > 0) {
      fetchApplicableDiscounts();
    }
  }, [programMetadata, data.offer_start_date, data.offer_end_date]);
  const fetchProgramMetadata = async () => {
    const metadata: Record<string, ProgramMetadata> = {};
    for (const programCode of data.selected_programs) {
      try {
        const programResult: any = await supabase
          .from('financial_program_configs')
          .select('*')
          .eq('program_code', programCode)
          .maybeSingle();
        
        let programData = programResult.data;
        
        // Manually fetch geo_code from financial_products
        if (programData?.financial_product_id) {
          const productResult = await supabase
            .from('financial_products')
            .select('geo_code')
            .eq('product_id', programData.financial_product_id.trim())
            .maybeSingle();
          
          if (productResult.data) {
            programData.geo_code = productResult.data.geo_code?.trim();
          }
        }
        
        if (programData) {
          const orderTypes = programData.order_types ? programData.order_types.split(',').map((type: string) => type.trim()) : ['INV'];
          const templateMetadata = programData.template_metadata || {};
          const pricingTypeConfigs = templateMetadata.pricingTypeConfigs || {};
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
          let availableTerms: number[] = [];
          if (pricingConfigIds.size > 0) {
            const pricingResult: any = await supabase.from('pricing_configs').select('min_term, max_term').in('pricing_rule_id', Array.from(pricingConfigIds));
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
          let creditScoreRanges: string[] = [];
          if (creditProfileIds.size > 0) {
            const creditResult: any = await supabase.from('credit_profiles').select('min_credit_score, max_credit_score').in('profile_id', Array.from(creditProfileIds));
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
          let productType = 'N/A';
          if (programData.financial_product_id) {
            // Trim the product ID in case it has whitespace/newlines
            const productId = programData.financial_product_id.trim();
            console.log('Fetching product type for:', productId);
            
            const productResult: any = await supabase
              .from('financial_products')
              .select('product_type')
              .eq('product_id', productId)
              .maybeSingle();
            
            console.log('Product result:', productResult);
            
            if (productResult.error) {
              console.error('Error fetching product:', productResult.error);
            }
            
            // Trim whitespace/newlines from product_type as well
            productType = productResult.data?.product_type?.trim() || 'N/A';
            console.log('Final productType:', productType);
          }
          let vehicleDisplay = 'N/A';
          if (programData.vehicle_style_id) {
            const vehicleResult: any = await supabase.from('vehicle_style_coding').select('make, model, model_year, trim').eq('vehicle_style_id', programData.vehicle_style_id).maybeSingle();
            if (vehicleResult.data) {
              const parts = [];
              if (vehicleResult.data.model_year) parts.push(vehicleResult.data.model_year.toString());
              if (vehicleResult.data.make) parts.push(vehicleResult.data.make);
              if (vehicleResult.data.model) parts.push(vehicleResult.data.model);
              if (vehicleResult.data.trim) parts.push(vehicleResult.data.trim);
              vehicleDisplay = parts.length > 0 ? parts.join(' ') : 'N/A';
            }
          }
          let condition = programData.financing_vehicle_condition || 'N/A';
          if (programData.financing_vehicle_condition) {
            const conditionResult: any = await supabase.from('vehicle_conditions').select('advertised_condition').eq('financing_vehicle_condition_type', programData.financing_vehicle_condition).maybeSingle();
            condition = conditionResult.data?.advertised_condition || programData.financing_vehicle_condition;
          }
          const dateRange = {
            start: programData.program_start_date || 'N/A',
            end: programData.program_end_date || 'N/A'
          };

          // Extract vehicle year and model for discount filtering
          let vehicleYear: number | undefined;
          let vehicleModel: string | undefined;
          if (programData.vehicle_style_id) {
            const vehicleResult: any = await supabase.from('vehicle_style_coding').select('model, model_year').eq('vehicle_style_id', programData.vehicle_style_id).maybeSingle();
            vehicleYear = vehicleResult.data?.model_year;
            vehicleModel = vehicleResult.data?.model;
          }
          metadata[programCode] = {
            orderTypes,
            availableTerms,
            isLease: programData.financial_product_id?.toLowerCase().includes('lease') || false,
            creditScoreRanges,
            vehicleDisplay,
            productType,
            condition,
            dateRange,
            geoCode: programData.geo_code,
            vehicleYear,
            vehicleModel
          };
        }
      } catch (error) {
        console.error(`Error fetching metadata for ${programCode}:`, error);
      }
    }
    setProgramMetadata(metadata);
  };
  const fetchApplicableDiscounts = async () => {
    console.log('=== fetchApplicableDiscounts START ===');
    console.log('Selected programs:', data.selected_programs);
    console.log('Program metadata:', programMetadata);
    
    const discounts: Record<string, any[]> = {};
    for (const programCode of data.selected_programs) {
      console.log(`\n--- Processing program: ${programCode} ---`);
      const meta = programMetadata[programCode];
      console.log('Program meta:', meta);
      if (!meta) continue;
      try {
        // Fetch all active discount rules
        const {
          data: allDiscounts,
          error
        } = await supabase.from('discount_rules').select('*').eq('feeActive', true);
        if (error) throw error;
        
        console.log(`Total active discounts fetched: ${allDiscounts?.length || 0}`);
        console.log('All discounts:', allDiscounts);

        // Filter discounts based on matching criteria
        const filtered = (allDiscounts || []).filter((discount: any) => {
          console.log(`\nEvaluating discount: "${discount.name}"`);
          console.log('Discount data:', {
            name: discount.name,
            discount_geo: discount.discount_geo,
            applicable_vehicle_year: discount.applicable_vehicle_year,
            applicable_vehicle_model: discount.applicable_vehicle_model,
            applicable_purchase_type: discount.applicable_purchase_type,
            applicable_title_status: discount.applicable_title_status,
            startDate: discount.startDate,
            endDate: discount.endDate
          });
          
          // Check geo code match
          const geoMatch = !discount.discount_geo || discount.discount_geo === 'ALL' || discount.discount_geo === meta.geoCode;
          console.log(`  Geo match: ${geoMatch} (discount_geo: ${discount.discount_geo}, meta.geoCode: ${meta.geoCode})`);
          if (!geoMatch) return false;

          // Check date range overlap
          const offerStart = new Date(data.offer_start_date);
          const offerEnd = new Date(data.offer_end_date);
          const discountStart = discount.startDate ? new Date(discount.startDate) : null;
          const discountEnd = discount.endDate ? new Date(discount.endDate) : null;
          const dateMatch = (!discountStart || discountStart <= offerEnd) && (!discountEnd || discountEnd >= offerStart);
          console.log(`  Date match: ${dateMatch} (offerStart: ${offerStart}, offerEnd: ${offerEnd}, discountStart: ${discountStart}, discountEnd: ${discountEnd})`);
          if (!dateMatch) return false;

          // Check vehicle year match
          const yearMatch = !discount.applicable_vehicle_year || discount.applicable_vehicle_year.length === 0 || !meta.vehicleYear || discount.applicable_vehicle_year.includes(Number(meta.vehicleYear));
          console.log(`  Year match: ${yearMatch} (applicable_vehicle_year: ${JSON.stringify(discount.applicable_vehicle_year)}, meta.vehicleYear: ${meta.vehicleYear})`);
          if (!yearMatch) return false;

          // Check vehicle model match
          const modelMatch = !discount.applicable_vehicle_model || discount.applicable_vehicle_model.length === 0 || discount.applicable_vehicle_model.includes('All') || !meta.vehicleModel || discount.applicable_vehicle_model.includes(meta.vehicleModel);
          console.log(`  Model match: ${modelMatch} (applicable_vehicle_model: ${JSON.stringify(discount.applicable_vehicle_model)}, meta.vehicleModel: ${meta.vehicleModel})`);
          if (!modelMatch) return false;

          // Check purchase type match (order type)
          const config = data.program_configs[programCode];
          const orderTypes = config?.order_type?.split(',').map(t => t.trim()) || [];
          const purchaseMatch = !discount.applicable_purchase_type || discount.applicable_purchase_type.length === 0 || discount.applicable_purchase_type.includes('All') || orderTypes.some(ot => discount.applicable_purchase_type.includes(ot));
          console.log(`  Purchase match: ${purchaseMatch} (applicable_purchase_type: ${JSON.stringify(discount.applicable_purchase_type)}, orderTypes: ${JSON.stringify(orderTypes)})`);
          if (!purchaseMatch) return false;

          // Check title status match (condition)
          const statusMatch = !discount.applicable_title_status || discount.applicable_title_status.length === 0 || discount.applicable_title_status.includes('All') || meta.condition && discount.applicable_title_status.includes(meta.condition);
          console.log(`  Status match: ${statusMatch} (applicable_title_status: ${JSON.stringify(discount.applicable_title_status)}, meta.condition: ${meta.condition})`);
          if (!statusMatch) return false;
          
          console.log(`  ✓ PASSED ALL FILTERS: ${discount.name}`);
          return true;
        });
        
        console.log(`\nFiltered discounts for ${programCode}:`, filtered);
        console.log(`Total applicable: ${filtered.length}`);
        discounts[programCode] = filtered;
      } catch (error) {
        console.error(`Error fetching discounts for ${programCode}:`, error);
        discounts[programCode] = [];
      }
    }
    
    console.log('\n=== fetchApplicableDiscounts COMPLETE ===');
    console.log('All discounts by program:', discounts);
    setAvailableDiscounts(discounts);
  };
  const calculateFinancials = async () => {
    setLoading(true);
    const newCalculations: Record<string, any> = {};
    try {
      for (const programCode of Object.keys(data.program_configs)) {
        const config = data.program_configs[programCode];

        // Fetch bulletin pricing for calculation
        const {
          data: pricingData
        } = await supabase.from('bulletin_pricing').select('*').eq('financial_program_code', programCode).limit(1).maybeSingle();
        if (pricingData) {
          // Fixed base price for sample calculations
          const basePrice = 70000;
          const downPayment = config.down_payment || 0;
          const financedAmount = basePrice - downPayment;
          
          // Simplified APR calculation
          const apr = 3.99 + Math.random() * 2;
          
          // Calculate monthly payment: financed amount * (1 + apr/100) / term
          const monthlyPayment = (financedAmount * (1 + apr / 100)) / config.term;
          const totalCost = monthlyPayment * config.term;
          
          newCalculations[programCode] = {
            base_price: basePrice,
            monthly_payment: monthlyPayment,
            apr: apr.toFixed(2),
            total_cost_of_credit: totalCost.toFixed(2),
            lender: pricingData.lender_list || 'N/A'
          };
        }
      }
      setCalculations(newCalculations);

      // Update offer_details with calculations
      const updatedDetails = {
        ...data.offer_details
      };
      Object.keys(newCalculations).forEach(programCode => {
        updatedDetails[programCode] = {
          ...(updatedDetails[programCode] || {}),
          ...newCalculations[programCode]
        };
      });
      onUpdate({
        offer_details: updatedDetails
      });
    } catch (error) {
      console.error('Error calculating financials:', error);
    } finally {
      setLoading(false);
    }
  };
const handleConfigUpdate = (programCode: string, field: string | Record<string, any>, value?: any) => {
    const currentConfig = data.program_configs[programCode] || {
      financial_program_code: programCode,
      order_type: '',
      term: 0
    };
    
    // Allow updating multiple fields at once
    const updates = typeof field === 'object' ? field : { [field]: value };
    
    const newConfig: any = {
      ...currentConfig,
      ...updates
    };
    const updatedConfigs: Record<string, AdvertisedOfferConfig> = {
      ...data.program_configs,
      [programCode]: newConfig
    };
    onUpdate({
      program_configs: updatedConfigs
    });
  };
  const handleOfferDetailUpdate = (programCode: string, field: string, value: string) => {
    const currentDetails = data.offer_details[programCode] || {};
    const updatedDetails = {
      ...data.offer_details,
      [programCode]: {
        ...currentDetails,
        [field]: value
      }
    };
    onUpdate({
      offer_details: updatedDetails
    });
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
    if (meta.orderTypes.length > 1) {
      options.push({
        value: meta.orderTypes.join(','),
        label: 'Both'
      });
    }
    return options;
  };
  return <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Configure offers and add financial details for each selected program
      </p>

      <Accordion type="multiple" className="space-y-2">
        {data.selected_programs.map(programCode => {
        const config = data.program_configs[programCode];
        const details = data.offer_details[programCode] || {};
        const meta = programMetadata[programCode];
        const calc = calculations[programCode];
        const isConfigured = config && config.order_type && config.term;
        return <AccordionItem key={programCode} value={programCode}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="font-medium">{programCode}</span>
                  {isConfigured ? <Badge variant="default">Configured</Badge> : <Badge variant="outline">Pending</Badge>}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                {/* Grid Layout: Configuration + Financial Details */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 mb-4">
                  {/* Configuration Card */}
                  <Card className="p-4">
                    <div className="space-y-3">
                      {/* Vehicle Info Section */}
                      {meta ? (
                        <div className="mb-4 p-3 bg-secondary/50 rounded-lg space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{meta.vehicleDisplay}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <Badge variant="secondary">{meta.productType || 'Loading...'}</Badge>
                            <Tag className="h-4 w-4 text-muted-foreground ml-2" />
                            <Badge variant="outline">{meta.condition || 'Loading...'}</Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4 p-3 bg-secondary/50 rounded-lg">
                          <span className="text-sm text-muted-foreground">Loading program details...</span>
                        </div>
                      )}

                      {/* Form Fields */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Order Type *</Label>
                          <Select value={config?.order_type || ''} onValueChange={value => handleConfigUpdate(programCode, 'order_type', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {getOrderTypeOptions(programCode).map(option => <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Term *</Label>
                          <Select value={config?.term?.toString() || ''} onValueChange={value => handleConfigUpdate(programCode, 'term', parseInt(value))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {(meta?.availableTerms || []).map(term => <SelectItem key={term} value={term.toString()}>{term} mo</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Down Payment</Label>
                          <Input type="number" placeholder="0.00" value={config?.down_payment || ''} onChange={e => handleConfigUpdate(programCode, 'down_payment', parseFloat(e.target.value) || 0)} />
                        </div>

                        <div className="space-y-2">
                          <Label>Credit Score</Label>
                          <Select 
                            value={
                              config?.credit_score_min !== undefined && 
                              config?.credit_score_max !== undefined 
                                ? `${config.credit_score_min}-${config.credit_score_max}` 
                                : undefined
                            } 
                            onValueChange={value => {
                              const [min, max] = value.split('-').map(Number);
                              // Update both values simultaneously to avoid race condition
                              handleConfigUpdate(programCode, {
                                credit_score_min: min,
                                credit_score_max: max
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {(meta?.creditScoreRanges || []).map(range => <SelectItem key={range} value={range}>{range}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>

                        {meta?.isLease && <div className="space-y-2 col-span-2">
                            <Label>Annual Mileage</Label>
                            <Input type="number" placeholder="12000" value={config?.annual_mileage || ''} onChange={e => handleConfigUpdate(programCode, 'annual_mileage', parseInt(e.target.value) || undefined)} />
                          </div>}
                      </div>
                    </div>
                  </Card>

                  {/* Financial Details Card - Compact */}
                  <Card className="p-3 h-fit">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <h3 className="text-base font-semibold">Financial Details</h3>
                    </div>
                    
                    {!config ? <div className="text-xs text-muted-foreground py-3">
                        Configure the program first
                      </div> : !calc ? <div className="text-xs text-muted-foreground py-3">
                        {loading ? 'Calculating...' : 'No pricing data available'}
                      </div> : <div className="space-y-1.5">
                        <div className="flex justify-between py-1.5">
                          <span className="text-xs font-medium">Base Price</span>
                          <span className="font-semibold text-sm">${calc.base_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between py-1">
                          <span className="text-xs text-muted-foreground">Monthly Payment</span>
                          <span className="font-semibold text-sm">${calc.monthly_payment.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-xs text-muted-foreground">APR</span>
                          <span className="font-semibold text-sm">{calc.apr}%</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-xs text-muted-foreground">Total Cost</span>
                          <span className="font-semibold text-sm">${calc.total_cost_of_credit}</span>
                        </div>
                        {calc.lender && <div className="flex justify-between py-1">
                            <span className="text-xs text-muted-foreground">Lender</span>
                            <span className="font-semibold text-sm">{calc.lender}</span>
                          </div>}
                      </div>}
                  </Card>
                </div>

                {/* Advertised Discount Section - Full Width */}
                <Card className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-muted-foreground" />
                      <Label>Advertised Discount</Label>
                    </div>
                    <div className="border rounded-md bg-background overflow-x-auto">
                      {(availableDiscounts[programCode] || []).length > 0 ? (
                        <>
                          {/* Header Row */}
                          <div className="grid grid-cols-[40px_100px_200px_100px_150px_100px_110px_110px_1fr] gap-3 px-3 py-2 bg-muted/50 border-b font-semibold text-xs">
                            <div></div>
                            <div>Category</div>
                            <div>Name</div>
                            <div>Type</div>
                            <div>Subcategory</div>
                            <div>Amount</div>
                            <div>Start Date</div>
                            <div>End Date</div>
                            <div>Description</div>
                          </div>
                          
                          {/* Data Rows */}
                          <div className="max-h-64 overflow-y-auto">
                          {(availableDiscounts[programCode] || []).map(discount => {
                              const currentDiscounts = config?.applicable_discounts || [];
                              const isSelected = currentDiscounts.some(d => d.id === discount.id);
                              
                              return (
                                <div 
                                  key={discount.id} 
                                  className="grid grid-cols-[40px_100px_200px_100px_150px_100px_110px_110px_1fr] gap-3 px-3 py-2 border-b hover:bg-accent cursor-pointer transition-colors items-center text-sm"
                                  onClick={() => {
                                    const newDiscounts = isSelected 
                                      ? currentDiscounts.filter(d => d.id !== discount.id) 
                                      : [...currentDiscounts, { id: discount.id, name: discount.name, amount: discount.discountAmount || 0 }];
                                    handleConfigUpdate(programCode, 'applicable_discounts', newDiscounts);
                                  }}
                                >
                                  <div className="flex items-center justify-center">
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={(checked) => {
                                        const newDiscounts = checked 
                                          ? [...currentDiscounts, { id: discount.id, name: discount.name, amount: discount.discountAmount || 0 }] 
                                          : currentDiscounts.filter(d => d.id !== discount.id);
                                        handleConfigUpdate(programCode, 'applicable_discounts', newDiscounts);
                                      }}
                                    />
                                  </div>
                                  
                                  <div>
                                    <Badge variant="secondary" className="text-xs">
                                      {discount.category || "N/A"}
                                    </Badge>
                                  </div>
                                  
                                  <div className="truncate font-medium" title={discount.name || "N/A"}>
                                    {discount.name || "N/A"}
                                  </div>
                                  
                                  <div className="truncate text-muted-foreground" title={discount.type || "N/A"}>
                                    {discount.type || "N/A"}
                                  </div>
                                  
                                  <div className="truncate text-muted-foreground" title={discount.subcategory || "N/A"}>
                                    {discount.subcategory || "N/A"}
                                  </div>
                                  
                                  <div className="font-semibold text-primary">
                                    ${discount.discountAmount || 0}
                                  </div>
                                  
                                  <div className="text-xs text-muted-foreground">
                                    {discount.startDate ? format(new Date(discount.startDate), "MM/dd/yyyy") : "N/A"}
                                  </div>
                                  
                                  <div className="text-xs text-muted-foreground">
                                    {discount.endDate ? format(new Date(discount.endDate), "MM/dd/yyyy") : "Never"}
                                  </div>
                                  
                                  <div className="truncate text-xs text-muted-foreground" title={discount.description || ""}>
                                    {discount.description || "—"}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          {!availableDiscounts[programCode] ? 'Loading discounts...' : 'No applicable discounts found'}
                        </p>
                      )}
                    </div>
                    {availableDiscounts[programCode] && <p className="text-xs text-muted-foreground">
                        {availableDiscounts[programCode].length} applicable discount(s) found
                      </p>}
                  </div>
                </Card>
              </AccordionContent>
            </AccordionItem>;
      })}
      </Accordion>
    </div>;
};
export default ConfigurationAndDetailsStep;