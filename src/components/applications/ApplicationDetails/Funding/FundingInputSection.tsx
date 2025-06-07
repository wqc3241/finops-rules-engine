
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
      <CardHeader>
        <CardTitle>Funding Input Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="estShortFunding">Est. Short Funding Amount</Label>
            <Input
              id="estShortFunding"
              type="number"
              placeholder="Enter amount"
              value={inputs.estShortFundingAmount || ''}
              onChange={(e) => onUpdateInputs('estShortFundingAmount', e.target.value ? parseFloat(e.target.value) : null)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortFundingReason">Short Funding Reason</Label>
            <Select
              value={inputs.shortFundingReason}
              onValueChange={(value) => onUpdateInputs('shortFundingReason', value as ShortFundingReason)}
            >
              <SelectTrigger>
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
        <div className="space-y-2">
          <Label htmlFor="shortFundNotes">Short Fund Notes</Label>
          <Textarea
            id="shortFundNotes"
            placeholder="Enter notes"
            value={inputs.shortFundNotes}
            onChange={(e) => onUpdateInputs('shortFundNotes', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lenderHeldReason">Lender Held Offering Reason</Label>
          <Select
            value={inputs.lenderHeldOfferingReason}
            onValueChange={(value) => onUpdateInputs('lenderHeldOfferingReason', value as LenderHeldReason)}
          >
            <SelectTrigger>
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
