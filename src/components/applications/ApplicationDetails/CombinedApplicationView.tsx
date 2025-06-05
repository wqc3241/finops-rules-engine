
import React, { useState, useRef, useEffect } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ApplicationData from './ApplicationData';
import CombinedFinancialView from './CombinedFinancialView';
import OrderDetailsView from './OrderDetailsView';
import { ApplicationFullDetails, Note } from '@/types/application';

interface CombinedApplicationViewProps {
  applicationFullDetails: ApplicationFullDetails;
  notes: Note[];
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const CombinedApplicationView: React.FC<CombinedApplicationViewProps> = ({
  applicationFullDetails,
  notes,
  activeSection,
  onSectionChange
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
  useEffect(() => {
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

  // Scroll detection for highlighting active section
  useEffect(() => {
    const handleScroll = () => {
      if (!onSectionChange) return;

      const sections = [
        { id: 'details', ref: detailsRef },
        { id: 'financial-summary', ref: financialRef },
        { id: 'order-details', ref: orderRef }
      ];

      const scrollPosition = window.scrollY + 200; // Offset for sticky header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          const elementTop = window.scrollY + rect.top;
          
          if (scrollPosition >= elementTop) {
            onSectionChange(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onSectionChange]);

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
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-lg font-semibold">Application Details</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline">Edit</Button>
                <CollapsibleTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-600">
                    {expandedSections.details ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </CollapsibleTrigger>
              </div>
            </div>
            <CollapsibleContent>
              <div className="px-4 pb-4">
                <ApplicationData
                  applicantInfo={applicationFullDetails.applicantInfo}
                  coApplicantInfo={applicationFullDetails.coApplicantInfo}
                  vehicleData={applicationFullDetails.vehicleData}
                  appDtReferences={applicationFullDetails.appDtReferences}
                />
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>

      {/* Financial Summary Section */}
      <div ref={financialRef} id="financial-section">
        <Collapsible 
          open={expandedSections.financial} 
          onOpenChange={() => toggleSection('financial')}
        >
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-lg font-semibold">Financial Summary</h2>
              <CollapsibleTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600">
                  {expandedSections.financial ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="px-4 pb-4">
                <CombinedFinancialView 
                  financialSummary={getFinancialSummaryWithPresentedLender()}
                  dealStructure={applicationFullDetails.dealStructure}
                  applicationType={applicationType}
                />
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>

      {/* Order Details Section */}
      <div ref={orderRef} id="order-section">
        <Collapsible 
          open={expandedSections.order} 
          onOpenChange={() => toggleSection('order')}
        >
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-lg font-semibold">Order Details</h2>
              <CollapsibleTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600">
                  {expandedSections.order ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="px-4 pb-4">
                <OrderDetailsView orderDetails={applicationFullDetails.orderDetails} />
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </div>
  );
};

export default CombinedApplicationView;
