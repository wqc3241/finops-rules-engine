
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { ApplicationFullDetails } from '@/types/application';
import { 
  FundingData, 
  SHORT_FUNDING_REASONS, 
  LENDER_HELD_REASONS,
  ShortFundingReason,
  LenderHeldReason 
} from '@/types/application/funding';
import { 
  extractFundingDateTimes, 
  getContractedLender, 
  formatCurrency, 
  formatPercentage,
  formatDateTime,
  calculateVariance 
} from '@/utils/fundingDataUtils';

interface FundingViewProps {
  applicationFullDetails: ApplicationFullDetails;
}

const FundingView: React.FC<FundingViewProps> = ({ applicationFullDetails }) => {
  const [fundingData, setFundingData] = useState<FundingData>({
    inputs: {
      estShortFundingAmount: null,
      shortFundingReason: '',
      shortFundNotes: '',
      lenderHeldOfferingReason: ''
    },
    variance: {
      expectedFundingAmount: null,
      actualFundingAmount: null,
      variance: null,
      varianceNotes: ''
    },
    documents: {
      dr0026Form: 'pending',
      st556Form: 'pending',
      letterOfGuarantee: 'pending'
    },
    caseManagement: {
      currentCaseId: null,
      status: 'none',
      autoOpenedAt: null,
      autoClosedAt: null
    },
    dateTimes: extractFundingDateTimes(applicationFullDetails)
  });

  // Calculate variance whenever expected or actual amounts change
  useEffect(() => {
    const variance = calculateVariance(
      fundingData.variance.expectedFundingAmount,
      fundingData.variance.actualFundingAmount
    );
    setFundingData(prev => ({
      ...prev,
      variance: { ...prev.variance, variance }
    }));
  }, [fundingData.variance.expectedFundingAmount, fundingData.variance.actualFundingAmount]);

  const contractedLender = getContractedLender(applicationFullDetails.dealStructure || []);

  const updateInputs = (field: keyof FundingData['inputs'], value: string | number | null) => {
    setFundingData(prev => ({
      ...prev,
      inputs: { ...prev.inputs, [field]: value }
    }));
  };

  const updateVariance = (field: keyof FundingData['variance'], value: string | number | null) => {
    setFundingData(prev => ({
      ...prev,
      variance: { ...prev.variance, [field]: value }
    }));
  };

  const handleDocumentGeneration = async (docType: keyof FundingData['documents']) => {
    setFundingData(prev => ({
      ...prev,
      documents: { ...prev.documents, [docType]: 'generated' }
    }));
    
    // Simulate document generation delay
    setTimeout(() => {
      setFundingData(prev => ({
        ...prev,
        documents: { ...prev.documents, [docType]: 'submitted' }
      }));
    }, 2000);
  };

  const handleSubmitForFunding = async () => {
    // Auto-generate all required documents
    await Promise.all([
      handleDocumentGeneration('dr0026Form'),
      handleDocumentGeneration('st556Form'),
      handleDocumentGeneration('letterOfGuarantee')
    ]);

    // Auto-open case for funding submission
    setFundingData(prev => ({
      ...prev,
      caseManagement: {
        currentCaseId: `CASE-${Date.now()}`,
        status: 'ready-for-funding',
        autoOpenedAt: new Date().toISOString(),
        autoClosedAt: null
      }
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'generated': 
      case 'submitted': return <Upload className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'generated': return 'default';
      case 'submitted': return 'default';
      case 'approved': return 'default';
      default: return 'destructive';
    }
  };

  return (
    <div className="space-y-6">
      {/* DateTime Tracking Section */}
      <Card>
        <CardHeader>
          <CardTitle>Funding Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">Initiated DateTime</Label>
              <div className="text-sm text-muted-foreground">{formatDateTime(fundingData.dateTimes.initiatedDateTime)}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Original Funding Submission DateTime</Label>
              <div className="text-sm text-muted-foreground">{formatDateTime(fundingData.dateTimes.originalFundingSubmissionDateTime)}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Latest Funding Submission DateTime</Label>
              <div className="text-sm text-muted-foreground">{formatDateTime(fundingData.dateTimes.latestFundingSubmissionDateTime)}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Original Contract Pending Docs DateTime</Label>
              <div className="text-sm text-muted-foreground">{formatDateTime(fundingData.dateTimes.originalContractPendingDocsDateTime)}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Latest Contract Pending Docs DateTime</Label>
              <div className="text-sm text-muted-foreground">{formatDateTime(fundingData.dateTimes.latestContractPendingDocsDateTime)}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Original Contract Returned DateTime</Label>
              <div className="text-sm text-muted-foreground">{formatDateTime(fundingData.dateTimes.originalContractReturnedDateTime)}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Latest Contract Returned DateTime</Label>
              <div className="text-sm text-muted-foreground">{formatDateTime(fundingData.dateTimes.latestContractReturnedDateTime)}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Contract Partially Signed DateTime</Label>
              <div className="text-sm text-muted-foreground">{formatDateTime(fundingData.dateTimes.contractPartiallySignedDateTime)}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Contract Signed DateTime</Label>
              <div className="text-sm text-muted-foreground">{formatDateTime(fundingData.dateTimes.contractSignedDateTime)}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Booked DateTime</Label>
              <div className="text-sm text-muted-foreground">{formatDateTime(fundingData.dateTimes.bookedDateTime)}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Original App Submitted DateTime</Label>
              <div className="text-sm text-muted-foreground">{formatDateTime(fundingData.dateTimes.originalAppSubmittedDateTime)}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Latest App Submitted DateTime</Label>
              <div className="text-sm text-muted-foreground">{formatDateTime(fundingData.dateTimes.latestAppSubmittedDateTime)}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Current Decision DateTime</Label>
              <div className="text-sm text-muted-foreground">{formatDateTime(fundingData.dateTimes.currentDecisionDateTime)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display Information Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applicant & Co-Applicant Credit Data */}
        <Card>
          <CardHeader>
            <CardTitle>Credit Approved Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Primary Applicant</h4>
              <p className="text-sm">Name: {applicationFullDetails.applicantInfo?.firstName} {applicationFullDetails.applicantInfo?.lastName}</p>
              <p className="text-sm">Income: {applicationFullDetails.applicantInfo?.incomeAmount}</p>
              <p className="text-sm">Employment: {applicationFullDetails.applicantInfo?.employmentType}</p>
            </div>
            {applicationFullDetails.coApplicantInfo && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold">Co-Applicant</h4>
                  <p className="text-sm">Name: {applicationFullDetails.coApplicantInfo.firstName} {applicationFullDetails.coApplicantInfo.lastName}</p>
                  <p className="text-sm">Income: {applicationFullDetails.coApplicantInfo.incomeAmount}</p>
                  <p className="text-sm">Employment: {applicationFullDetails.coApplicantInfo.employmentType}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Pricing Data */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Pricing Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Purchase Vehicle</h4>
              <p className="text-sm">Model: {applicationFullDetails.vehicleData?.model} {applicationFullDetails.vehicleData?.year}</p>
              <p className="text-sm">MSRP: {applicationFullDetails.vehicleData?.msrp}</p>
              <p className="text-sm">GCC Cash Price: {applicationFullDetails.vehicleData?.gccCashPrice}</p>
              <p className="text-sm">Total Discounts: {applicationFullDetails.vehicleData?.totalDiscountAmount}</p>
            </div>
            {applicationFullDetails.orderDetails?.vehicleTradeIn && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold">Trade-in Vehicle</h4>
                  <p className="text-sm">Vehicle: {applicationFullDetails.orderDetails.vehicleTradeIn.year} {applicationFullDetails.orderDetails.vehicleTradeIn.make} {applicationFullDetails.orderDetails.vehicleTradeIn.model}</p>
                  <p className="text-sm">Total Value: {applicationFullDetails.orderDetails.vehicleTradeIn.totalValue}</p>
                  <p className="text-sm">Payoff Amount: {applicationFullDetails.orderDetails.vehicleTradeIn.payoffAmount}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Lender Deal Structure */}
        <Card>
          <CardHeader>
            <CardTitle>Contracted Deal Structure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contractedLender ? (
              <div>
                <h4 className="font-semibold">Lender: {contractedLender.lenderName}</h4>
                <p className="text-sm">Status: {contractedLender.contractStatus}</p>
                <p className="text-sm">Term: {contractedLender.collapsedView.termLength}</p>
                <p className="text-sm">Monthly Payment: {contractedLender.collapsedView.monthlyPayments}</p>
                {contractedLender.collapsedView.dueAtSigning && (
                  <p className="text-sm">Due at Signing: {contractedLender.collapsedView.dueAtSigning}</p>
                )}
                {contractedLender.collapsedView.downPayment && (
                  <p className="text-sm">Down Payment: {contractedLender.collapsedView.downPayment}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No contracted lender found</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Funding Input Section */}
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
                value={fundingData.inputs.estShortFundingAmount || ''}
                onChange={(e) => updateInputs('estShortFundingAmount', e.target.value ? parseFloat(e.target.value) : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortFundingReason">Short Funding Reason</Label>
              <Select
                value={fundingData.inputs.shortFundingReason}
                onValueChange={(value) => updateInputs('shortFundingReason', value as ShortFundingReason)}
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
              value={fundingData.inputs.shortFundNotes}
              onChange={(e) => updateInputs('shortFundNotes', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lenderHeldReason">Lender Held Offering Reason</Label>
            <Select
              value={fundingData.inputs.lenderHeldOfferingReason}
              onValueChange={(value) => updateInputs('lenderHeldOfferingReason', value as LenderHeldReason)}
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

      {/* Variance Tracking Section */}
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
                value={fundingData.variance.expectedFundingAmount || ''}
                onChange={(e) => updateVariance('expectedFundingAmount', e.target.value ? parseFloat(e.target.value) : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actualFunding">Actual Funding Amount</Label>
              <Input
                id="actualFunding"
                type="number"
                placeholder="Enter actual amount"
                value={fundingData.variance.actualFundingAmount || ''}
                onChange={(e) => updateVariance('actualFundingAmount', e.target.value ? parseFloat(e.target.value) : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variance">Variance (Auto-calculated)</Label>
              <Input
                id="variance"
                type="number"
                value={fundingData.variance.variance || ''}
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
              value={fundingData.variance.varianceNotes}
              onChange={(e) => updateVariance('varianceNotes', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Document Generation & CTA Section */}
      <Card>
        <CardHeader>
          <CardTitle>Document Generation & Submission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>DR0026 Form</span>
              </div>
              <Badge variant={getStatusColor(fundingData.documents.dr0026Form)}>
                {getStatusIcon(fundingData.documents.dr0026Form)}
                {fundingData.documents.dr0026Form}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>ST556 Form</span>
              </div>
              <Badge variant={getStatusColor(fundingData.documents.st556Form)}>
                {getStatusIcon(fundingData.documents.st556Form)}
                {fundingData.documents.st556Form}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Letter of Guarantee</span>
              </div>
              <Badge variant={getStatusColor(fundingData.documents.letterOfGuarantee)}>
                {getStatusIcon(fundingData.documents.letterOfGuarantee)}
                {fundingData.documents.letterOfGuarantee}
              </Badge>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleSubmitForFunding} className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              Submit for Funding
            </Button>
            {fundingData.caseManagement.currentCaseId && (
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline">
                  Case: {fundingData.caseManagement.currentCaseId}
                </Badge>
                <Badge variant={fundingData.caseManagement.status === 'ready-for-funding' ? 'default' : 'secondary'}>
                  {fundingData.caseManagement.status.replace('-', ' ')}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FundingView;
