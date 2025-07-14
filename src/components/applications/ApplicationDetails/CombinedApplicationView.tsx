
import React, { useState, useRef, useEffect } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Expand, Minimize, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ApplicationData from './ApplicationData';
import CombinedFinancialView from './CombinedFinancialView';
import OrderDetailsView from './OrderDetailsView';
import { ApplicationFullDetails, Note } from '@/types/application';
import { useToast } from '@/hooks/use-toast';
import { canReapply } from '@/utils/reapplicationUtils';

interface CombinedApplicationViewProps {
  applicationFullDetails: ApplicationFullDetails;
  notes: Note[];
  activeSection?: string;
  onActiveSectionChange?: (section: string) => void;
}

const CombinedApplicationView: React.FC<CombinedApplicationViewProps> = ({
  applicationFullDetails,
  notes,
  activeSection,
  onActiveSectionChange
}) => {
  const { toast } = useToast();
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    financial: true,
    order: true
  });

  const [allExpanded, setAllExpanded] = useState(true);
  const [allCardsExpanded, setAllCardsExpanded] = useState(false);
  const [reapplyEnabled, setReapplyEnabled] = useState(
    applicationFullDetails.details.reapplyEnabled || false
  );

  const detailsRef = useRef<HTMLDivElement>(null);
  const financialRef = useRef<HTMLDivElement>(null);
  const orderRef = useRef<HTMLDivElement>(null);

  // Update allExpanded state when individual sections change
  useEffect(() => {
    const allSectionsExpanded = expandedSections.details && expandedSections.financial && expandedSections.order;
    setAllExpanded(allSectionsExpanded);
  }, [expandedSections]);

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

  // Scroll detection for active section highlighting
  useEffect(() => {
    const handleScroll = () => {
      if (!onActiveSectionChange) return;

      const sections = [
        { id: 'details', ref: detailsRef },
        { id: 'financial-summary', ref: financialRef },
        { id: 'order-details', ref: orderRef }
      ];

      const scrollPosition = window.scrollY + 200; // Offset for sticky headers

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          const offsetTop = window.scrollY + rect.top;
          
          if (scrollPosition >= offsetTop) {
            onActiveSectionChange(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onActiveSectionChange]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSectionClick = (section: keyof typeof expandedSections) => (e: React.MouseEvent) => {
    // Prevent toggle when clicking on buttons or interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || 
        target.closest('a') || 
        target.closest('[role="button"]') || 
        target.closest('input') || 
        target.closest('select') ||
        target.closest('.card-container') ||
        target.closest('[data-lender-card]') ||
        target.closest('[data-interactive]')) {
      return;
    }
    
    // Toggle the section expansion
    toggleSection(section);
  };

  const handleExpandAll = () => {
    const newState = !allExpanded;
    setAllExpanded(newState);
    setAllCardsExpanded(newState);
    setExpandedSections({
      details: newState,
      financial: newState,
      order: newState
    });
  };

  const getFinancialSummaryWithPresentedLender = () => {
    const financialSummary = { ...applicationFullDetails.financialSummary };
    
    // If we have lender summaries and a presented lender
    if (financialSummary.lenderSummaries) {
      // Mark the presented lender logic can be added here if needed
    }
    
    return financialSummary;
  };

  // Handle reapply toggle
  const handleReapplyToggle = (enabled: boolean) => {
    setReapplyEnabled(enabled);
    
    // Here you would typically make an API call to update the application
    // For now, we'll just show a toast notification
    toast({
      title: enabled ? "Reapply Enabled" : "Reapply Disabled",
      description: enabled 
        ? "Customer can now request to reapply for this order." 
        : "Customer can no longer request to reapply for this order.",
    });
  };

  // Check if reapply can be enabled based on current status
  const canEnableReapply = !['Funded', 'Booked', 'Void', 'Pending Reapply'].includes(applicationFullDetails.details.status);

  // Ensure applicationType is properly typed as 'Lease' | 'Loan'
  const applicationType = (applicationFullDetails.details.type === 'Lease' || applicationFullDetails.details.type === 'Loan') 
    ? applicationFullDetails.details.type as 'Lease' | 'Loan'
    : 'Loan'; // fallback to 'Loan' if type is not recognized

  return (
    <div className="space-y-3">
      {/* Global Controls */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <RotateCcw className="h-4 w-4 text-blue-600" />
            <Label htmlFor="reapply-toggle" className="text-sm font-medium">
              Enable Reapply
            </Label>
            <Switch
              id="reapply-toggle"
              checked={reapplyEnabled}
              onCheckedChange={handleReapplyToggle}
              disabled={!canEnableReapply}
            />
          </div>
          {!canEnableReapply && (
            <span className="text-xs text-gray-500">
              (Not available for {applicationFullDetails.details.status} applications)
            </span>
          )}
        </div>
        <Button
          variant="outline" 
          size="sm"
          onClick={handleExpandAll}
          className="flex items-center gap-1"
        >
          {allExpanded ? (
            <>
              <Minimize className="h-3 w-3" />
              Collapse All
            </>
          ) : (
            <>
              <Expand className="h-3 w-3" />
              Expand All
            </>
          )}
        </Button>
      </div>

      {/* Application Details Section */}
      <div ref={detailsRef} id="details-section">
        <Collapsible open={expandedSections.details}>
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-3 cursor-pointer" onClick={handleSectionClick('details')}>
              <h2 className="text-base font-semibold">Application Details</h2>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm">Edit</Button>
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
              <div className="px-3 pb-3">
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
        <Collapsible open={expandedSections.financial}>
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-3 cursor-pointer" onClick={handleSectionClick('financial')}>
              <h2 className="text-base font-semibold">Financial Summary</h2>
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
              <div className="px-3 pb-3">
                <CombinedFinancialView
                  financialSummary={getFinancialSummaryWithPresentedLender()}
                  dealStructure={applicationFullDetails.dealStructure}
                  applicationType={applicationType}
                  allCardsExpanded={allCardsExpanded}
                  onAllCardsExpandedChange={setAllCardsExpanded}
                />
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>

      {/* Order Details Section */}
      <div ref={orderRef} id="order-section">
        <Collapsible open={expandedSections.order}>
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-3 cursor-pointer" onClick={handleSectionClick('order')}>
              <h2 className="text-base font-semibold">Order Details</h2>
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
              <div className="px-3 pb-3">
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
