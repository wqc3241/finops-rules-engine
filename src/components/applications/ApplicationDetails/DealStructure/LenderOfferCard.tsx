
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, User, ArrowRight, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DealStructureOffer } from '@/types/application';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Dialog } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import StatusBadge from './StatusBadge';
import CollapsedView from './CollapsedView';
import LoanCollapsedView from './LoanCollapsedView';
import ExpandedView from './ExpandedView';
import EditOfferDialog from './EditOfferDialog';
import { generateStandardParams } from './utils/offerUtils';

interface LenderOfferCardProps {
  offer: DealStructureOffer;
  isExpanded: boolean;
  isSelected: boolean;
  onSelectOffer: (offerLender: string) => void;
}

const LenderOfferCard: React.FC<LenderOfferCardProps> = ({ offer, isExpanded, isSelected, onSelectOffer }) => {
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // If the parent is expanded, we force the card to be expanded too
  const cardIsExpanded = isExpanded || isCardExpanded;
  const applicationType = offer.applicationType || 'Lease';
  
  const handlePresentToCustomer = () => {
    onSelectOffer(offer.lenderName);
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

  // Prepare the standardized parameters for each section
  const standardizedRequested = generateStandardParams(offer.requested, applicationType);
  const standardizedApproved = generateStandardParams(offer.approved, applicationType);
  const standardizedCustomer = generateStandardParams(offer.customer, applicationType);

  // Default form values for edit dialog
  const editFormDefaults = applicationType === 'Loan' 
    ? {
        termLength: offer.customer.find(item => item.name === 'termLength')?.value || '',
        downPayment: offer.customer.find(item => item.name === 'downPayment')?.value || '',
        apr: offer.customer.find(item => item.name === 'apr')?.value || '',
      }
    : {
        termLength: offer.customer.find(item => item.name === 'termLength')?.value || '',
        mileageAllowance: offer.customer.find(item => item.name === 'mileageAllowance')?.value || '',
        downPayment: offer.customer.find(item => item.name === 'ccrDownPayment')?.value || '',
      };

  return (
    <Card className={`shadow-sm transition-all ${isSelected ? 'border-green-500 border-2' : ''}`}>
      <CardContent className="p-6">
        <Collapsible open={cardIsExpanded} onOpenChange={setIsCardExpanded}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h4 className="text-xl font-bold">{offer.lenderName}</h4>
              <StatusBadge status={offer.status} />
            </div>
            <div className="flex space-x-2 items-center">
              <Button 
                variant="outline" 
                onClick={handlePresentToCustomer}
                className="flex items-center"
              >
                <User className="h-4 w-4 mr-1" />
                Present to Customer
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleSendToDT}
                disabled={!isSelected}
                className={`flex items-center ${!isSelected ? 'opacity-50' : ''}`}
              >
                <ArrowRight className="h-4 w-4 mr-1" />
                Send Deal To DT
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(true)}
                className="flex items-center"
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
              
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

          {!cardIsExpanded && (
            applicationType === 'Loan' ? (
              <LoanCollapsedView 
                termLength={offer.collapsedView.termLength}
                monthlyPayments={offer.collapsedView.monthlyPayments}
                downPayment={offer.collapsedView.downPayment || "N/A"}
              />
            ) : (
              <CollapsedView 
                termLength={offer.collapsedView.termLength}
                monthlyPayments={offer.collapsedView.monthlyPayments}
                dueAtSigning={offer.collapsedView.dueAtSigning || "N/A"}
              />
            )
          )}
          
          <CollapsibleContent>
            <ExpandedView 
              requested={standardizedRequested}
              approved={standardizedApproved}
              customer={standardizedCustomer}
              stipulations={offer.stipulations}
              contractStatus={offer.contractStatus}
              applicationType={applicationType}
              lenderName={offer.lenderName}
            />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <EditOfferDialog 
          defaultValues={editFormDefaults}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditDialogOpen(false)}
          applicationType={applicationType}
        />
      </Dialog>
    </Card>
  );
};

export default LenderOfferCard;

