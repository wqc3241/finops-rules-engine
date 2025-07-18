
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
  
  // Extract the tab from the URL path
  const getActiveTabFromPath = () => {
    // If we're at the base URL, default to 'details'
    if (currentPath === baseUrl) {
      return 'details';
    }
    
    // Extract the last segment of the path as the tab
    const pathParts = currentPath.split('/');
    const lastSegment = pathParts[pathParts.length - 1];
    
    // Check if the last segment matches any of our tab IDs
    const matchingTab = tabs.find(tab => tab.id === lastSegment);
    return matchingTab ? lastSegment : 'details';
  };

  // Always use the URL to determine active tab, ignore activeSection prop for highlighting
  const activeTab = getActiveTabFromPath();

  console.log('ApplicationTabs - currentPath:', currentPath);
  console.log('ApplicationTabs - baseUrl:', baseUrl);
  console.log('ApplicationTabs - activeTab from URL:', activeTab);
  console.log('ApplicationTabs - activeSection prop:', activeSection);

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
    <div className="sticky top-16 z-10 bg-gray-50 border-b border-gray-200 mb-6">
      <nav className="flex -mb-px">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={cn(
              'py-4 px-6 text-center border-b-2 font-medium text-sm transition-all duration-200',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 bg-blue-50 shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-100'
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
