
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';
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
  allCardsExpanded?: boolean;
  onAllCardsExpandedChange?: (expanded: boolean) => void;
}

const DealStructureSection: React.FC<DealStructureSectionProps> = ({
  dealStructure,
  title,
  applicationType,
  showFinancialDetailButton = false,
  financialSummary,
  allCardsExpanded = false,
  onAllCardsExpandedChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOfferLender, setSelectedOfferLender] = useState<string | null>(null);
  const [individualCardStates, setIndividualCardStates] = useState<Record<string, boolean>>({});
  
  const {
    navigateToFinancialSection,
    getCurrentLender,
    presentedLender,
    markLenderAsPresented
  } = useDealFinancialNavigation();

  // Update individual card states when allCardsExpanded changes
  useEffect(() => {
    const newIndividualStates: Record<string, boolean> = {};
    dealStructure.forEach(offer => {
      newIndividualStates[offer.lenderName] = allCardsExpanded;
    });
    setIndividualCardStates(newIndividualStates);
  }, [allCardsExpanded, dealStructure]);

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

  const handleIndividualCardToggle = (lenderName: string, newState: boolean) => {
    setIndividualCardStates(prev => ({
      ...prev,
      [lenderName]: newState
    }));
    
    // Check if all cards are now expanded or collapsed
    const updatedStates = { ...individualCardStates, [lenderName]: newState };
    const allExpanded = dealStructure.every(offer => updatedStates[offer.lenderName] === true);
    const allCollapsed = dealStructure.every(offer => updatedStates[offer.lenderName] === false);
    
    if (onAllCardsExpandedChange) {
      if (allExpanded) {
        onAllCardsExpandedChange(true);
      } else if (allCollapsed) {
        onAllCardsExpandedChange(false);
      }
    }
  };

  if (dealStructure.length === 0) {
    return null;
  }

  const handleSectionClick = (e: React.MouseEvent) => {
    console.log('Deal structure section clicked!', e.target);
    
    // Prevent toggle when clicking on buttons or lender cards
    const target = e.target as HTMLElement;
    console.log('Section click target:', target.tagName, target.className);
    
    // Don't toggle if clicking on buttons, icons, or lender cards
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'SVG' ||
      target.tagName === 'PATH' ||
      target.closest('button') ||
      target.closest('svg') ||
      target.closest('[data-lender-card]') // Prevent conflict with lender cards
    ) {
      console.log('Section click prevented - button, icon, or lender card');
      return;
    }
    
    console.log('Toggling section expansion');
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-3">
        <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={handleSectionClick}>
          <h3 className="text-base font-semibold">{title}</h3>
          <Button variant="ghost" size="sm" onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}>
            {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </Button>
        </div>
        
        <Separator className="mb-3" />
        
        {isExpanded && (
          <div className="space-y-3">
            {dealStructure.map((offer, index) => (
              <LenderOfferCard 
                key={index} 
                offer={{
                  ...offer,
                  applicationType: applicationType
                }} 
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
        )}
      </CardContent>
    </Card>
  );
};

export default DealStructureSection;
