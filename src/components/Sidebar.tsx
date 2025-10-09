import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Layers, 
  DollarSign, 
  LayoutDashboard, 
  BarChart, 
  ListTodo, 
  Settings, 
  Receipt,
  FileCheck,
  GitBranch,
  Database
} from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface NavItemProps {
  title: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  to: string;
}

const NavItem = ({ title, icon, active = false, onClick, to }: NavItemProps) => {
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
  
  const navigate = useNavigate();
  const location = useLocation();
  const { isFSAdmin } = useAuth();

  const handleItemClick = (title: string, path: string) => {
    setActiveItem(title);
    navigate(path);
  };

  const showReleases = isFSAdmin();

  const navItems = [
    {
      title: 'Applications',
      icon: <Layers className="h-5 w-5" />,
      path: '/applications'
    },
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/dashboard'
    },
    ...(showReleases ? [{
      title: 'Releases',
      icon: <GitBranch className="h-5 w-5" />,
      path: '/releases'
    }] : []),
    ...(showReleases ? [{
      title: 'Data Migration',
      icon: <Database className="h-5 w-5" />,
      path: '/data-migration'
    }] : []),
    {
      title: 'Document Configuration',
      icon: <FileCheck className="h-5 w-5" />,
      path: '/document-configuration'
    },
    {
      title: 'Financial Pricing',
      icon: <DollarSign className="h-5 w-5" />,
      path: '/financial-pricing'
    },
    {
      title: 'Financing Config',
      icon: <Settings className="h-5 w-5" />,
      path: '/lfs-setup'
    },
    {
      title: 'Financing Data Table',
      icon: <Receipt className="h-5 w-5" />,
      path: '/financing-data-table'
    },
    {
      title: 'Report',
      icon: <BarChart className="h-5 w-5" />,
      path: '/report'
    },
    {
      title: 'Sales Pricing Rules',
      icon: <Receipt className="h-5 w-5" />,
      path: '/sales-pricing-rules'
    },
    {
      title: 'Tasks',
      icon: <ListTodo className="h-5 w-5" />,
      path: '/tasks'
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
              onClick={() => handleItemClick(item.title, item.path)}
              to={item.path}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
