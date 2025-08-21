import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { WizardData } from "../FinancialProgramWizard";

interface FinancialProgramPreview {
  programCode: string;
  vehicleStyleId: string;
  vehicleStyleLabel: string;
  financingVehicleCondition: string;
  financialProductId: string;
  programStartDate: string;
  programEndDate: string;
  isActive: string;
  advertised: string;
  version: number;
  priority: number;
}

interface ConfirmationStepProps {
  data: WizardData;
  vehicleStyleOptions: Array<{ id: string; label: string }>;
  financialProducts: Array<{ id: string; productType: string; productSubtype?: string }>;
  programPreviews: FinancialProgramPreview[];
}

const ConfirmationStep = ({ data, vehicleStyleOptions, financialProducts, programPreviews }: ConfirmationStepProps) => {
  const selectedFinancialProduct = useMemo(() => {
    return financialProducts.find(p => p.id === data.financialProduct);
  }, [financialProducts, data.financialProduct]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Confirmation</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Review the {programPreviews.length} financial program{programPreviews.length > 1 ? 's' : ''} that will be created. Click "Create Programs" to proceed.
        </p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Configuration Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs font-medium text-muted-foreground">Vehicle Styles</div>
              <div className="text-sm">{data.vehicleStyleIds.length} selected</div>
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">Vehicle Condition</div>
              <div className="text-sm">{data.vehicleCondition}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">Financial Product</div>
              <div className="text-sm">
                {selectedFinancialProduct ? 
                  `${selectedFinancialProduct.productType}${selectedFinancialProduct.productSubtype ? ` - ${selectedFinancialProduct.productSubtype}` : ''}` 
                  : data.financialProduct}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">Program Period</div>
              <div className="text-sm">{data.programStartDate} to {data.programEndDate}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs font-medium text-muted-foreground">Pricing Types</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.pricingTypes.slice(0, 3).map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">{type}</Badge>
                ))}
                {data.pricingTypes.length > 3 && (
                  <Badge variant="secondary" className="text-xs">+{data.pricingTypes.length - 3}</Badge>
                )}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">Credit Profiles</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.creditProfiles.slice(0, 2).map((profile) => (
                  <Badge key={profile} variant="secondary" className="text-xs">{profile}</Badge>
                ))}
                {data.creditProfiles.length > 2 && (
                  <Badge variant="secondary" className="text-xs">+{data.creditProfiles.length - 2}</Badge>
                )}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">Lenders</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.lenders.slice(0, 2).map((lender) => (
                  <Badge key={lender} variant="secondary" className="text-xs">{lender}</Badge>
                ))}
                {data.lenders.length > 2 && (
                  <Badge variant="secondary" className="text-xs">+{data.lenders.length - 2}</Badge>
                )}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">Geo Codes</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.geoCodes.slice(0, 2).map((geo) => (
                  <Badge key={geo} variant="secondary" className="text-xs">{geo}</Badge>
                ))}
                {data.geoCodes.length > 2 && (
                  <Badge variant="secondary" className="text-xs">+{data.geoCodes.length - 2}</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Programs Preview Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Programs to be Created ({programPreviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Program Code</TableHead>
                  <TableHead className="text-xs">Vehicle Style</TableHead>
                  <TableHead className="text-xs">Condition</TableHead>
                  <TableHead className="text-xs">Financial Product</TableHead>
                  <TableHead className="text-xs">Start Date</TableHead>
                  <TableHead className="text-xs">End Date</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programPreviews.map((program, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-xs font-mono">{program.programCode}</TableCell>
                    <TableCell className="text-xs">{program.vehicleStyleLabel}</TableCell>
                    <TableCell className="text-xs">{program.financingVehicleCondition}</TableCell>
                    <TableCell className="text-xs">{program.financialProductId}</TableCell>
                    <TableCell className="text-xs">{program.programStartDate}</TableCell>
                    <TableCell className="text-xs">{program.programEndDate}</TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="default" className="text-xs">Active</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmationStep;