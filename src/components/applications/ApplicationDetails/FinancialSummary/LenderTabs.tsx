
import React from 'react';
import { Check } from 'lucide-react';
import TabComponent, { TabItem } from '@/components/dashboard/TabComponent';

interface LenderTabsProps {
  lenderSummaries: Record<string, any> | undefined;
  selectedLenderName: string | null;
  presentedLender?: string | null;
  onLenderChange: (lenderName: string) => void;
}

const LenderTabs: React.FC<LenderTabsProps> = ({ 
  lenderSummaries, 
  selectedLenderName, 
  presentedLender,
  onLenderChange 
}) => {
  if (!lenderSummaries || Object.keys(lenderSummaries).length === 0) {
    return null;
  }

  const createLenderTabItems = (): TabItem[] => {
    return Object.keys(lenderSummaries).map(lenderName => {
      const lenderSummary = lenderSummaries[lenderName];
      const isPresented = lenderName === presentedLender;
      const isPresentedToCustomer = lenderSummary.selectedForCustomer === true || isPresented;
      
      return {
        value: lenderName,
        label: (
          <div className="flex items-center gap-1">
            <span>{lenderName}</span>
            {isPresentedToCustomer && <Check className="h-4 w-4 text-green-600" />}
          </div>
        ),
        content: <></>, // Content is rendered outside of TabContent
        isPresentedToCustomer: isPresentedToCustomer
      };
    });
  };

  return (
    <div className="mb-4">
      <TabComponent 
        defaultValue={selectedLenderName || Object.keys(lenderSummaries)[0]} 
        items={createLenderTabItems()}
        onValueChange={onLenderChange}
      />
    </div>
  );
};

export default LenderTabs;
