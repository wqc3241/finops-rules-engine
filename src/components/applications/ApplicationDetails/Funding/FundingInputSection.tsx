
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FundingInputData, 
  VarianceData,
  SHORT_FUNDING_REASONS, 
  LENDER_HELD_REASONS,
  ShortFundingReason,
  LenderHeldReason 
} from '@/types/application/funding';

interface FundingInputSectionProps {
  inputs: FundingInputData;
  variance: VarianceData;
  onUpdateInputs: (field: keyof FundingInputData, value: string | number | null) => void;
  onUpdateVariance: (field: keyof VarianceData, value: string | number | null) => void;
}

const FundingInputSection: React.FC<FundingInputSectionProps> = ({ 
  inputs, 
  variance, 
  onUpdateInputs, 
  onUpdateVariance 
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Funding Input & Variance Tracking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        {/* Funding Input Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Funding Input</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="estShortFunding" className="text-xs">Est. Short Funding Amount</Label>
              <Input
                id="estShortFunding"
                type="number"
                placeholder="Enter amount"
                value={inputs.estShortFundingAmount || ''}
                onChange={(e) => onUpdateInputs('estShortFundingAmount', e.target.value ? parseFloat(e.target.value) : null)}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="shortFundingReason" className="text-xs">Short Funding Reason</Label>
              <Select
                value={inputs.shortFundingReason}
                onValueChange={(value) => onUpdateInputs('shortFundingReason', value as ShortFundingReason)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {SHORT_FUNDING_REASONS.map((reason) => (
                    <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="shortFundNotes" className="text-xs">Short Fund Notes</Label>
            <Textarea
              id="shortFundNotes"
              placeholder="Enter notes"
              value={inputs.shortFundNotes}
              onChange={(e) => onUpdateInputs('shortFundNotes', e.target.value)}
              className="min-h-[60px]"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lenderHeldReason" className="text-xs">Lender Held Offering Reason</Label>
            <Select
              value={inputs.lenderHeldOfferingReason}
              onValueChange={(value) => onUpdateInputs('lenderHeldOfferingReason', value as LenderHeldReason)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {LENDER_HELD_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Variance Tracking Section */}
        <div className="space-y-3 border-t pt-4">
          <h3 className="text-sm font-medium text-muted-foreground">Variance Tracking</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="expectedFunding" className="text-xs">Expected Funding Amount</Label>
              <Input
                id="expectedFunding"
                type="number"
                placeholder="Enter expected amount"
                value={variance.expectedFundingAmount || ''}
                onChange={(e) => onUpdateVariance('expectedFundingAmount', e.target.value ? parseFloat(e.target.value) : null)}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="actualFunding" className="text-xs">Actual Funding Amount</Label>
              <Input
                id="actualFunding"
                type="number"
                placeholder="Enter actual amount"
                value={variance.actualFundingAmount || ''}
                onChange={(e) => onUpdateVariance('actualFundingAmount', e.target.value ? parseFloat(e.target.value) : null)}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="variance" className="text-xs">Variance (Auto-calculated)</Label>
              <Input
                id="variance"
                type="number"
                value={variance.variance || ''}
                readOnly
                className="bg-muted h-8"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="varianceNotes" className="text-xs">Variance Notes</Label>
            <Textarea
              id="varianceNotes"
              placeholder="Enter variance notes"
              value={variance.varianceNotes}
              onChange={(e) => onUpdateVariance('varianceNotes', e.target.value)}
              className="min-h-[60px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundingInputSection;
