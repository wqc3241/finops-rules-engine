
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FundingDateTimes } from '@/types/application/funding';
import { formatDateTime } from '@/utils/fundingDataUtils';

interface FundingTimelineProps {
  dateTimes: FundingDateTimes;
}

const FundingTimeline: React.FC<FundingTimelineProps> = ({ dateTimes }) => {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const handleRowClick = (rowKey: string) => {
    setSelectedRow(selectedRow === rowKey ? null : rowKey);
  };

  const getRowClassName = (rowKey: string) => {
    const baseClasses = "flex justify-between items-center cursor-pointer p-2 rounded transition-colors hover:bg-muted/50";
    return selectedRow === rowKey 
      ? `${baseClasses} bg-primary/10 border border-primary/20`
      : baseClasses;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Funding Timeline</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-0.5">
          <div className={getRowClassName('initiated')} onClick={() => handleRowClick('initiated')}>
            <Label className="text-xs font-medium">Initiated DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.initiatedDateTime)}</div>
          </div>
          <div className={getRowClassName('originalFunding')} onClick={() => handleRowClick('originalFunding')}>
            <Label className="text-xs font-medium">Original Funding Submission DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.originalFundingSubmissionDateTime)}</div>
          </div>
          <div className={getRowClassName('latestFunding')} onClick={() => handleRowClick('latestFunding')}>
            <Label className="text-xs font-medium">Latest Funding Submission DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.latestFundingSubmissionDateTime)}</div>
          </div>
          <div className={getRowClassName('originalContractPending')} onClick={() => handleRowClick('originalContractPending')}>
            <Label className="text-xs font-medium">Original Contract Pending Docs DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.originalContractPendingDocsDateTime)}</div>
          </div>
          <div className={getRowClassName('latestContractPending')} onClick={() => handleRowClick('latestContractPending')}>
            <Label className="text-xs font-medium">Latest Contract Pending Docs DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.latestContractPendingDocsDateTime)}</div>
          </div>
          <div className={getRowClassName('originalContractReturned')} onClick={() => handleRowClick('originalContractReturned')}>
            <Label className="text-xs font-medium">Original Contract Returned DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.originalContractReturnedDateTime)}</div>
          </div>
          <div className={getRowClassName('latestContractReturned')} onClick={() => handleRowClick('latestContractReturned')}>
            <Label className="text-xs font-medium">Latest Contract Returned DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.latestContractReturnedDateTime)}</div>
          </div>
          <div className={getRowClassName('contractPartiallySignedDateTime')} onClick={() => handleRowClick('contractPartiallySignedDateTime')}>
            <Label className="text-xs font-medium">Contract Partially Signed DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.contractPartiallySignedDateTime)}</div>
          </div>
          <div className={getRowClassName('contractSigned')} onClick={() => handleRowClick('contractSigned')}>
            <Label className="text-xs font-medium">Contract Signed DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.contractSignedDateTime)}</div>
          </div>
          <div className={getRowClassName('booked')} onClick={() => handleRowClick('booked')}>
            <Label className="text-xs font-medium">Booked DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.bookedDateTime)}</div>
          </div>
          <div className={getRowClassName('originalAppSubmitted')} onClick={() => handleRowClick('originalAppSubmitted')}>
            <Label className="text-xs font-medium">Original App Submitted DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.originalAppSubmittedDateTime)}</div>
          </div>
          <div className={getRowClassName('latestAppSubmitted')} onClick={() => handleRowClick('latestAppSubmitted')}>
            <Label className="text-xs font-medium">Latest App Submitted DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.latestAppSubmittedDateTime)}</div>
          </div>
          <div className={getRowClassName('currentDecision')} onClick={() => handleRowClick('currentDecision')}>
            <Label className="text-xs font-medium">Current Decision DateTime</Label>
            <div className="text-xs text-muted-foreground">{formatDateTime(dateTimes.currentDecisionDateTime)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundingTimeline;
