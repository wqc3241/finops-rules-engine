
import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import { usePricingTypes } from "@/hooks/usePricingTypes";
import { generateProgramCode } from "@/utils/programCodeGenerator";
import ConfirmationStep from "./WizardSteps/ConfirmationStep";
import { FinancialProgramRecord } from "@/types/financialProgram";

export interface WizardData {
  vehicleStyleIds: string[];
  vehicleCondition: string;
  orderTypes: string[];
  financialProduct: string;
  pricingTypes: string[];
  pricingTypeConfigs: Record<string, { creditProfiles: string[]; pricingConfigs: string[] }>;
  programStartDate: string;
  programEndDate: string;
  lenders: string[];
  geoCodes: string[];
}

interface FinancialProgramWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (data: FinancialProgramRecord[]) => void;
  editData?: any;
  isEditMode?: boolean;
}


const FinancialProgramWizard = ({ open, onOpenChange, onComplete, editData, isEditMode = false }: FinancialProgramWizardProps) => {
  const [currentStep, setCurrentStep] = useState<'wizard' | 'confirmation'>('wizard');
  const [wizardData, setWizardData] = useState<WizardData>({
    vehicleStyleIds: [],
    vehicleCondition: "",
    orderTypes: [],
    financialProduct: "",
    pricingTypes: [],
    pricingTypeConfigs: {},
    programStartDate: "",
    programEndDate: "",
    lenders: [],
    geoCodes: []
  });

  // Reset wizard data when modal opens or edit data changes
  useEffect(() => {
    if (open) {
      setCurrentStep('wizard');
      if (isEditMode && editData) {
        setWizardData({
          vehicleStyleIds: Array.isArray(editData.vehicleStyleIds) ? editData.vehicleStyleIds : [editData.vehicleStyleId || ""],
          vehicleCondition: editData.financingVehicleCondition || "",
          orderTypes: editData.orderTypes ? editData.orderTypes.split(', ').filter(Boolean) : [],
          financialProduct: editData.financialProductId || "",
          pricingTypes: Array.isArray(editData.pricingTypes) ? editData.pricingTypes : [],
          pricingTypeConfigs: editData.pricingTypeConfigs || {},
          programStartDate: editData.programStartDate || "",
          programEndDate: editData.programEndDate || "",
          lenders: Array.isArray(editData.lenders) ? editData.lenders : [],
          geoCodes: Array.isArray(editData.geoCodes) ? editData.geoCodes : []
        });
      } else {
        setWizardData({
          vehicleStyleIds: [],
          vehicleCondition: "",
          orderTypes: [],
          financialProduct: "",
          pricingTypes: [],
          pricingTypeConfigs: {},
          programStartDate: "",
          programEndDate: "",
          lenders: [],
          geoCodes: []
        });
      }
    }
  }, [open, isEditMode, editData]);

  // Data loading states
  const [vehicleStyles, setVehicleStyles] = useState<any[]>([]);
  const [creditProfiles, setCreditProfiles] = useState<any[]>([]);
  const [pricingConfigs, setPricingConfigs] = useState<any[]>([]);
  const [lenders, setLenders] = useState<any[]>([]);
  const [geos, setGeos] = useState<any[]>([]);
  const [financialProducts, setFinancialProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { pricingTypes } = usePricingTypes();

  // Load all data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [vehicleRes, creditRes, pricingRes, lenderRes, geoRes, financialRes] = await Promise.all([
          supabase.from("vehicle_style_coding").select("*"),
          supabase.from('credit_profiles').select('*'),
          supabase.from('pricing_configs').select('*'),
          supabase.from("lenders").select('"Gateway lender ID", lender_name'),
          supabase.from("geo_location").select("geo_code, location_name"),
          supabase.from("financial_products").select("product_id, product_type, product_subtype, geo_code, category, is_active")
        ]);

        setVehicleStyles(vehicleRes.data || []);
        setCreditProfiles((creditRes.data || []).map((r: any) => ({
          id: r.profile_id,
          priority: r.priority,
          minCreditScore: r.min_credit_score,
          maxCreditScore: r.max_credit_score,
          minIncome: r.min_income,
          maxIncome: r.max_income,
          employmentType: r.employment_type,
        })));
        setPricingConfigs((pricingRes.data || []).map((r: any) => ({
          id: r.pricing_rule_id,
          minLTV: r.min_ltv,
          maxLTV: r.max_ltv,
          minTerm: r.min_term,
          maxTerm: r.max_term,
          priority: r.priority,
        })));
        setLenders((lenderRes.data || []).map((r: any) => ({
          id: r["Gateway lender ID"],
          name: r.lender_name,
        })));
        setGeos((geoRes.data || []).map((r: any) => ({
          id: (r.geo_code ?? '').toString().trim(),
          name: (r.location_name ?? '').toString().trim(),
        })));
        setFinancialProducts((financialRes.data || [])
          .filter((r: any) => r.is_active !== false)
          .map((r: any) => ({
            id: (r.product_id ?? '').toString().trim(),
            productType: (r.product_type ?? '').toString().trim(),
            productSubtype: r.product_subtype != null ? r.product_subtype.toString().trim() : null,
            geoCode: (r.geo_code ?? '').toString().trim(),
            category: (r.category ?? '').toString().trim(),
          })));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (open) {
      loadData();
    }
  }, [open]);

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => {
      const newData = { ...prev, ...updates };
      
      // Clear dependent selections when parent selections change
      if (updates.geoCodes !== undefined || updates.lenders !== undefined) {
        // Clear financial product and pricing types when geo codes change
        newData.financialProduct = "";
        newData.pricingTypes = [];
        newData.pricingTypeConfigs = {};
      }
      
      if (updates.financialProduct !== undefined && updates.financialProduct !== prev.financialProduct) {
        // Clear pricing types when financial product changes
        newData.pricingTypes = [];
        newData.pricingTypeConfigs = {};
      }
      
      if (updates.pricingTypes !== undefined) {
        // Update pricingTypeConfigs when pricing types change
        const newConfigs = { ...prev.pricingTypeConfigs };
        
        // Remove configurations for unselected pricing types
        Object.keys(newConfigs).forEach(pricingType => {
          if (!updates.pricingTypes!.includes(pricingType)) {
            delete newConfigs[pricingType];
          }
        });
        
        // Add empty configurations for newly selected pricing types
        updates.pricingTypes.forEach(pricingType => {
          if (!newConfigs[pricingType]) {
            newConfigs[pricingType] = { creditProfiles: [], pricingConfigs: [] };
          }
        });
        
        newData.pricingTypeConfigs = newConfigs;
      }
      
      return newData;
    });
  };

  // Computed values
  const vehicleStyleOptions = useMemo(() => {
    return vehicleStyles.map((row: any) => {
      const id = row.style_code ?? row.vehicle_style_id ?? row.id;
      const parts = [row.model_year, row.make, row.model, row.trim, row.style_name, row.variant]
        .filter(Boolean)
        .join(" ");
      const label = id ? (parts ? `${id} - ${parts}` : `${id}`) : parts || "Unknown Style";
      return { id: String(id), label };
    });
  }, [vehicleStyles]);

  // Hierarchical geo matching function
  const isGeoMatch = (selectedGeoCodes: string[], productGeoCode: string | null) => {
    if (!productGeoCode) return false;
    
    return selectedGeoCodes.some(selectedGeo => {
      // Exact match
      if (selectedGeo === productGeoCode) return true;
      
      // Parent-to-child: selected geo is parent of product geo  
      // (e.g., selected "NA-US", product has "NA-US-CA")
      if (productGeoCode.startsWith(selectedGeo + '-')) return true;
      
      // Child-to-parent: selected geo is child of product geo
      // (e.g., selected "NA-US-CA", product has "NA-US") 
      if (selectedGeo.startsWith(productGeoCode + '-')) return true;
      
      return false;
    });
  };

  // Filter financial products based on selected geo codes with hierarchical matching
  const filteredFinancialProducts = useMemo(() => {
    console.log('🔍 Filtering financial products:', {
      geoCodes: wizardData.geoCodes,
      totalProducts: financialProducts.length,
      productsWithGeoCodes: financialProducts.map(p => ({ id: p.id, geoCode: p.geoCode }))
    });

    if (wizardData.geoCodes.length === 0) {
      return financialProducts;
    }
    
    const filtered = financialProducts.filter(product => 
      isGeoMatch(wizardData.geoCodes, product.geoCode)
    );

    console.log('✅ Filtered products:', {
      matchedProducts: filtered.map(p => ({ id: p.id, geoCode: p.geoCode })),
      count: filtered.length
    });

    return filtered;
  }, [financialProducts, wizardData.geoCodes]);

  // Filter pricing types based on selected financial product
  const filteredPricingTypes = useMemo(() => {
    const selectedId = wizardData.financialProduct?.trim();
    if (!selectedId) {
      return pricingTypes;
    }
    
    return pricingTypes.filter(type => 
      (type.financialProducts || []).some(fp => (fp || '').trim() === selectedId)
    );
  }, [pricingTypes, wizardData.financialProduct]);

  const vehicleConditions = [
    { id: "New", label: "New" },
    { id: "Used", label: "Used" },
    { id: "Demo", label: "Demo" },
    { id: "CPO", label: "Certified Pre-Owned" },
  ];

  const orderTypes = [
    { id: "INV", label: "Inventory (INV)" },
    { id: "CON", label: "Contract (CON)" }
  ];

  const isFormValid = () => {
    const basicFieldsValid = wizardData.vehicleStyleIds.length > 0 && 
                             wizardData.vehicleCondition && 
                             wizardData.orderTypes.length > 0 && 
                             wizardData.financialProduct && 
                             wizardData.pricingTypes.length > 0 && 
                             wizardData.programStartDate && 
                             wizardData.programEndDate && 
                             wizardData.lenders.length > 0 && 
                             wizardData.geoCodes.length > 0;
    
    // Check that each selected pricing type has at least one credit profile and pricing config
    const configsValid = wizardData.pricingTypes.every(pricingType => {
      const config = wizardData.pricingTypeConfigs[pricingType];
      return config && config.creditProfiles.length > 0 && config.pricingConfigs.length > 0;
    });
    
    return basicFieldsValid && configsValid;
  };

  const handleNext = async () => {
    if (!isFormValid()) {
      toast.error("Please complete all required fields.");
      return;
    }
    setCurrentStep('confirmation');
  };

  const handleBack = () => {
    setCurrentStep('wizard');
  };

  const handleCreatePrograms = async () => {
    try {
      // Get existing program codes to avoid conflicts
      const { data: existingPrograms } = await supabase
        .from('financial_program_configs')
        .select('program_code');
      
      const existingCodes = existingPrograms?.map(p => p.program_code) || [];
      
      // Generate program data for each vehicle style
      const programsToCreate: FinancialProgramRecord[] = await Promise.all(
        wizardData.vehicleStyleIds.map(async (vehicleStyleId) => {
          // Get vehicle style record for model year
          const { data: vehicleStyleData } = await supabase
            .from('vehicle_style_coding')
            .select('*')
            .eq('vehicle_style_id', vehicleStyleId)
            .single();

          const programCode = generateProgramCode({
            vehicleCondition: wizardData.vehicleCondition,
            financialProduct: (financialProducts.find(p => p.id === wizardData.financialProduct)?.productType || wizardData.financialProduct),
            vehicleStyleId,
            vehicleStyleRecord: vehicleStyleData,
            programStartDate: wizardData.programStartDate
          }, existingCodes);

          // Add this code to existing codes for next iterations
          existingCodes.push(programCode);

          return {
            program_code: programCode,
            vehicle_style_id: vehicleStyleId,
            financing_vehicle_condition: wizardData.vehicleCondition,
            financial_product_id: wizardData.financialProduct,
            program_start_date: wizardData.programStartDate,
            program_end_date: wizardData.programEndDate,
            is_active: 'Active',
            advertised: 'Yes',
            version: 1,
            priority: 1,
            order_types: wizardData.orderTypes.join(', '),
            template_metadata: {
              pricingTypes: wizardData.pricingTypes,
              pricingTypeConfigs: wizardData.pricingTypeConfigs,
              lenders: wizardData.lenders,
              geoCodes: wizardData.geoCodes
            }
          };
        })
      );

      // Insert all programs
      const { error } = await supabase
        .from('financial_program_configs')
        .insert(programsToCreate);

      if (error) throw error;

      onComplete(programsToCreate);
      onOpenChange(false);
      toast.success(`${programsToCreate.length} financial program${programsToCreate.length > 1 ? 's' : ''} created successfully!`);
    } catch (error) {
      console.error('Error creating programs:', error);
      toast.error("Failed to create financial programs. Please try again.");
    }
  };

  // Generate program previews for confirmation
  const [programPreviews, setProgramPreviews] = useState<any[]>([]);

  useEffect(() => {
    const generatePreviews = async () => {
      if (currentStep !== 'confirmation' || !isFormValid()) {
        setProgramPreviews([]);
        return;
      }
      
      const { data: existingPrograms } = await supabase
        .from('financial_program_configs')
        .select('program_code');
      
      const existingCodes = existingPrograms?.map(p => p.program_code) || [];
      
      const previews = await Promise.all(
        wizardData.vehicleStyleIds.map(async (vehicleStyleId) => {
          const { data: vehicleStyleData } = await supabase
            .from('vehicle_style_coding')
            .select('*')
            .eq('vehicle_style_id', vehicleStyleId)
            .single();

          const vehicleStyleOption = vehicleStyleOptions.find(v => v.id === vehicleStyleId);
          
          const programCode = generateProgramCode({
            vehicleCondition: wizardData.vehicleCondition,
            financialProduct: (financialProducts.find(p => p.id === wizardData.financialProduct)?.productType || wizardData.financialProduct),
            vehicleStyleId,
            vehicleStyleRecord: vehicleStyleData,
            programStartDate: wizardData.programStartDate
          }, existingCodes);

          existingCodes.push(programCode);

          return {
            programCode,
            vehicleStyleId,
            vehicleStyleLabel: vehicleStyleOption?.label || vehicleStyleId,
            financingVehicleCondition: wizardData.vehicleCondition,
            financialProductId: wizardData.financialProduct,
            programStartDate: wizardData.programStartDate,
            programEndDate: wizardData.programEndDate,
            isActive: 'Active',
            advertised: 'Yes',
            version: 1,
            priority: 1
          };
        })
      );
      
      setProgramPreviews(previews);
    };

    generatePreviews();
  }, [currentStep, wizardData, vehicleStyleOptions]);

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading program setup data...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">
                {isEditMode ? 'Edit Financial Program' : 'Create New Financial Program'}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {currentStep === 'wizard' 
                  ? (isEditMode ? 'Update the program configuration below' : 'Complete all sections below to create your financial program')
                  : 'Review and confirm your program configuration'
                }
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-muted-foreground">
                Step {currentStep === 'wizard' ? '1' : '2'} of 2
              </div>
              <div className="text-xs text-muted-foreground">
                {currentStep === 'wizard' ? 'Program Setup' : 'Confirmation'}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Vehicle Selection */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Vehicle Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-sm">Vehicle Styles * ({wizardData.vehicleStyleIds.length} selected)</Label>
                  <div className="space-y-1 max-h-48 overflow-y-auto border rounded-lg p-2">
                    {vehicleStyleOptions.map((style) => (
                      <div key={style.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={`vehicle-${style.id}`}
                          checked={wizardData.vehicleStyleIds.includes(style.id)}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...wizardData.vehicleStyleIds, style.id]
                              : wizardData.vehicleStyleIds.filter(id => id !== style.id);
                            updateWizardData({ vehicleStyleIds: updated });
                          }}
                          className="mt-0.5 scale-75"
                        />
                        <Label htmlFor={`vehicle-${style.id}`} className="text-xs cursor-pointer flex-1 min-w-0">
                          {style.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="vehicleCondition" className="text-sm">Vehicle Condition *</Label>
                  <Select value={wizardData.vehicleCondition} onValueChange={(value) => updateWizardData({ vehicleCondition: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleConditions.map((condition) => (
                        <SelectItem key={condition.id} value={condition.id}>
                          {condition.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Order Types * ({wizardData.orderTypes.length} selected)</Label>
                  <div className="space-y-1 border rounded-lg p-2">
                    {orderTypes.map((orderType) => (
                      <div key={orderType.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={`order-${orderType.id}`}
                          checked={wizardData.orderTypes.includes(orderType.id)}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...wizardData.orderTypes, orderType.id]
                              : wizardData.orderTypes.filter(id => id !== orderType.id);
                            updateWizardData({ orderTypes: updated });
                          }}
                          className="mt-0.5 scale-75"
                        />
                        <Label htmlFor={`order-${orderType.id}`} className="text-xs cursor-pointer flex-1 min-w-0">
                          {orderType.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Program Dates */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Program Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="startDate" className="text-sm">Program Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={wizardData.programStartDate}
                    onChange={(e) => updateWizardData({ programStartDate: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="endDate" className="text-sm">Program End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={wizardData.programEndDate}
                    onChange={(e) => updateWizardData({ programEndDate: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lenders & Geography */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Lenders & Geography</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-medium text-sm">Lenders *</Label>
                  <div className="space-y-1 max-h-40 overflow-y-auto border rounded-lg p-2">
                    {lenders.map((lender) => (
                      <div key={lender.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`lender-${lender.id}`}
                          checked={wizardData.lenders.includes(lender.id)}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...wizardData.lenders, lender.id]
                              : wizardData.lenders.filter(id => id !== lender.id);
                            updateWizardData({ lenders: updated });
                          }}
                        />
                        <Label htmlFor={`lender-${lender.id}`} className="text-sm cursor-pointer">
                          {lender.id}
                          <div className="text-xs text-muted-foreground">{lender.name}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-sm">Geographic Regions *</Label>
                  <div className="space-y-1 max-h-40 overflow-y-auto border rounded-lg p-2">
                    {geos.map((geo) => (
                      <div key={geo.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`geo-${geo.id}`}
                          checked={wizardData.geoCodes.includes(geo.id)}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...wizardData.geoCodes, geo.id]
                              : wizardData.geoCodes.filter(id => id !== geo.id);
                            updateWizardData({ geoCodes: updated });
                          }}
                        />
                        <Label htmlFor={`geo-${geo.id}`} className="text-sm cursor-pointer">
                          {geo.id}
                          <div className="text-xs text-muted-foreground">{geo.name}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Product & Pricing */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Financial Product & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Financial Product *</Label>
                  {wizardData.geoCodes.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-2 bg-muted rounded-lg">
                      Please select Geographic Regions first to see available Financial Products.
                    </div>
                  ) : filteredFinancialProducts.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-2 bg-muted rounded-lg">
                      No financial products available for the selected geographic regions.
                    </div>
                  ) : (
                    <RadioGroup
                      value={wizardData.financialProduct}
                      onValueChange={(value) => updateWizardData({ financialProduct: value })}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2"
                    >
                      {filteredFinancialProducts.map((product) => (
                        <div key={product.id} className="flex items-start space-x-3 p-2 border rounded-lg hover:bg-accent/50 transition-colors h-10">
                          <RadioGroupItem value={product.id} id={product.id} className="mt-0.5 scale-75" />
                          <Label htmlFor={product.id} className="text-xs cursor-pointer flex-1 min-w-0">
                            <div className="font-medium leading-tight">
                              {product.productType}{product.productSubtype ? ` - ${product.productSubtype}` : ''}
                            </div>
                            <div className="text-[10px] text-muted-foreground">{product.geoCode} | {product.category}</div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Available Pricing Types *</Label>
                  {!wizardData.financialProduct ? (
                    <div className="text-sm text-muted-foreground p-2 bg-muted rounded-lg">
                      Please select a Financial Product first to see available Pricing Types.
                    </div>
                  ) : filteredPricingTypes.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-2 bg-muted rounded-lg">
                      No pricing types available for the selected financial product.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                      {[...filteredPricingTypes].sort((a, b) => a.typeName.localeCompare(b.typeName)).map((type) => (
                        <div key={type.typeCode} className="flex items-start space-x-3 p-2 border rounded-lg hover:bg-accent/50 transition-colors h-10">
                          <Checkbox
                            id={type.typeCode}
                            checked={wizardData.pricingTypes.includes(type.typeCode)}
                            onCheckedChange={(checked) => {
                              const updated = checked
                                ? [...wizardData.pricingTypes, type.typeCode]
                                : wizardData.pricingTypes.filter(code => code !== type.typeCode);
                              updateWizardData({ pricingTypes: updated });
                            }}
                            className="mt-0.5 scale-75"
                          />
                          <Label htmlFor={type.typeCode} className="text-xs cursor-pointer flex-1 min-w-0">
                            <div className="font-medium leading-tight">{type.typeName}</div>
                            <div className="text-[10px] text-muted-foreground">{type.typeCode}</div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {wizardData.pricingTypes.length === 0 ? (
                <div className="text-sm text-muted-foreground p-2 bg-muted rounded-lg">
                  Please select Pricing Types first to configure Credit Profiles and Pricing Configurations.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Credit Profiles Matrix */}
                  <div className="space-y-3">
                    <Label className="font-medium text-sm">Credit Profiles *</Label>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-muted/50 px-3 py-2 border-b">
                        <div className="grid gap-2" style={{ gridTemplateColumns: `2fr ${wizardData.pricingTypes.map(() => '1fr').join(' ')}` }}>
                          <div className="text-xs font-medium">Profile Details</div>
                          {wizardData.pricingTypes.map((pricingType) => {
                            const pricingTypeName = filteredPricingTypes.find(pt => pt.typeCode === pricingType)?.typeName || pricingType;
                            return (
                              <div key={pricingType} className="text-xs font-medium text-center">
                                {pricingTypeName}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {creditProfiles.map((profile) => (
                          <div key={profile.id} className="px-3 py-2 border-b last:border-b-0 hover:bg-accent/20">
                            <div className="grid gap-2" style={{ gridTemplateColumns: `2fr ${wizardData.pricingTypes.map(() => '1fr').join(' ')}` }}>
                              <div className="pr-4">
                                <div className="font-medium text-sm">{profile.id}</div>
                                <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 mt-1">
                                  <span>Priority: {profile.priority}</span>
                                  <span>Credit: {profile.minCreditScore}-{profile.maxCreditScore}</span>
                                  <span>Income: ${profile.minIncome?.toLocaleString()}-${profile.maxIncome?.toLocaleString()}</span>
                                  <span>Employment: {profile.employmentType}</span>
                                </div>
                              </div>
                              {wizardData.pricingTypes.map((pricingType) => (
                                <div key={pricingType} className="flex justify-center">
                                  <Checkbox
                                    checked={wizardData.pricingTypeConfigs[pricingType]?.creditProfiles.includes(profile.id) || false}
                                    onCheckedChange={(checked) => {
                                      const currentConfig = wizardData.pricingTypeConfigs[pricingType] || { creditProfiles: [], pricingConfigs: [] };
                                      const updatedProfiles = checked
                                        ? [...currentConfig.creditProfiles, profile.id]
                                        : currentConfig.creditProfiles.filter(id => id !== profile.id);
                                      
                                      updateWizardData({
                                        pricingTypeConfigs: {
                                          ...wizardData.pricingTypeConfigs,
                                          [pricingType]: {
                                            ...currentConfig,
                                            creditProfiles: updatedProfiles
                                          }
                                        }
                                      });
                                    }}
                                    className="scale-75"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing Configurations Matrix */}
                  <div className="space-y-3">
                    <Label className="font-medium text-sm">Pricing Configurations *</Label>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-muted/50 px-3 py-2 border-b">
                        <div className="grid gap-2" style={{ gridTemplateColumns: `2fr ${wizardData.pricingTypes.map(() => '1fr').join(' ')}` }}>
                          <div className="text-xs font-medium">Configuration Details</div>
                          {wizardData.pricingTypes.map((pricingType) => {
                            const pricingTypeName = filteredPricingTypes.find(pt => pt.typeCode === pricingType)?.typeName || pricingType;
                            return (
                              <div key={pricingType} className="text-xs font-medium text-center">
                                {pricingTypeName}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {pricingConfigs.map((config) => (
                          <div key={config.id} className="px-3 py-2 border-b last:border-b-0 hover:bg-accent/20">
                            <div className="grid gap-2" style={{ gridTemplateColumns: `2fr ${wizardData.pricingTypes.map(() => '1fr').join(' ')}` }}>
                              <div className="pr-4">
                                <div className="font-medium text-sm">{config.id}</div>
                                <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 mt-1">
                                  <span>Priority: {config.priority}</span>
                                  <span>LTV: {config.minLTV}%-{config.maxLTV}%</span>
                                  <span>Term: {config.minTerm}-{config.maxTerm} months</span>
                                </div>
                              </div>
                              {wizardData.pricingTypes.map((pricingType) => (
                                <div key={pricingType} className="flex justify-center">
                                  <Checkbox
                                    checked={wizardData.pricingTypeConfigs[pricingType]?.pricingConfigs.includes(config.id) || false}
                                    onCheckedChange={(checked) => {
                                      const currentConfig = wizardData.pricingTypeConfigs[pricingType] || { creditProfiles: [], pricingConfigs: [] };
                                      const updatedConfigs = checked
                                        ? [...currentConfig.pricingConfigs, config.id]
                                        : currentConfig.pricingConfigs.filter(id => id !== config.id);
                                      
                                      updateWizardData({
                                        pricingTypeConfigs: {
                                          ...wizardData.pricingTypeConfigs,
                                          [pricingType]: {
                                            ...currentConfig,
                                            pricingConfigs: updatedConfigs
                                          }
                                        }
                                      });
                                    }}
                                    className="scale-75"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Configuration Summary */}
                  <div className="space-y-2">
                    <Label className="font-medium text-sm">Configuration Status</Label>
                    <div className="grid gap-2">
                      {wizardData.pricingTypes.map((pricingType) => {
                        const pricingTypeName = filteredPricingTypes.find(pt => pt.typeCode === pricingType)?.typeName || pricingType;
                        const config = wizardData.pricingTypeConfigs[pricingType];
                        const isComplete = config && config.creditProfiles.length > 0 && config.pricingConfigs.length > 0;
                        
                        return (
                          <div key={pricingType} className={`text-xs p-2 rounded-lg ${isComplete ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                            <span className="font-medium">{pricingTypeName}:</span>
                            {isComplete ? (
                              <span className="ml-2">
                                ✓ {config.creditProfiles.length} credit profile{config.creditProfiles.length !== 1 ? 's' : ''}, 
                                {config.pricingConfigs.length} pricing config{config.pricingConfigs.length !== 1 ? 's' : ''}
                              </span>
                            ) : (
                              <span className="ml-2">⚠ Incomplete configuration - please select credit profiles and pricing configurations</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {currentStep === 'wizard' ? (
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              {isFormValid() ? "✓ All required fields completed" : "Complete all required fields to continue"}
            </div>
            <Button onClick={handleNext} disabled={!isFormValid()}>
              Create Financial Program
            </Button>
          </div>
        ) : (
          <>
            <ConfirmationStep 
              data={wizardData}
              vehicleStyleOptions={vehicleStyleOptions}
              financialProducts={financialProducts}
              programPreviews={programPreviews}
            />
            <div className="flex justify-between items-center pt-2 border-t">
              <Button variant="outline" onClick={handleBack}>
                Back to Edit
              </Button>
              <Button onClick={handleCreatePrograms}>
                Create {wizardData.vehicleStyleIds.length} Program{wizardData.vehicleStyleIds.length > 1 ? 's' : ''}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FinancialProgramWizard;
