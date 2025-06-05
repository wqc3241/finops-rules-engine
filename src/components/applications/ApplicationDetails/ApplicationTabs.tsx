
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
  activeSection?: string;
}

const ApplicationTabs: React.FC<ApplicationTabsProps> = ({ 
  tabs, 
  baseUrl, 
  onTabClick,
  activeSection 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Find active tab based on current path or active section
  const activeTab = activeSection || tabs.find(tab => 
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

  return (
    <div className="sticky top-32 z-10 bg-gray-50 border-b border-gray-200 mb-6">
      <nav className="flex -mb-px">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={cn(
              'py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id || 
              ((['details', 'financial-summary', 'order-details'].includes(tab.id)) && 
               (['details', 'financial-summary', 'order-details'].includes(activeTab)))
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
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
