import { Card } from '@/components/ui/card';
import { AdvertisedOfferWizardData } from '@/types/advertisedOffer';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface OfferConfirmationStepProps {
  data: AdvertisedOfferWizardData;
  onUpdate: (updates: Partial<AdvertisedOfferWizardData>) => void;
}

const OfferConfirmationStep = ({ data }: OfferConfirmationStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground mb-4">
        <CheckCircle2 className="w-5 h-5" />
        <p>Review all advertised offers before creating them</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Offers</p>
          <p className="text-3xl font-bold text-primary">{data.selected_programs.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Offer Period</p>
          <p className="text-lg font-semibold">
            {new Date(data.offer_start_date).toLocaleDateString()} - {new Date(data.offer_end_date).toLocaleDateString()}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Duration</p>
          <p className="text-lg font-semibold">
            {Math.ceil((new Date(data.offer_end_date).getTime() - new Date(data.offer_start_date).getTime()) / (1000 * 60 * 60 * 24))} days
          </p>
        </Card>
      </div>

      {/* Offers Table */}
      <Card>
        <div className="p-4 border-b">
          <h3 className="font-semibold">Offers to be Created</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program Code</TableHead>
                <TableHead>Order Type</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Down Payment</TableHead>
                <TableHead>Credit Score</TableHead>
                <TableHead>Monthly Payment</TableHead>
                <TableHead>APR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.selected_programs.map((programCode) => {
                const config = data.program_configs[programCode];
                const details = data.offer_details[programCode];

                return (
                  <TableRow key={programCode}>
                    <TableCell className="font-medium">{programCode}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{config.order_type}</Badge>
                    </TableCell>
                    <TableCell>{config.term} mo</TableCell>
                    <TableCell>${config.down_payment || 0}</TableCell>
                    <TableCell>
                      {config.credit_score_min && config.credit_score_max
                        ? `${config.credit_score_min} - ${config.credit_score_max}`
                        : 'Any'}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${details?.monthly_payment?.toFixed(2) || 'N/A'}
                    </TableCell>
                    <TableCell>{details?.apr || 'N/A'}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.selected_programs.map((programCode) => {
          const details = data.offer_details[programCode];
          if (!details?.marketing_description && !details?.disclosure) return null;

          return (
            <Card key={programCode} className="p-4">
              <h4 className="font-semibold mb-2">{programCode}</h4>
              {details.marketing_description && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Marketing</p>
                  <p className="text-sm">{details.marketing_description}</p>
                </div>
              )}
              {details.disclosure && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Disclosure</p>
                  <p className="text-xs text-muted-foreground">{details.disclosure}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OfferConfirmationStep;
