
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronUp, ChevronDown, Expand, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DealStructureOffer, FinancialSummary } from '@/types/application';
import { Separator } from '@/components/ui/separator';
import LenderOfferCard from './LenderOfferCard';
import { useDealFinancialNavigation } from '@/hooks/useDealFinancialNavigation';

interface DealStructureSectionProps {
  dealStructure: DealStructureOffer[];
  title: string;
  applicationType: 'Lease' | 'Loan';
  showFinancialDetailButton?: boolean;
  financialSummary?: FinancialSummary;
}

const DealStructureSection: React.FC<DealStructureSectionProps> = ({
  dealStructure,
  title,
  applicationType,
  showFinancialDetailButton = false,
  financialSummary
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOfferLender, setSelectedOfferLender] = useState<string | null>(null);
  const [allCardsExpanded, setAllCardsExpanded] = useState(false);
  const [individualCardStates, setIndividualCardStates] = useState<Record<string, boolean>>({});
  
  const {
    navigateToFinancialSection,
    getCurrentLender,
    presentedLender,
    markLenderAsPresented
  } = useDealFinancialNavigation();

  // Check if there's a lender in URL to pre-select it
  useEffect(() => {
    const lenderFromUrl = getCurrentLender();
    if (lenderFromUrl) {
      // Find if this lender exists in our deal structure
      const lenderExists = dealStructure.find(offer => offer.lenderName === lenderFromUrl);
      if (lenderExists) {
        setSelectedOfferLender(lenderFromUrl);
      }
    }
  }, [dealStructure]);

  const handleSelectOffer = (lenderName: string) => {
    setSelectedOfferLender(lenderName);
  };

  const handlePresentToCustomer = (lenderName: string) => {
    // Navigate to financial summary with this lender pre-selected
    navigateToFinancialSection(lenderName, 'customer', {
      markAsPresented: true
    });
  };

  const handleViewFinancialDetail = (lenderName: string) => {
    navigateToFinancialSection(lenderName, 'approved');
  };

  const handleViewSection = (lenderName: string, section: 'requested' | 'approved' | 'customer') => {
    navigateToFinancialSection(lenderName, section);
  };

  const handleExpandAllCards = () => {
    const newState = !allCardsExpanded;
    setAllCardsExpanded(newState);
    
    // Update individual card states
    const newIndividualStates: Record<string, boolean> = {};
    dealStructure.forEach(offer => {
      newIndividualStates[offer.lenderName] = newState;
    });
    setIndividualCardStates(newIndividualStates);
  };

  const handleIndividualCardToggle = (lenderName: string, newState: boolean) => {
    setIndividualCardStates(prev => ({
      ...prev,
      [lenderName]: newState
    }));
    
    // Check if all cards are now expanded or collapsed
    const updatedStates = { ...individualCardStates, [lenderName]: newState };
    const allExpanded = dealStructure.every(offer => updatedStates[offer.lenderName] === true);
    const allCollapsed = dealStructure.every(offer => updatedStates[offer.lenderName] === false);
    
    if (allExpanded) {
      setAllCardsExpanded(true);
    } else if (allCollapsed) {
      setAllCardsExpanded(false);
    }
  };

  if (dealStructure.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExpandAllCards}
              className="flex items-center gap-1"
            >
              {allCardsExpanded ? (
                <>
                  <Minimize className="h-4 w-4" />
                  Collapse All
                </>
              ) : (
                <>
                  <Expand className="h-4 w-4" />
                  Expand All
                </>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
            </Button>
          </div>
        </div>
        
        <Separator className="mb-1" />
        
        <div className="space-y-6">
          {dealStructure.map((offer, index) => (
            <LenderOfferCard 
              key={index} 
              offer={{
                ...offer,
                applicationType: applicationType
              }} 
              isExpanded={isExpanded} 
              isSelected={selectedOfferLender === offer.lenderName}
              isCardExpanded={individualCardStates[offer.lenderName] || false}
              onSelectOffer={handleSelectOffer} 
              onPresentToCustomer={handlePresentToCustomer} 
              showFinancialDetailButton={showFinancialDetailButton} 
              onViewFinancialDetail={() => handleViewFinancialDetail(offer.lenderName)} 
              onViewRequestedFinancial={() => handleViewSection(offer.lenderName, 'requested')} 
              onViewApprovedFinancial={() => handleViewSection(offer.lenderName, 'approved')} 
              onViewCustomerFinancial={() => handleViewSection(offer.lenderName, 'customer')} 
              onCardToggle={(newState) => handleIndividualCardToggle(offer.lenderName, newState)}
              financialSummary={financialSummary} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DealStructureSection;
