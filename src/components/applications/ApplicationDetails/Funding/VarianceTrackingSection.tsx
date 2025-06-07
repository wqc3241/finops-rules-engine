
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
      <CardHeader>
        <CardTitle>Variance Tracking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expectedFunding">Expected Funding Amount</Label>
            <Input
              id="expectedFunding"
              type="number"
              placeholder="Enter expected amount"
              value={variance.expectedFundingAmount || ''}
              onChange={(e) => onUpdateVariance('expectedFundingAmount', e.target.value ? parseFloat(e.target.value) : null)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="actualFunding">Actual Funding Amount</Label>
            <Input
              id="actualFunding"
              type="number"
              placeholder="Enter actual amount"
              value={variance.actualFundingAmount || ''}
              onChange={(e) => onUpdateVariance('actualFundingAmount', e.target.value ? parseFloat(e.target.value) : null)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="variance">Variance (Auto-calculated)</Label>
            <Input
              id="variance"
              type="number"
              value={variance.variance || ''}
              readOnly
              className="bg-muted"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="varianceNotes">Variance Notes</Label>
          <Textarea
            id="varianceNotes"
            placeholder="Enter variance notes"
            value={variance.varianceNotes}
            onChange={(e) => onUpdateVariance('varianceNotes', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default VarianceTrackingSection;
