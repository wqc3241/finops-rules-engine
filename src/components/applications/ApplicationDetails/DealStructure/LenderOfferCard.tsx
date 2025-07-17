
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DealStructureOffer, FinancialSummary } from '@/types/application';
import { useToast } from '@/hooks/use-toast';
import CardHeader from './CardHeader';
import CollapsibleCardContent from './CollapsibleCardContent';

interface LenderOfferCardProps {
  offer: DealStructureOffer;
  isExpanded: boolean;
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
}

const LenderOfferCard: React.FC<LenderOfferCardProps> = ({ 
  offer, 
  isExpanded, 
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
  financialSummary
}) => {
  const [showFinancialSummary, setShowFinancialSummary] = useState(false);
  const [selectedSection, setSelectedSection] = useState<'requested' | 'approved' | 'customer'>('approved');
  const { toast } = useToast();

  // If the parent is expanded, we force the card to be expanded too
  const cardIsExpanded = isExpanded || isCardExpanded;
  
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

  const handleToggleExpand = () => {
    const newState = !cardIsExpanded;
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

  const handleBackToDealStructure = () => {
    setShowFinancialSummary(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    console.log('Card clicked!', e.target);
    
    // Stop event from bubbling up to parent sections
    e.stopPropagation();
    
    // Prevent toggle when clicking directly on interactive elements
    const target = e.target as HTMLElement;
    console.log('Click target:', target.tagName, target.className);
    
    // Check if click is on a button, svg, or other interactive element
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'SVG' ||
      target.tagName === 'PATH' ||
      target.closest('button') ||
      target.closest('svg')
    ) {
      console.log('Click prevented - button or icon');
      return;
    }
    
    console.log('Toggling card expansion');
    // Toggle the card expansion
    handleToggleExpand();
  };

  return (
    <Card 
      className={`shadow-sm transition-all ${isSelected ? 'border-green-500 border-2' : ''}`}
    >
      <CardContent className="p-3 cursor-pointer" onClick={handleCardClick} data-lender-card>
        <CardHeader 
          lenderName={offer.lenderName}
          status={offer.status}
          isExpanded={cardIsExpanded}
          isSelected={isSelected}
          onToggleExpand={handleToggleExpand}
          onPresentToCustomer={handlePresentToCustomer}
          onSendToDT={handleSendToDT}
        />

        <CollapsibleCardContent 
          offer={offer}
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
        />
      </CardContent>
    </Card>
  );
};

export default LenderOfferCard;
