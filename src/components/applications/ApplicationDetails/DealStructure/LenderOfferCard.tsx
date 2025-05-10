
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Check, X, Clock, User, ArrowRight, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DealStructureOffer, DealStructureItem } from '@/types/application';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import StipulationsTable from './StipulationsTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface LenderOfferCardProps {
  offer: DealStructureOffer;
  isExpanded: boolean;
  isSelected: boolean;
  onSelectOffer: (offerLender: string) => void;
}

type CustomerParamFormValues = {
  termLength: string;
  mileageAllowance: string;
  downPayment: string;
};

const LenderOfferCard: React.FC<LenderOfferCardProps> = ({ offer, isExpanded, isSelected, onSelectOffer }) => {
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // If the parent is expanded, we force the card to be expanded too
  const cardIsExpanded = isExpanded || isCardExpanded;

  // List of standard financial parameters to always show
  const standardParams = [
    'termLength', 'mileageAllowance', 'rv', 'rvs', 'ccrDownPayment', 
    'maxLtv', 'ltv', 'dti', 'pti', 'fico', 'mf'
  ];
  
  // Standard parameter labels
  const paramLabels: Record<string, string> = {
    termLength: "Term Length (months)",
    mileageAllowance: "Mileage Allowance",
    rv: "RV%",
    rvs: "RV$",
    ccrDownPayment: "CCR/Down Payment",
    maxLtv: "Max LTV",
    ltv: "LTV",
    dti: "DTI",
    pti: "PTI",
    fico: "FICO",
    mf: "MF"
  };

  const form = useForm<CustomerParamFormValues>({
    defaultValues: {
      termLength: offer.customer.find(item => item.name === 'termLength')?.value || '',
      mileageAllowance: offer.customer.find(item => item.name === 'mileageAllowance')?.value || '',
      downPayment: offer.customer.find(item => item.name === 'ccrDownPayment')?.value || '',
    }
  });

  const renderStatusBadge = (status?: string) => {
    if (!status) return null;

    const statusConfig: Record<string, { bgColor: string; textColor: string; icon: React.ReactNode }> = {
      Approved: { bgColor: 'bg-green-100', textColor: 'text-green-800', icon: <Check className="h-3 w-3 mr-1" /> },
      Declined: { bgColor: 'bg-red-100', textColor: 'text-red-800', icon: <X className="h-3 w-3 mr-1" /> },
      Pending: { bgColor: 'bg-gray-100', textColor: 'text-gray-600', icon: <Clock className="h-3 w-3 mr-1" /> }
    };

    const config = statusConfig[status] || { bgColor: 'bg-gray-100', textColor: 'text-gray-600', icon: <Clock className="h-3 w-3 mr-1" /> };

    return (
      <span className={`ml-4 px-3 py-1 text-sm font-medium ${config.bgColor} ${config.textColor} rounded-full flex items-center`}>
        {config.icon}
        {status}
      </span>
    );
  };

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

  const handleEditSubmit = (data: CustomerParamFormValues) => {
    // In a real implementation, this would save the changes to the API
    console.log('Edited customer parameters:', data);
    setIsEditDialogOpen(false);
    toast({
      title: "Offer Updated",
      description: "Customer parameters have been updated successfully.",
      duration: 3000
    });
  };

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

  // Helper function to generate standardized parameter items
  const generateStandardParams = (items: DealStructureItem[]) => {
    const itemMap = new Map(items.map(item => [item.name, item]));
    
    // Convert to standardized array with all required parameters
    return standardParams.map(paramName => {
      const item = itemMap.get(paramName);
      return {
        name: paramName,
        label: paramLabels[paramName] || paramName,
        value: item ? item.value : "-"
      };
    });
  };

  const renderExpandedView = () => {
    const standardizedRequested = generateStandardParams(offer.requested);
    const standardizedApproved = generateStandardParams(offer.approved);
    const standardizedCustomer = generateStandardParams(offer.customer);
    
    return (
      <>
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <h4 className="text-md font-medium mb-4">Requested</h4>
            {renderOfferItems(standardizedRequested)}
          </div>
          <div>
            <h4 className="text-md font-medium mb-4">Approved</h4>
            {renderOfferItems(standardizedApproved)}
          </div>
          <div>
            <h4 className="text-md font-medium mb-4">Customer</h4>
            {renderOfferItems(standardizedCustomer, true)}
          </div>
        </div>

        {offer.stipulations.length > 0 && (
          <>
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

  const renderOfferItems = (items: DealStructureItem[], isCustomer: boolean = false) => (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isEditableField = isCustomer && 
          (item.name === 'termLength' || item.name === 'mileageAllowance' || item.name === 'ccrDownPayment');
        
        return (
          <div key={index} className="flex items-center">
            <span className="text-sm text-gray-600 min-w-[180px]">{item.label}</span>
            <span className={`text-sm font-medium ${isEditableField ? 'text-blue-600' : ''}`}>
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <Card className={`shadow-sm transition-all ${isSelected ? 'border-green-500 border-2' : ''}`}>
      <CardContent className="p-6">
        <Collapsible open={cardIsExpanded} onOpenChange={setIsCardExpanded}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h4 className="text-xl font-bold">{offer.lenderName}</h4>
              {renderStatusBadge(offer.status)}
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

          {!cardIsExpanded && renderCollapsedView()}
          
          <CollapsibleContent>
            {renderExpandedView()}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer Parameters</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="termLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Term Length (months)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mileageAllowance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mileage Allowance</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="downPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Down Payment</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default LenderOfferCard;
