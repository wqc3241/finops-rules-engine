
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Calendar, Clock, History } from 'lucide-react';
import { HistoryItem } from '@/types/application';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

interface ApplicationHistoryViewProps {
  history: HistoryItem[];
}

const ApplicationHistoryView: React.FC<ApplicationHistoryViewProps> = ({ history }) => {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [sortBy, setSortBy] = useState<'date' | 'change'>('date');
  
  const toggleItem = (index: number) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  const sortedHistory = [...history].sort((a, b) => {
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
            onClick={() => setSortBy(sortBy === 'date' ? 'change' : 'date')}
            className="inline-flex items-center justify-center gap-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 cursor-pointer hover:bg-gray-50"
          >
            <span>Sort By {sortBy === 'date' ? 'Date' : 'Change'}</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        
        <div className="relative inline-block text-left">
          <div 
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="inline-flex items-center justify-center gap-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 cursor-pointer hover:bg-gray-50"
          >
            <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      {sortedHistory.map((item, index) => (
        <Card key={index} className="overflow-hidden">
          <Collapsible 
            open={openItems[index]} 
            onOpenChange={() => toggleItem(index)}
          >
            <CollapsibleTrigger className="w-full">
              <div className="p-6 flex justify-between items-start">
                <div className="flex flex-col">
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" /> 
                    <span>{item.date}</span>
                    <Clock className="h-4 w-4 ml-3 mr-1" />
                    <span>{item.time}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  {/* Payment change indicator */}
                  <div className="mr-6 text-right">
                    <p className="text-sm font-medium">Monthly Payment Change</p>
                    <p className="text-base font-semibold">
                      <span className="text-gray-500 mr-2">{item.previousPayment}</span>
                      <span className={item.paymentDirection === 'increase' ? 'text-red-600' : 'text-green-600'}>
                        {item.paymentChange}
                      </span>
                    </p>
                  </div>
                  {openItems[index] ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                </div>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent className="border-t border-gray-100 px-6 pt-4 pb-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <History className="h-4 w-4 mr-1" />
                    <span>Change by {item.user}</span>
                  </div>
                </div>
                
                <h4 className="font-medium mb-3 text-gray-700">Changes in this version:</h4>
                
                {item.changes.map((change, idx) => (
                  <div key={idx} className="mb-4 pb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                    <p className="font-medium text-gray-800">{change.field}</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Previously</p>
                        <p className="text-gray-800">{change.previously}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Now</p>
                        <p className="text-gray-800">{change.now}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
};

export default ApplicationHistoryView;
