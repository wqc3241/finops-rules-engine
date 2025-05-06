
import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DealStructureOffer, DealStructureItem } from '@/types/application';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import StipulationsTable from './StipulationsTable';

interface LenderOfferCardProps {
  offer: DealStructureOffer;
  isExpanded: boolean;
}

const LenderOfferCard: React.FC<LenderOfferCardProps> = ({ offer, isExpanded }) => {
  const [isCardExpanded, setIsCardExpanded] = useState(false);

  // If the parent is expanded, we force the card to be expanded too
  const cardIsExpanded = isExpanded || isCardExpanded;

  const renderCollapsedView = () => (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <span className="text-sm text-gray-600 block">Term Length (months)</span>
        <span className="text-sm font-medium block bg-gray-50 p-2 mt-1">{offer.collapsedView.termLength}</span>
      </div>
      <div>
        <span className="text-sm text-gray-600 block">Monthly Payments</span>
        <span className="text-sm font-medium block bg-gray-50 p-2 mt-1">{offer.collapsedView.monthlyPayments}</span>
      </div>
      <div>
        <span className="text-sm text-gray-600 block">Due At Signing</span>
        <span className="text-sm font-medium block bg-gray-50 p-2 mt-1">{offer.collapsedView.dueAtSigning}</span>
      </div>
    </div>
  );

  const renderExpandedView = () => {
    if (!offer.requested.length) return null;
    
    return (
      <>
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col h-full">
            <h4 className="text-xs font-medium mb-3">Requested</h4>
            <div className="flex-grow">
              {renderOfferItems(offer.requested)}
            </div>
          </div>
          
          <Separator orientation="vertical" className="mx-3" />
          
          <div className="flex flex-col h-full">
            <h4 className="text-xs font-medium mb-3">Approved</h4>
            <div className="flex-grow">
              {renderOfferItems(offer.approved)}
            </div>
          </div>
          
          <Separator orientation="vertical" className="mx-3" />
          
          <div className="flex flex-col h-full">
            <h4 className="text-xs font-medium mb-3">Customer</h4>
            <div className="flex-grow">
              {renderOfferItems(offer.customer)}
            </div>
          </div>
        </div>

        {offer.stipulations.length > 0 && (
          <>
            <Separator className="my-6" />
            
            <div className="flex justify-between items-center my-6">
              <h4 className="text-md font-medium">Stipulations</h4>
              <div className="space-x-2">
                <Button variant="outline">Send Documents To DT</Button>
                <Button variant="outline">Add Stipulation</Button>
              </div>
            </div>
            <StipulationsTable stipulations={offer.stipulations} />
          </>
        )}

        {offer.contractStatus && (
          <div className="mt-6">
            <h4 className="text-md font-medium mb-4">Contract Status</h4>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              {offer.contractStatus}
            </span>
          </div>
        )}
      </>
    );
  };

  const renderOfferItems = (items: DealStructureItem[]) => (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex">
          <span className="text-xs text-gray-600 min-w-[120px]">{item.label}</span>
          <span className="text-xs font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <Collapsible open={cardIsExpanded} onOpenChange={setIsCardExpanded}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h4 className="text-xl font-bold">{offer.lenderName}</h4>
              {offer.status && (
                <span className="ml-4 px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                  {offer.status}
                </span>
              )}
            </div>
            <div className="flex space-x-2 items-center">
              <Button variant="outline">Send To Customer</Button>
              <Button variant="outline">Send Deal To DT</Button>
              <Button variant="outline">Edit</Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon">
                  {cardIsExpanded ? 
                    <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  }
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          <Separator className="mb-6" />

          {!cardIsExpanded && renderCollapsedView()}
          
          <CollapsibleContent>
            {renderExpandedView()}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default LenderOfferCard;
