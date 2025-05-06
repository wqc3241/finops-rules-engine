
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Layers, 
  DollarSign, 
  LayoutDashboard, 
  BarChart, 
  ListTodo, 
  Settings, 
  Receipt 
} from 'lucide-react';

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
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const Sidebar = ({ open, activeItem, setActiveItem }: SidebarProps) => {
  if (!open) return null;

  const navItems = [
    {
      title: 'Applications',
      icon: <Layers className="h-5 w-5" />,
    },
    {
      title: 'Financial Pricing',
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: 'Report',
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: 'Tasks',
      icon: <ListTodo className="h-5 w-5" />,
    },
    {
      title: 'LFS Setup',
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: 'Fee & Tax',
      icon: <Receipt className="h-5 w-5" />,
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
