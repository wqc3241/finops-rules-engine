
import React from 'react';
import { Button } from '@/components/ui/button';

interface SectionTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SectionTabs: React.FC<SectionTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex mb-2">
      {tabs.map((tab, index) => (
        <Button 
          key={index} 
          variant={tab === activeTab ? "default" : "outline"}
          size="sm"
          className="mr-1 text-xs h-7 px-2"
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </Button>
      ))}
    </div>
  );
};

export default SectionTabs;
