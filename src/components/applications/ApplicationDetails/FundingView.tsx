
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApplicationFullDetails } from '@/types/application';
import { 
  FundingData, 
  ShortFundingReason,
  LenderHeldReason 
} from '@/types/application/funding';
import { 
  extractFundingDateTimes, 
  calculateVariance 
} from '@/utils/fundingDataUtils';
import ApplicationData from './ApplicationData';
import CustomerFinancialSummaryView from './Funding/CustomerFinancialSummaryView';
import FundingTimeline from './Funding/FundingTimeline';
import FundingInputSection from './Funding/FundingInputSection';
import VarianceTrackingSection from './Funding/VarianceTrackingSection';
import DocumentSubmissionSection from './Funding/DocumentSubmissionSection';

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

  return (
    <div className="space-y-2">
      {/* Side by side layout for Complete Application Details and Customer Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* Complete Application Details Section */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-base">Complete Application Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <ApplicationData
              applicantInfo={applicationFullDetails.applicantInfo}
              coApplicantInfo={applicationFullDetails.coApplicantInfo}
              vehicleData={applicationFullDetails.vehicleData}
              appDtReferences={applicationFullDetails.appDtReferences}
            />
          </CardContent>
        </Card>

        {/* Customer Financial Summary Section */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-base">Complete Customer Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            {applicationFullDetails.financialSummary && (
              <CustomerFinancialSummaryView 
                financialSummary={applicationFullDetails.financialSummary}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Side by side layout for Funding Timeline and Funding Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <FundingTimeline dateTimes={fundingData.dateTimes} />
        <FundingInputSection 
          inputs={fundingData.inputs}
          onUpdateInputs={updateInputs}
        />
      </div>

      {/* Side by side layout for Variance Tracking and Document Submission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <VarianceTrackingSection 
          variance={fundingData.variance}
          onUpdateVariance={updateVariance}
        />
        <DocumentSubmissionSection 
          documents={fundingData.documents}
          caseManagement={fundingData.caseManagement}
          onSubmitForFunding={handleSubmitForFunding}
        />
      </div>
    </div>
  );
};

export default FundingView;
