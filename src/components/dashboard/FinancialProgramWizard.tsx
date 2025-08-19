
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
import { useFinancialProducts } from "@/hooks/useFinancialProducts";
import { usePricingTypes } from "@/hooks/usePricingTypes";

export interface WizardData {
  vehicleStyleId: string;
  vehicleCondition: string;
  financialProduct: string; // single string now
  pricingTypes: string[];
  creditProfiles: string[]; // Changed to array
  pricingConfigs: string[]; // Changed to array
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


const FinancialProgramWizard = ({ open, onOpenChange, onComplete }: FinancialProgramWizardProps) => {
  const [wizardData, setWizardData] = useState<WizardData>({
    vehicleStyleId: "",
    vehicleCondition: "",
    financialProduct: "",
    pricingTypes: [],
    creditProfiles: [],
    pricingConfigs: [],
    programStartDate: "",
    programEndDate: "",
    lenders: [],
    geoCodes: []
  });

  // Data loading states
  const [vehicleStyles, setVehicleStyles] = useState<any[]>([]);
  const [creditProfiles, setCreditProfiles] = useState<any[]>([]);
  const [pricingConfigs, setPricingConfigs] = useState<any[]>([]);
  const [lenders, setLenders] = useState<any[]>([]);
  const [geos, setGeos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const financialProducts = useFinancialProducts();
  const { pricingTypes } = usePricingTypes();

  // Load all data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [vehicleRes, creditRes, pricingRes, lenderRes, geoRes] = await Promise.all([
          supabase.from("vehicle_style_coding").select("*"),
          supabase.from('credit_profiles').select('*'),
          supabase.from('pricing_configs').select('*'),
          supabase.from("lenders").select('"Gateway lender ID", lender_name'),
          supabase.from("geo_location").select("geo_code, location_name")
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
          id: r.geo_code,
          name: r.location_name,
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
    setWizardData(prev => ({ ...prev, ...updates }));
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

  const vehicleConditions = [
    { id: "New", label: "New" },
    { id: "Used", label: "Used" },
    { id: "Demo", label: "Demo" },
    { id: "CPO", label: "Certified Pre-Owned" },
  ];

  const isFormValid = () => {
    return wizardData.vehicleStyleId && 
           wizardData.vehicleCondition && 
           wizardData.financialProduct && 
           wizardData.pricingTypes.length > 0 && 
           wizardData.creditProfiles.length > 0 && 
           wizardData.pricingConfigs.length > 0 && 
           wizardData.programStartDate && 
           wizardData.programEndDate && 
           wizardData.lenders.length > 0 && 
           wizardData.geoCodes.length > 0;
  };

  const handleComplete = () => {
    if (!isFormValid()) {
      toast.error("Please complete all required fields.");
      return;
    }
    
    const programCode = generateProgramCode(wizardData);
    const finalData = { ...wizardData, programCode };
    onComplete(finalData);
    onOpenChange(false);
    toast.success("Financial program created successfully!");
  };

  const generateProgramCode = (data: WizardData): string => {
    const productCode = data.financialProduct?.substring(0, 3) || "FIN";
    const vehicleCode = data.vehicleStyleId.substring(0, 3) || "VEH";
    const dateCode = new Date().getFullYear().toString().substring(2);
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${productCode}${vehicleCode}${dateCode}${randomSuffix}`;
  };

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
        <DialogHeader>
          <DialogTitle>Create New Financial Program</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Complete all sections below to create your financial program
          </p>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Vehicle Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehicle Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleStyle">Vehicle Style *</Label>
                  <Select value={wizardData.vehicleStyleId} onValueChange={(value) => updateWizardData({ vehicleStyleId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle style" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleStyleOptions.map((style) => (
                        <SelectItem key={style.id} value={style.id}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleCondition">Vehicle Condition *</Label>
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
              </div>
            </CardContent>
          </Card>

          {/* Financial Product & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Product & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Financial Product *</Label>
                  <RadioGroup
                    value={wizardData.financialProduct}
                    onValueChange={(value) => updateWizardData({ financialProduct: value })}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  >
                    {financialProducts.map((product) => (
                      <div key={product.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value={product.id} id={product.id} />
                        <Label htmlFor={product.id} className="text-sm cursor-pointer">
                          {product.productType}{product.productSubtype ? ` - ${product.productSubtype}` : ''}
                          <div className="text-xs text-muted-foreground">{product.geoCode} | {product.category}</div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Available Pricing Types *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {pricingTypes.map((type) => (
                      <div key={type.typeCode} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                        <Checkbox
                          id={type.typeCode}
                          checked={wizardData.pricingTypes.includes(type.typeCode)}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...wizardData.pricingTypes, type.typeCode]
                              : wizardData.pricingTypes.filter(code => code !== type.typeCode);
                            updateWizardData({ pricingTypes: updated });
                          }}
                        />
                        <Label htmlFor={type.typeCode} className="text-sm cursor-pointer flex-1">
                          <div className="font-medium">{type.typeName}</div>
                          <div className="text-xs text-muted-foreground">{type.typeCode}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="font-medium">Credit Profiles *</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                    {creditProfiles.map((profile) => (
                      <div key={profile.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`credit-${profile.id}`}
                          checked={wizardData.creditProfiles.includes(profile.id)}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...wizardData.creditProfiles, profile.id]
                              : wizardData.creditProfiles.filter(id => id !== profile.id);
                            updateWizardData({ creditProfiles: updated });
                          }}
                        />
                        <Label htmlFor={`credit-${profile.id}`} className="text-sm cursor-pointer">
                          {profile.id}
                          <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <span>Priority: {profile.priority}</span>
                            <span>Credit Score: {profile.minCreditScore} - {profile.maxCreditScore}</span>
                            <span>Income: ${profile.minIncome?.toLocaleString()} - ${profile.maxIncome?.toLocaleString()}</span>
                            <span>Employment: {profile.employmentType}</span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="font-medium">Pricing Configurations *</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                    {pricingConfigs.map((config) => (
                      <div key={config.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`pricing-${config.id}`}
                          checked={wizardData.pricingConfigs.includes(config.id)}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...wizardData.pricingConfigs, config.id]
                              : wizardData.pricingConfigs.filter(id => id !== config.id);
                            updateWizardData({ pricingConfigs: updated });
                          }}
                        />
                        <Label htmlFor={`pricing-${config.id}`} className="text-sm cursor-pointer">
                          {config.id}
                          <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <span>Priority: {config.priority}</span>
                            <span>LTV: {config.minLTV}% - {config.maxLTV}%</span>
                            <span>Term: {config.minTerm} - {config.maxTerm} months</span>
                          </div>
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
            <CardHeader>
              <CardTitle className="text-lg">Program Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Program Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={wizardData.programStartDate}
                    onChange={(e) => updateWizardData({ programStartDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Program End Date *</Label>
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
            <CardHeader>
              <CardTitle className="text-lg">Lenders & Geography</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="font-medium">Lenders *</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
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

                <div className="space-y-3">
                  <Label className="font-medium">Geographic Regions *</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
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
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {isFormValid() ? "✓ All required fields completed" : "Complete all required fields to create program"}
          </div>
          <Button onClick={handleComplete} disabled={!isFormValid()}>
            Create Financial Program
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FinancialProgramWizard;
