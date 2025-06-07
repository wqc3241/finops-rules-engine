
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { VarianceData } from '@/types/application/funding';

interface VarianceTrackingSectionProps {
  variance: VarianceData;
  onUpdateVariance: (field: keyof VarianceData, value: string | number | null) => void;
}

const VarianceTrackingSection: React.FC<VarianceTrackingSectionProps> = ({ variance, onUpdateVariance }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Variance Tracking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
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
      </CardContent>
    </Card>
  );
};

export default VarianceTrackingSection;
