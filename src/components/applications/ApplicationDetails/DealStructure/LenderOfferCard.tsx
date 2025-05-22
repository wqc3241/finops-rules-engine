
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DealStructureOffer, FinancialSummary } from '@/types/application';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import CardHeader from './CardHeader';
import CollapsibleCardContent from './CollapsibleCardContent';

interface LenderOfferCardProps {
  offer: DealStructureOffer;
  isExpanded: boolean;
  isSelected: boolean;
  onSelectOffer: (offerLender: string) => void;
  onPresentToCustomer?: (lenderName: string) => void;
  showFinancialDetailButton?: boolean;
  onViewFinancialDetail?: (lenderName: string, section: 'requested' | 'approved' | 'customer') => void;
  financialSummary?: FinancialSummary;
}

const LenderOfferCard: React.FC<LenderOfferCardProps> = ({ 
  offer, 
  isExpanded, 
  isSelected, 
  onSelectOffer, 
  onPresentToCustomer,
  showFinancialDetailButton = false,
  onViewFinancialDetail,
  financialSummary
}) => {
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showFinancialSummary, setShowFinancialSummary] = useState(false);
  const [selectedSection, setSelectedSection] = useState<'requested' | 'approved' | 'customer'>('approved');
  const { toast } = useToast();
  const { id: applicationId } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

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

  const handleViewFinancialDetail = (section: 'requested' | 'approved' | 'customer') => {
    setSelectedSection(section);
    setShowFinancialSummary(true);
    
    // Call parent handler if provided
    if (onViewFinancialDetail) {
      onViewFinancialDetail(offer.lenderName, section);
    }
  };

  const handleBackToDealStructure = () => {
    setShowFinancialSummary(false);
  };

  const handleEditSubmit = (data: {
    termLength: string;
    mileageAllowance?: string;
    downPayment: string;
    apr?: string;
  }) => {
    console.log('Edited customer parameters:', data);
    setIsEditDialogOpen(false);
    toast({
      title: "Offer Updated",
      description: "Customer parameters have been updated successfully.",
      duration: 3000
    });
  };

  return (
    <Card className={`shadow-sm transition-all ${isSelected ? 'border-green-500 border-2' : ''}`}>
      <CardContent className="p-6">
        <CardHeader 
          lenderName={offer.lenderName}
          status={offer.status}
          isExpanded={cardIsExpanded}
          isSelected={isSelected}
          onToggleExpand={() => setIsCardExpanded(!isCardExpanded)}
          onPresentToCustomer={handlePresentToCustomer}
          onSendToDT={handleSendToDT}
          onEditOffer={() => setIsEditDialogOpen(true)}
        />

        <CollapsibleCardContent 
          offer={offer}
          isCardExpanded={cardIsExpanded}
          isSelected={isSelected}
          showFinancialSummary={showFinancialSummary}
          selectedSection={selectedSection}
          isEditDialogOpen={isEditDialogOpen}
          financialSummary={financialSummary}
          showFinancialDetailButton={showFinancialDetailButton}
          onToggleExpand={setIsCardExpanded}
          onBackToDealStructure={handleBackToDealStructure}
          onViewFinancialDetail={handleViewFinancialDetail}
          onEditDialogOpenChange={setIsEditDialogOpen}
          onEditSubmit={handleEditSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default LenderOfferCard;
