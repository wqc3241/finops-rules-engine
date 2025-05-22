
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SectionTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SectionTabs: React.FC<SectionTabsProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => {
  if (!tabs || tabs.length === 0) {
    return null;
  }

  // Handle tab click with direct callback
  const handleTabClick = (tab: string) => {
    onTabChange(tab);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabClick} className="w-full">
      <TabsList className="flex mb-4 mt-2">
        {tabs.map((tab, index) => (
          <TabsTrigger 
            key={index} 
            value={tab} 
            className="flex-1 text-xs h-6 px-3"
          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default SectionTabs;
