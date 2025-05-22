
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
}

interface ApplicationTabsProps {
  tabs: Tab[];
  baseUrl: string;
}

const ApplicationTabs: React.FC<ApplicationTabsProps> = ({ tabs, baseUrl }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Find active tab based on current path
  const activeTab = tabs.find(tab => 
    currentPath === `${baseUrl}/${tab.id}` || 
    (currentPath === baseUrl && tab.id === 'details')
  )?.id || 'details';

  const handleTabChange = (tabId: string) => {
    if (tabId === 'details') {
      navigate(baseUrl);
    } else {
      navigate(`${baseUrl}/${tabId}`);
    }
  };

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex -mb-px">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={cn(
              'py-4 px-6 text-center border-b-2 font-medium text-sm',
              activeTab === tab.id
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
