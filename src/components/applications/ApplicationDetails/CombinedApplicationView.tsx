
import React, { useState, useRef } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ApplicationData from './ApplicationData';
import CombinedFinancialView from './CombinedFinancialView';
import OrderDetailsView from './OrderDetailsView';
import { ApplicationFullDetails, Note } from '@/types/application';

interface CombinedApplicationViewProps {
  applicationFullDetails: ApplicationFullDetails;
  notes: Note[];
  activeSection?: string;
}

const CombinedApplicationView: React.FC<CombinedApplicationViewProps> = ({
  applicationFullDetails,
  notes,
  activeSection
}) => {
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    financial: true,
    order: true
  });

  const detailsRef = useRef<HTMLDivElement>(null);
  const financialRef = useRef<HTMLDivElement>(null);
  const orderRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to section when activeSection changes
  React.useEffect(() => {
    if (activeSection) {
      const refs = {
        details: detailsRef,
        'financial-summary': financialRef,
        'order-details': orderRef
      };
      
      const targetRef = refs[activeSection as keyof typeof refs];
      if (targetRef?.current) {
        targetRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }
  }, [activeSection]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getFinancialSummaryWithPresentedLender = () => {
    const financialSummary = { ...applicationFullDetails.financialSummary };
    
    // If we have lender summaries and a presented lender
    if (financialSummary.lenderSummaries) {
      // Mark the presented lender logic can be added here if needed
    }
    
    return financialSummary;
  };

  // Ensure applicationType is properly typed as 'Lease' | 'Loan'
  const applicationType = (applicationFullDetails.details.type === 'Lease' || applicationFullDetails.details.type === 'Loan') 
    ? applicationFullDetails.details.type as 'Lease' | 'Loan'
    : 'Loan'; // fallback to 'Loan' if type is not recognized

  return (
    <div className="space-y-6">
      {/* Application Details Section */}
      <div ref={detailsRef} id="details-section">
        <Collapsible 
          open={expandedSections.details} 
          onOpenChange={() => toggleSection('details')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h2 className="text-lg font-semibold">Application Details</h2>
            {expandedSections.details ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <ApplicationData
              applicantInfo={applicationFullDetails.applicantInfo}
              coApplicantInfo={applicationFullDetails.coApplicantInfo}
              vehicleData={applicationFullDetails.vehicleData}
              appDtReferences={applicationFullDetails.appDtReferences}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Financial Summary Section */}
      <div ref={financialRef} id="financial-section">
        <Collapsible 
          open={expandedSections.financial} 
          onOpenChange={() => toggleSection('financial')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h2 className="text-lg font-semibold">Financial Summary</h2>
            {expandedSections.financial ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <CombinedFinancialView 
              financialSummary={getFinancialSummaryWithPresentedLender()}
              dealStructure={applicationFullDetails.dealStructure}
              applicationType={applicationType}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Order Details Section */}
      <div ref={orderRef} id="order-section">
        <Collapsible 
          open={expandedSections.order} 
          onOpenChange={() => toggleSection('order')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h2 className="text-lg font-semibold">Order Details</h2>
            {expandedSections.order ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <OrderDetailsView orderDetails={applicationFullDetails.orderDetails} />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default CombinedApplicationView;
