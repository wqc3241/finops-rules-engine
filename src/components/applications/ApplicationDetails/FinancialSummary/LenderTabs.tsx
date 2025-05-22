
import React from 'react';
import TabComponent, { TabItem } from '@/components/dashboard/TabComponent';

interface LenderTabsProps {
  lenderSummaries: Record<string, any> | undefined;
  selectedLenderName: string | null;
  onLenderChange: (lenderName: string) => void;
}

const LenderTabs: React.FC<LenderTabsProps> = ({ 
  lenderSummaries, 
  selectedLenderName, 
  onLenderChange 
}) => {
  if (!lenderSummaries || Object.keys(lenderSummaries).length === 0) {
    return null;
  }

  const createLenderTabItems = (): TabItem[] => {
    return Object.keys(lenderSummaries).map(lenderName => {
      return {
        value: lenderName,
        label: lenderName,
        content: <></>, // Content is rendered outside of TabContent
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
