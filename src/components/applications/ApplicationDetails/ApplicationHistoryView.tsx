
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { HistoryItem } from '@/types/application';

interface ApplicationHistoryViewProps {
  history: HistoryItem[];
}

const ApplicationHistoryView: React.FC<ApplicationHistoryViewProps> = ({ history }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-4">
        <div className="relative inline-block text-left">
          <div className="inline-flex items-center justify-center gap-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300">
            <span>Sort By Date</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        
        <div className="relative inline-block text-left">
          <div className="inline-flex items-center justify-center gap-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300">
            <span>Newest To Latest</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      {history.map((item, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">{item.title}</h3>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Previously</p>
                <p className="text-gray-800">{item.previously}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Now</p>
                <p className="text-gray-800">{item.now}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{item.time}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
                <p className="text-gray-800 mt-1">{item.user}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ApplicationHistoryView;
