
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
}

interface ApplicationTabsProps {
  tabs: Tab[];
  baseUrl: string;
  onTabClick?: (tabId: string) => void;
  activeScrollSection?: string;
}

const ApplicationTabs: React.FC<ApplicationTabsProps> = ({ 
  tabs, 
  baseUrl, 
  onTabClick,
  activeScrollSection 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Find active tab based on current path
  const activeTab = tabs.find(tab => 
    currentPath === `${baseUrl}/${tab.id}` || 
    (currentPath === baseUrl && tab.id === 'details')
  )?.id || 'details';

  const handleTabChange = (tabId: string) => {
    if (onTabClick) {
      onTabClick(tabId);
    } else {
      // Default navigation behavior
      if (tabId === 'details') {
        navigate(baseUrl);
      } else {
        navigate(`${baseUrl}/${tabId}`);
      }
    }
  };

  const getTabClassName = (tabId: string) => {
    const isActiveTab = activeTab === tabId || 
      (['details', 'financial-summary', 'order-details'].includes(tabId) && 
       ['details', 'financial-summary', 'order-details'].includes(activeTab));
    
    // For combined view tabs, use scroll-based highlighting
    const isCombinedViewTab = ['details', 'financial-summary', 'order-details'].includes(tabId);
    const isScrollActive = isCombinedViewTab && activeScrollSection === tabId;
    
    const isActive = isActiveTab || isScrollActive;
    
    return cn(
      'py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors',
      isActive
        ? 'border-gray-900 text-gray-900'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    );
  };

  return (
    <div className="sticky top-0 bg-white z-20 border-b border-gray-200 mb-6">
      <nav className="flex -mb-px">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={getTabClassName(tab.id)}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ApplicationTabs;
