import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WizardData } from "../FinancialProgramWizard";

// Repeat mock products list so we can look up the label
const financialProducts = [
  { id: "USLN", label: "USLN - US Loan", type: "Loan", geoCode: "NA-US" },
  { id: "USLE", label: "USLE - US Lease", type: "Lease", geoCode: "NA-US" },
  { id: "KSABM", label: "KSABM - KSA Balloon Mortgage", type: "Loan", geoCode: "ME-KSA" },
  { id: "KSABA5050", label: "KSABA5050 - KSA Balloon 50/50", type: "Loan", geoCode: "ME-KSA" }
];

interface ConfirmationStepProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

const ConfirmationStep = ({ data }: ConfirmationStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Review & Confirm</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Please review all the configuration details before creating the financial program.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vehicle Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm font-medium">Vehicle Style:</span>
              <p className="text-sm text-muted-foreground">{data.vehicleStyleId}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Vehicle Condition:</span>
              <p className="text-sm text-muted-foreground">{data.vehicleCondition}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Financial Product</CardTitle>
          </CardHeader>
          <CardContent>
            {data.financialProduct ? (
              <Badge variant="secondary">
                {financialProducts.find(p => p.id === data.financialProduct)?.label || data.financialProduct}
              </Badge>
            ) : (
              <span className="text-sm text-muted-foreground">None selected</span>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pricing Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {data.pricingTypes.map(type => (
                <Badge key={type} variant="outline">{type}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Program Dates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm font-medium">Start Date:</span>
              <p className="text-sm text-muted-foreground">{new Date(data.programStartDate).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-sm font-medium">End Date:</span>
              <p className="text-sm text-muted-foreground">{new Date(data.programEndDate).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Credit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.creditProfile && (
              <>
                <div>
                  <span className="text-sm font-medium">Profile ID:</span>
                  <p className="text-sm text-muted-foreground">{data.creditProfile.id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Priority:</span>
                  <p className="text-sm text-muted-foreground">{data.creditProfile.priority}</p>
                </div>
                {data.creditProfile.minCreditScore && (
                  <div>
                    <span className="text-sm font-medium">Credit Score Range:</span>
                    <p className="text-sm text-muted-foreground">
                      {data.creditProfile.minCreditScore} - {data.creditProfile.maxCreditScore}
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pricing Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.pricingConfig && (
              <>
                <div>
                  <span className="text-sm font-medium">Config ID:</span>
                  <p className="text-sm text-muted-foreground">{data.pricingConfig.id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Priority:</span>
                  <p className="text-sm text-muted-foreground">{data.pricingConfig.priority}</p>
                </div>
                {data.pricingConfig.minLTV && (
                  <div>
                    <span className="text-sm font-medium">LTV Range:</span>
                    <p className="text-sm text-muted-foreground">
                      {data.pricingConfig.minLTV}% - {data.pricingConfig.maxLTV}%
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lenders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {data.lenders.map(lender => (
                <Badge key={lender} variant="secondary">{lender}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Geographic Regions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {data.geoCodes.map(geo => (
                <Badge key={geo} variant="outline">{geo}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> A unique program code will be automatically generated when you create the program.
        </p>
      </div>
    </div>
  );
};

export default ConfirmationStep;
