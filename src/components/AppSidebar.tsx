import { useLocation, NavLink } from 'react-router-dom';
import { 
  Layers, 
  DollarSign, 
  LayoutDashboard, 
  BarChart, 
  ListTodo, 
  Settings, 
  Receipt,
  FileCheck
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';

const navItems = [
  {
    title: 'Applications',
    icon: Layers,
    path: '/applications'
  },
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard'
  },
  {
    title: 'Document Configuration',
    icon: FileCheck,
    path: '/document-configuration'
  },
  {
    title: 'Financial Pricing',
    icon: DollarSign,
    path: '/financial-pricing'
  },
  {
    title: 'Financing Config',
    icon: Settings,
    path: '/lfs-setup'
  },
  {
    title: 'Financing Data Table',
    icon: Receipt,
    path: '/financing-data-table'
  },
  {
    title: 'Report',
    icon: BarChart,
    path: '/report'
  },
  {
    title: 'Sales Pricing Rules',
    icon: Receipt,
    path: '/sales-pricing-rules'
  },
  {
    title: 'Tasks',
    icon: ListTodo,
    path: '/tasks'
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.path}>
                    <NavLink to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}