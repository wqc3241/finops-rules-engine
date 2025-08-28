import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronDownIcon, ChevronUpIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface PricingTypeConfig {
  creditProfiles: string[];
  pricingConfigs: string[];
}

export interface ConfigurationData {
  pricingTypeConfigs: Record<string, PricingTypeConfig>;
}

interface ConfigurationStepProps {
  data: ConfigurationData;
  onUpdate: (updates: Partial<ConfigurationData>) => void;
  selectedPricingTypes: string[];
  availableCreditProfiles: Array<{ id: string; priority: number; minCreditScore?: number; maxCreditScore?: number; minIncome?: number; maxIncome?: number; employmentType?: string; }>;
  availablePricingConfigs: Array<{ id: string; minLTV?: number; maxLTV?: number; minTerm?: number; maxTerm?: number; priority: number; }>;
  pricingTypeOptions: Array<{ typeCode: string; typeName: string; }>;
}

const ConfigurationStep = ({
  data,
  onUpdate,
  selectedPricingTypes,
  availableCreditProfiles,
  availablePricingConfigs,
  pricingTypeOptions
}: ConfigurationStepProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Initialize collapsed state - open first pricing type by default
  useEffect(() => {
    if (selectedPricingTypes.length > 0) {
      setOpenSections(prev => ({
        ...prev,
        [selectedPricingTypes[0]]: true
      }));
    }
  }, [selectedPricingTypes]);

  const toggleSection = (pricingType: string) => {
    setOpenSections(prev => ({
      ...prev,
      [pricingType]: !prev[pricingType]
    }));
  };

  const updatePricingTypeConfig = (pricingType: string, updates: Partial<PricingTypeConfig>) => {
    const newConfigs = {
      ...data.pricingTypeConfigs,
      [pricingType]: {
        ...data.pricingTypeConfigs[pricingType],
        ...updates
      }
    };
    onUpdate({ pricingTypeConfigs: newConfigs });
  };

  const handleCreditProfileToggle = (pricingType: string, profileId: string, checked: boolean) => {
    const currentConfig = data.pricingTypeConfigs[pricingType] || { creditProfiles: [], pricingConfigs: [] };
    const updatedProfiles = checked
      ? [...currentConfig.creditProfiles, profileId]
      : currentConfig.creditProfiles.filter(id => id !== profileId);
    
    updatePricingTypeConfig(pricingType, { creditProfiles: updatedProfiles });
  };

  const handlePricingConfigToggle = (pricingType: string, configId: string, checked: boolean) => {
    const currentConfig = data.pricingTypeConfigs[pricingType] || { creditProfiles: [], pricingConfigs: [] };
    const updatedConfigs = checked
      ? [...currentConfig.pricingConfigs, configId]
      : currentConfig.pricingConfigs.filter(id => id !== configId);
    
    updatePricingTypeConfig(pricingType, { pricingConfigs: updatedConfigs });
  };

  const getPricingTypeName = (typeCode: string) => {
    const option = pricingTypeOptions.find(pt => pt.typeCode === typeCode);
    return option ? option.typeName : typeCode;
  };

  const isConfigurationComplete = (pricingType: string) => {
    const config = data.pricingTypeConfigs[pricingType];
    return config && config.creditProfiles.length > 0 && config.pricingConfigs.length > 0;
  };

  const getCompletionStats = () => {
    const total = selectedPricingTypes.length;
    const completed = selectedPricingTypes.filter(pt => isConfigurationComplete(pt)).length;
    return { completed, total };
  };

  const { completed, total } = getCompletionStats();

  if (selectedPricingTypes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No Pricing Types Selected</h3>
          <p className="text-sm text-muted-foreground">
            Please go back to Page 1 and select at least one pricing type to configure.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Configuration Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Configuration Overview</CardTitle>
            <Badge variant={completed === total ? "default" : "secondary"}>
              {completed}/{total} Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Configure credit profiles and pricing configurations for each selected pricing type. 
            All pricing types must have at least one credit profile and one pricing configuration.
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedPricingTypes.map(pricingType => (
              <Badge 
                key={pricingType} 
                variant={isConfigurationComplete(pricingType) ? "default" : "outline"}
                className="flex items-center gap-1"
              >
                {isConfigurationComplete(pricingType) ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                {getPricingTypeName(pricingType)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Type Configurations */}
      <div className="space-y-3">
        {selectedPricingTypes.map((pricingType, index) => (
          <Card key={pricingType}>
            <Collapsible 
              open={openSections[pricingType] || false} 
              onOpenChange={() => toggleSection(pricingType)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-3">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {isConfigurationComplete(pricingType) ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-500" />
                        )}
                        <CardTitle className="text-base">
                          {getPricingTypeName(pricingType)}
                        </CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {pricingType}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {isConfigurationComplete(pricingType) && (
                        <Badge variant="default" className="text-xs">
                          Configured
                        </Badge>
                      )}
                      {openSections[pricingType] ? (
                        <ChevronUpIcon className="w-4 h-4" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-4">
                  {/* Credit Profiles Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-medium">Credit Profiles *</Label>
                      <Badge variant="outline" className="text-xs">
                        {data.pricingTypeConfigs[pricingType]?.creditProfiles?.length || 0} selected
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded-lg p-3">
                      {availableCreditProfiles.map((profile) => (
                        <div key={profile.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${pricingType}-credit-${profile.id}`}
                            checked={data.pricingTypeConfigs[pricingType]?.creditProfiles?.includes(profile.id) || false}
                            onCheckedChange={(checked) => 
                              handleCreditProfileToggle(pricingType, profile.id, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={`${pricingType}-credit-${profile.id}`}
                            className="text-xs cursor-pointer flex-1"
                            title={`Priority: ${profile.priority}, Credit Score: ${profile.minCreditScore || 'N/A'}-${profile.maxCreditScore || 'N/A'}, Income: ${profile.minIncome || 'N/A'}-${profile.maxIncome || 'N/A'}`}
                          >
                            {profile.id}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Pricing Configurations Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-medium">Pricing Configurations *</Label>
                      <Badge variant="outline" className="text-xs">
                        {data.pricingTypeConfigs[pricingType]?.pricingConfigs?.length || 0} selected
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded-lg p-3">
                      {availablePricingConfigs.map((config) => (
                        <div key={config.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${pricingType}-pricing-${config.id}`}
                            checked={data.pricingTypeConfigs[pricingType]?.pricingConfigs?.includes(config.id) || false}
                            onCheckedChange={(checked) => 
                              handlePricingConfigToggle(pricingType, config.id, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={`${pricingType}-pricing-${config.id}`}
                            className="text-xs cursor-pointer flex-1"
                            title={`Priority: ${config.priority}, LTV: ${config.minLTV || 'N/A'}-${config.maxLTV || 'N/A'}%, Term: ${config.minTerm || 'N/A'}-${config.maxTerm || 'N/A'} months`}
                          >
                            {config.id}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConfigurationStep;