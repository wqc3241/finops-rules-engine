
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DealStructureOffer } from '@/types/application';
import { Separator } from '@/components/ui/separator';
import LenderOfferCard from './LenderOfferCard';
import { useSearchParams, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { usePresentedLender } from '@/utils/dealFinanceNavigation';

interface LeaseDealStructureSectionProps {
  dealStructure: DealStructureOffer[];
  showFinancialDetailButton?: boolean;
  onViewFinancialDetail?: (lenderName: string) => void;
}

const LeaseDealStructureSection: React.FC<LeaseDealStructureSectionProps> = ({ 
  dealStructure,
  showFinancialDetailButton = false,
  onViewFinancialDetail
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOfferLender, setSelectedOfferLender] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: applicationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { markLenderAsPresented } = usePresentedLender();
  
  // Check if there's a lender in URL to pre-select it
  useEffect(() => {
    const lenderFromUrl = searchParams.get('lender');
    if (lenderFromUrl) {
      const decodedLender = decodeURIComponent(lenderFromUrl);
      // Find if this lender exists in our deal structure
      const lenderExists = dealStructure.find(offer => offer.lenderName === decodedLender);
      if (lenderExists) {
        setSelectedOfferLender(decodedLender);
      }
    }
  }, [searchParams, dealStructure]);

  const handleSelectOffer = (lenderName: string) => {
    setSelectedOfferLender(lenderName);
  };
  
  const handlePresentToCustomer = (lenderName: string) => {
    // Mark this lender as presented
    markLenderAsPresented(lenderName);
    
    // Navigate to financial summary with this lender pre-selected
    const params = new URLSearchParams();
    params.set('lender', encodeURIComponent(lenderName));
    params.set('section', 'customer'); // Default to customer tab when presenting
    navigate(`/applications/${applicationId}/financial-summary?${params.toString()}`);
  };

  const handleViewFinancialDetail = (lenderName: string) => {
    if (onViewFinancialDetail) {
      onViewFinancialDetail(lenderName);
    } else {
      // Update URL with view mode and lender
      const newParams = new URLSearchParams(searchParams);
      newParams.set('view', 'financial-detail');
      newParams.set('lender', lenderName);
      setSearchParams(newParams);
    }
  };

  if (dealStructure.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Deal Structure (Lease Offers)</h3>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 
                <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                <ChevronDown className="h-5 w-5 text-gray-400" />
              }
            </Button>
          </div>
        </div>
        
        <Separator className="mb-6" />
        
        <div className="space-y-6">
          {dealStructure.map((offer, index) => (
            <LenderOfferCard 
              key={index} 
              offer={offer} 
              isExpanded={isExpanded}
              isSelected={selectedOfferLender === offer.lenderName}
              onSelectOffer={handleSelectOffer}
              onPresentToCustomer={handlePresentToCustomer}
              showFinancialDetailButton={showFinancialDetailButton}
              onViewFinancialDetail={handleViewFinancialDetail ? 
                () => handleViewFinancialDetail(offer.lenderName) : undefined}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaseDealStructureSection;
