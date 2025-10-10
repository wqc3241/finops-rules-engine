import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DealStructureOffer, FinancialSummary, DealStructureItem } from '@/types/application';
import { useToast } from '@/hooks/use-toast';
import CardHeader from './CardHeader';
import CollapsibleCardContent from './CollapsibleCardContent';
import DealVersionHistory, { DealVersion } from './DealVersionHistory';

interface LenderOfferCardProps {
  offer: DealStructureOffer;
  isSelected: boolean;
  isCardExpanded?: boolean;
  onSelectOffer: (offerLender: string) => void;
  onPresentToCustomer?: (lenderName: string) => void;
  showFinancialDetailButton?: boolean;
  onViewFinancialDetail?: () => void;
  onViewRequestedFinancial?: () => void;
  onViewApprovedFinancial?: () => void;
  onViewCustomerFinancial?: () => void;
  onCardToggle?: (newState: boolean) => void;
  financialSummary?: FinancialSummary;
  onOfferUpdate?: (updatedOffer: DealStructureOffer) => void;
  orderNumber?: string;
}

const LenderOfferCard: React.FC<LenderOfferCardProps> = ({ 
  offer, 
  isSelected, 
  isCardExpanded = false,
  onSelectOffer, 
  onPresentToCustomer,
  showFinancialDetailButton = false,
  onViewFinancialDetail,
  onViewRequestedFinancial,
  onViewApprovedFinancial,
  onViewCustomerFinancial,
  onCardToggle,
  financialSummary,
  onOfferUpdate,
  orderNumber
}) => {
  const [showFinancialSummary, setShowFinancialSummary] = useState(false);
  const [selectedSection, setSelectedSection] = useState<'requested' | 'approved' | 'customer'>('approved');
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showCustomerHistoryDialog, setShowCustomerHistoryDialog] = useState(false);
  const [dealVersions, setDealVersions] = useState<DealVersion[]>([]);
  const [customerDealVersions, setCustomerDealVersions] = useState<DealVersion[]>([]);
  const [isRequestedEditMode, setIsRequestedEditMode] = useState(false);
  const [isCustomerEditMode, setIsCustomerEditMode] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<DealStructureOffer>(offer);
  const { toast } = useToast();

  // Initialize with current offers as first versions
  React.useEffect(() => {
    if (dealVersions.length === 0) {
      setDealVersions([{
        id: 'initial',
        timestamp: new Date(),
        items: offer.requested,
        description: 'Initial requested deal'
      }]);
    }
    if (customerDealVersions.length === 0) {
      setCustomerDealVersions([{
        id: 'initial-customer',
        timestamp: new Date(),
        items: offer.customer,
        description: 'Initial customer deal'
      }]);
    }
  }, [offer.requested, offer.customer, dealVersions.length, customerDealVersions.length]);

  // Card expansion is managed independently
  const cardIsExpanded = isCardExpanded;
  
  const handlePresentToCustomer = () => {
    onSelectOffer(offer.lenderName);
    
    // Call the parent handler if provided
    if (onPresentToCustomer) {
      onPresentToCustomer(offer.lenderName);
    }
    
    toast({
      title: "Offer Presented",
      description: `${offer.lenderName} offer has been presented to the customer.`,
      duration: 3000
    });
  };

  const handleSendToDT = () => {
    if (!isSelected) return;
    
    toast({
      title: "Deal Sent to DT",
      description: `${offer.lenderName} deal has been sent to DT successfully.`,
      duration: 3000
    });
  };

  const handleToggleExpand = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const newState = !cardIsExpanded;
    
    // Reset financial summary when collapsing the card
    if (!newState) {
      setShowFinancialSummary(false);
    }
    
    if (onCardToggle) {
      onCardToggle(newState);
    }
  };

  const handleViewFinancialDetail = (section: 'requested' | 'approved' | 'customer' = 'approved') => {
    setSelectedSection(section);
    setShowFinancialSummary(true);
    
    switch (section) {
      case 'requested':
        if (onViewRequestedFinancial) onViewRequestedFinancial();
        break;
      case 'approved':
        if (onViewApprovedFinancial) onViewApprovedFinancial();
        break;
      case 'customer':
        if (onViewCustomerFinancial) onViewCustomerFinancial();
        break;
      default:
        if (onViewFinancialDetail) onViewFinancialDetail();
    }
  };

  // Simple toggle for financial summary - basic approach
  const handleInlineFinancialSummary = (e?: React.MouseEvent) => {
    // Stop event propagation to prevent card collapse
    if (e) {
      e.stopPropagation();
    }
    
    // If card is not expanded, expand it first, then show financial summary
    if (!cardIsExpanded) {
      // First expand the card through the parent
      if (onCardToggle) {
        onCardToggle(true);
      }
      // Then show financial summary
      setShowFinancialSummary(true);
      setSelectedSection('approved');
    } else {
      // If already expanded, just toggle the financial summary
      setShowFinancialSummary(!showFinancialSummary);
      setSelectedSection('approved');
    }
  };

  const handleBackToDealStructure = () => {
    setShowFinancialSummary(false);
  };

  const handleEditRequested = () => {
    setIsRequestedEditMode(true);
  };

  const handleSaveRequestedEdit = (updatedItems: DealStructureItem[]) => {
    const newVersion: DealVersion = {
      id: `version-${Date.now()}`,
      timestamp: new Date(),
      items: updatedItems,
      description: 'Updated requested deal parameters'
    };

    const updatedOffer: DealStructureOffer = {
      ...currentOffer,
      requested: updatedItems
    };

    setDealVersions(prev => [newVersion, ...prev]);
    setCurrentOffer(updatedOffer);
    setIsRequestedEditMode(false);
    
    if (onOfferUpdate) {
      onOfferUpdate(updatedOffer);
    }

    toast({
      title: "Deal Updated",
      description: "Requested deal parameters have been updated successfully.",
      duration: 3000
    });
  };

  const handleCancelRequestedEdit = () => {
    setIsRequestedEditMode(false);
  };

  const handleViewHistory = () => {
    setShowHistoryDialog(true);
  };

  const handleEditCustomer = () => {
    setIsCustomerEditMode(true);
  };

  const handleSaveCustomerEdit = (updatedItems: DealStructureItem[]) => {
    const newVersion: DealVersion = {
      id: `customer-version-${Date.now()}`,
      timestamp: new Date(),
      items: updatedItems,
      description: 'Updated customer deal parameters'
    };

    const updatedOffer: DealStructureOffer = {
      ...currentOffer,
      customer: updatedItems
    };

    setCustomerDealVersions(prev => [newVersion, ...prev]);
    setCurrentOffer(updatedOffer);
    setIsCustomerEditMode(false);
    
    if (onOfferUpdate) {
      onOfferUpdate(updatedOffer);
    }

    toast({
      title: "Customer Deal Updated",
      description: "Customer deal parameters have been updated successfully.",
      duration: 3000
    });
  };

  const handleCancelCustomerEdit = () => {
    setIsCustomerEditMode(false);
  };

  const handleViewCustomerHistory = () => {
    setShowCustomerHistoryDialog(true);
  };

  const handleRestoreVersion = (version: DealVersion) => {
    const restoredOffer: DealStructureOffer = {
      ...currentOffer,
      requested: version.items
    };

    // Simply update the current offer without adding a new version to history
    setCurrentOffer(restoredOffer);
    
    if (onOfferUpdate) {
      onOfferUpdate(restoredOffer);
    }

    setShowHistoryDialog(false);
    
    toast({
      title: "Version Restored",
      description: "Deal has been restored to the selected version.",
      duration: 3000
    });
  };

  const handleRestoreCustomerVersion = (version: DealVersion) => {
    const restoredOffer: DealStructureOffer = {
      ...currentOffer,
      customer: version.items
    };

    // Simply update the current offer without adding a new version to history
    setCurrentOffer(restoredOffer);
    
    if (onOfferUpdate) {
      onOfferUpdate(restoredOffer);
    }

    setShowCustomerHistoryDialog(false);
    
    toast({
      title: "Customer Version Restored",
      description: "Customer deal has been restored to the selected version.",
      duration: 3000
    });
  };

  const handleStatusChange = (newStatus: string) => {
    const updatedOffer: DealStructureOffer = {
      ...currentOffer,
      status: newStatus
    };

    setCurrentOffer(updatedOffer);
    
    if (onOfferUpdate) {
      onOfferUpdate(updatedOffer);
    }

    toast({
      title: "Status Updated",
      description: `Status has been changed to "${newStatus}".`,
      duration: 3000
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Stop event from bubbling up to parent sections
    e.stopPropagation();
    
    console.log('=== LenderOfferCard Click Debug ===');
    console.log('Lender:', offer.lenderName);
    console.log('Click target:', e.target);
    console.log('Target tagName:', (e.target as HTMLElement).tagName);
    console.log('Target className:', (e.target as HTMLElement).className);
    
    // Prevent toggle when clicking directly on interactive elements
    const target = e.target as HTMLElement;
    
    // Log all the checks
    console.log('Checking interactive element...');
    console.log('  - tagName === BUTTON:', target.tagName === 'BUTTON');
    console.log('  - closest("button"):', target.closest('button'));
    console.log('  - hasAttribute("data-prevent-toggle"):', target.hasAttribute('data-prevent-toggle'));
    console.log('  - closest("[data-prevent-toggle]"):', target.closest('[data-prevent-toggle]'));
    
    // More comprehensive check for interactive elements
    const isInteractiveElement = (
      target.tagName === 'BUTTON' ||
      target.tagName === 'SVG' ||
      target.tagName === 'PATH' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'SELECT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('button') ||
      target.closest('svg') ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('textarea') ||
      target.closest('[role="button"]') ||
      target.getAttribute('role') === 'button' ||
      target.hasAttribute('data-prevent-toggle') ||
      target.closest('[data-prevent-toggle]')
    );
    
    console.log('isInteractiveElement:', isInteractiveElement);
    
    if (isInteractiveElement) {
      console.log('Interactive element detected - NOT toggling');
      console.log('===================================');
      return;
    }
    
    console.log('NOT interactive element - TOGGLING card');
    console.log('===================================');
    
    // Toggle the card expansion
    handleToggleExpand();
  };

  return (
    <Card 
      className={`shadow-sm transition-all ${isSelected ? 'border-green-500 border-2' : ''}`}
    >
      <CardContent className="p-3 cursor-pointer" onClick={handleCardClick}>
        <CardHeader 
          lenderName={offer.lenderName}
          status={currentOffer.status}
          isExpanded={cardIsExpanded}
          isSelected={isSelected}
          onToggleExpand={handleToggleExpand}
          onPresentToCustomer={handlePresentToCustomer}
          onSendToDT={handleSendToDT}
          offer={currentOffer}
          showFinancialDetailButton={showFinancialDetailButton}
          onViewFinancialSummary={handleInlineFinancialSummary}
          orderNumber={orderNumber}
          onStatusChange={handleStatusChange}
        />

        <CollapsibleCardContent 
          offer={currentOffer}
          isCardExpanded={cardIsExpanded}
          isSelected={isSelected}
          showFinancialSummary={showFinancialSummary}
          selectedSection={selectedSection}
          financialSummary={financialSummary}
          showFinancialDetailButton={showFinancialDetailButton}
          onToggleExpand={handleToggleExpand}
          onBackToDealStructure={handleBackToDealStructure}
          onViewFinancialDetail={handleViewFinancialDetail}
          onViewRequestedFinancial={() => handleViewFinancialDetail('requested')}
          onViewApprovedFinancial={() => handleViewFinancialDetail('approved')}
          onViewCustomerFinancial={() => handleViewFinancialDetail('customer')}
          onEditRequested={handleEditRequested}
          onViewHistory={handleViewHistory}
          onEditCustomer={handleEditCustomer}
          onViewCustomerHistory={handleViewCustomerHistory}
          isRequestedEditMode={isRequestedEditMode}
          isCustomerEditMode={isCustomerEditMode}
          onSaveRequestedEdit={handleSaveRequestedEdit}
          onCancelRequestedEdit={handleCancelRequestedEdit}
          onSaveCustomerEdit={handleSaveCustomerEdit}
          onCancelCustomerEdit={handleCancelCustomerEdit}
        />

        <DealVersionHistory
          isOpen={showHistoryDialog}
          onClose={() => setShowHistoryDialog(false)}
          versions={dealVersions}
          onRestoreVersion={handleRestoreVersion}
          applicationType={currentOffer.applicationType}
        />

        <DealVersionHistory
          isOpen={showCustomerHistoryDialog}
          onClose={() => setShowCustomerHistoryDialog(false)}
          versions={customerDealVersions}
          onRestoreVersion={handleRestoreCustomerVersion}
          applicationType={currentOffer.applicationType}
        />
      </CardContent>
    </Card>
  );
};

export default LenderOfferCard;
