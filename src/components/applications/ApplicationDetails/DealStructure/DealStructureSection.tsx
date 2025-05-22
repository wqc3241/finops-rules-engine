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
  if (dealStructure.length === 0) {
    return null;
  }
  return <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
            </Button>
          </div>
        </div>
        
        <Separator className="mb-1" />
        
        <div className="space-y-6">
          {dealStructure.map((offer, index) => <LenderOfferCard key={index} offer={{
          ...offer,
          applicationType: applicationType
        }} isExpanded={isExpanded} isSelected={selectedOfferLender === offer.lenderName} onSelectOffer={handleSelectOffer} onPresentToCustomer={handlePresentToCustomer} showFinancialDetailButton={showFinancialDetailButton} onViewFinancialDetail={() => handleViewFinancialDetail(offer.lenderName)} onViewRequestedFinancial={() => handleViewSection(offer.lenderName, 'requested')} onViewApprovedFinancial={() => handleViewSection(offer.lenderName, 'approved')} onViewCustomerFinancial={() => handleViewSection(offer.lenderName, 'customer')} financialSummary={financialSummary} />)}
        </div>
      </CardContent>
    </Card>;
};
export default DealStructureSection;