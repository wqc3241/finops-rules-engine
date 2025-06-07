
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FundingDateTimes } from '@/types/application/funding';
import { formatDateTime } from '@/utils/fundingDataUtils';

interface FundingTimelineProps {
  dateTimes: FundingDateTimes;
}

const FundingTimeline: React.FC<FundingTimelineProps> = ({ dateTimes }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Funding Timeline</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <Label className="text-xs font-medium">Initiated DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.initiatedDateTime)}</div>
          </div>
          <div>
            <Label className="text-xs font-medium">Original Funding Submission DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.originalFundingSubmissionDateTime)}</div>
          </div>
          <div>
            <Label className="text-xs font-medium">Latest Funding Submission DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.latestFundingSubmissionDateTime)}</div>
          </div>
          <div>
            <Label className="text-xs font-medium">Original Contract Pending Docs DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.originalContractPendingDocsDateTime)}</div>
          </div>
          <div>
            <Label className="text-xs font-medium">Latest Contract Pending Docs DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.latestContractPendingDocsDateTime)}</div>
          </div>
          <div>
            <Label className="text-xs font-medium">Original Contract Returned DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.originalContractReturnedDateTime)}</div>
          </div>
          <div>
            <Label className="text-xs font-medium">Latest Contract Returned DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.latestContractReturnedDateTime)}</div>
          </div>
          <div>
            <Label className="text-xs font-medium">Contract Partially Signed DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.contractPartiallySignedDateTime)}</div>
          </div>
          <div>
            <Label className="text-xs font-medium">Contract Signed DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.contractSignedDateTime)}</div>
          </div>
          <div>
            <Label className="text-xs font-medium">Booked DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.bookedDateTime)}</div>
          </div>
          <div>
            <Label className="text-xs font-medium">Original App Submitted DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.originalAppSubmittedDateTime)}</div>
          </div>
          <div>
            <Label className="text-xs font-medium">Latest App Submitted DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.latestAppSubmittedDateTime)}</div>
          </div>
          <div>
            <Label className="text-xs font-medium">Current Decision DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.currentDecisionDateTime)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundingTimeline;
