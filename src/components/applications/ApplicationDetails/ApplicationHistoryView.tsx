
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Calendar, Clock, History, User, CheckCircle } from 'lucide-react';
import { HistoryItem } from '@/types/application';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import LenderDecisionSummary from './LenderDecisionSummary';

interface ApplicationHistoryViewProps {
  history: HistoryItem[];
}

const ApplicationHistoryView: React.FC<ApplicationHistoryViewProps> = ({ history }) => {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [sortBy, setSortBy] = useState<'date' | 'change'>('date');
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(history);
  
  const toggleItem = (index: number) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handlePresentToCustomer = (versionId: string, lenderName: string) => {
    setHistoryItems(prev => 
      prev.map(item => ({
        ...item,
        isShownToCustomer: item.versionId === versionId
      }))
    );
    
    // Log the action
    const logEntry = {
      action: 'present_to_customer',
      versionId,
      lenderName,
      timestamp: new Date().toISOString(),
      user: 'Current User' // In real app, get from auth context
    };
    console.log('Customer presentation action:', logEntry);
    
    toast.success(`Version ${versionId} (${lenderName}) is now shown to customer`);
  };
  
  const handleToggleSortBy = () => {
    const newSortBy = sortBy === 'date' ? 'change' : 'date';
    setSortBy(newSortBy);
    toast.success(`Sorting by ${newSortBy}`);
  };
  
  const handleToggleSortOrder = () => {
    const newSortOrder = sortOrder === 'newest' ? 'oldest' : 'newest'; 
    setSortOrder(newSortOrder);
    toast.success(`Showing ${newSortOrder} first`);
  };
  
  const sortedHistory = [...historyItems].sort((a, b) => {
    if (sortBy === 'date') {
      // Convert dates to timestamps for comparison
      const dateA = new Date(`${a.date} ${a.time}`).getTime();
      const dateB = new Date(`${b.date} ${b.time}`).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    } else {
      // Sort by payment change amount (parse from the "now" field which contains the new payment)
      const changeA = parseFloat(a.paymentChange.replace(/[^0-9.-]+/g, ''));
      const changeB = parseFloat(b.paymentChange.replace(/[^0-9.-]+/g, ''));
      return sortOrder === 'newest' ? changeB - changeA : changeA - changeB;
    }
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-4">
        <div className="relative inline-block text-left">
          <div 
            onClick={handleToggleSortBy}
            className="inline-flex items-center justify-center gap-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 cursor-pointer hover:bg-gray-50"
          >
            <span>Sort By {sortBy === 'date' ? 'Date' : 'Change'}</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        
        <div className="relative inline-block text-left">
          <div 
            onClick={handleToggleSortOrder}
            className="inline-flex items-center justify-center gap-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 cursor-pointer hover:bg-gray-50"
          >
            <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      {sortedHistory.map((item, index) => (
        <Card key={index} className={`overflow-hidden ${item.isShownToCustomer ? 'border-primary' : ''}`}>
          <Collapsible 
            open={openItems[index]} 
            onOpenChange={() => toggleItem(index)}
          >
            <div className="p-3 space-y-3">
              {/* Lender Decision Summary */}
              <LenderDecisionSummary
                lenderName={item.lenderName}
                lenderOffer={item.lenderOffer}
                isShownToCustomer={item.isShownToCustomer}
                hasNoLender={!item.lenderId}
              />
              
              {/* Header Section */}
              <CollapsibleTrigger className="w-full">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium">{item.title}</h3>
                      {item.isShownToCustomer && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" /> 
                      <span>{item.date}</span>
                      <Clock className="h-3 w-3 ml-2 mr-1" />
                      <span>{item.time}</span>
                      <History className="h-3 w-3 ml-2 mr-1" />
                      <span>by {item.user}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Payment change indicator */}
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Payment Change</p>
                      <p className="text-sm font-semibold">
                        <span className="text-muted-foreground mr-2">{item.previousPayment}</span>
                        <span className={item.paymentDirection === 'increase' ? 'text-red-600' : 'text-green-600'}>
                          {item.paymentChange}
                        </span>
                      </p>
                    </div>
                    
                    {/* Present to Customer Button */}
                    {item.lenderId && item.lenderOffer?.status === 'Approved' && !item.isShownToCustomer && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Present to Customer
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Present Version to Customer</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to present version {item.versionId} ({item.lenderName}) to the customer? 
                                This will replace the current version shown to the customer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handlePresentToCustomer(item.versionId, item.lenderName!)}
                              >
                                Present to Customer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                    
                    {openItems[index] ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </div>
              </CollapsibleTrigger>
              
              {/* Collapsible Content */}
              <CollapsibleContent>
                <div className="border-t pt-3 space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Changes in this version:</h4>
                  
                  {item.changes.map((change, idx) => (
                    <div key={idx} className="p-2 bg-muted/30 rounded-md">
                      <p className="text-sm font-medium mb-2">{change.field}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Previously</p>
                          <p className="text-xs">{change.previously}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Now</p>
                          <p className="text-xs font-medium">{change.now}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
};

export default ApplicationHistoryView;
