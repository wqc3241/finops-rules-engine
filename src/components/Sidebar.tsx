
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  title: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}

const NavItem = ({ title, icon, active = false, onClick }: NavItemProps) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center px-4 py-3 text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors",
        active && "border-l-4 border-gray-800 bg-gray-100"
      )}
    >
      <div className="mr-3">{icon}</div>
      <span className="text-sm font-medium">{title}</span>
    </div>
  );
};

interface SidebarProps {
  open: boolean;
}

const Sidebar = ({ open }: SidebarProps) => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  
  if (!open) return null;

  const navItems = [
    {
      title: 'Applications',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      title: 'Offers',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      title: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      title: 'Report',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      title: 'Tasks',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      title: 'LFS Setup',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      title: 'Fee & Tax',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
      <nav className="h-full flex flex-col">
        <div className="flex-1">
          {navItems.map((item) => (
            <NavItem
              key={item.title}
              title={item.title}
              icon={item.icon}
              active={activeItem === item.title}
              onClick={() => setActiveItem(item.title)}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
