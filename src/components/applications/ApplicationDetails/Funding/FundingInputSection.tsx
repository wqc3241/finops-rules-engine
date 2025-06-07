
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FundingInputData, 
  SHORT_FUNDING_REASONS, 
  LENDER_HELD_REASONS,
  ShortFundingReason,
  LenderHeldReason 
} from '@/types/application/funding';

interface FundingInputSectionProps {
  inputs: FundingInputData;
  onUpdateInputs: (field: keyof FundingInputData, value: string | number | null) => void;
}

const FundingInputSection: React.FC<FundingInputSectionProps> = ({ inputs, onUpdateInputs }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Funding Input Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
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
      </CardContent>
    </Card>
  );
};

export default FundingInputSection;
