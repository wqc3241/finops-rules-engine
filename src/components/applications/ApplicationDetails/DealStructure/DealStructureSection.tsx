
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DealStructureOffer } from '@/types/application';
import LenderOfferCard from './LenderOfferCard';
import { Separator } from '@/components/ui/separator';

interface DealStructureSectionProps {
  dealStructure: DealStructureOffer[];
}

const DealStructureSection: React.FC<DealStructureSectionProps> = ({ dealStructure }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Deal Structure (Offers)</h3>
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
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DealStructureSection;
