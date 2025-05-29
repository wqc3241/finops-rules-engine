
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Check, X } from 'lucide-react';

const UserPermissions = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('User Permissions');

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const permissionModules = [
    { key: 'applications', label: 'Applications', actions: ['view', 'create', 'edit', 'delete'] },
    { key: 'tasks', label: 'Tasks', actions: ['view', 'create', 'edit', 'delete'] },
    { key: 'reports', label: 'Reports', actions: ['view', 'create', 'edit', 'delete'] },
    { key: 'dashboard', label: 'Dashboard', actions: ['view', 'edit'] },
    { key: 'userManagement', label: 'User Management', actions: ['view', 'create', 'edit', 'delete'] },
    { key: 'adminSettings', label: 'Admin Settings', actions: ['view', 'edit'] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <Navbar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex flex-1 pt-16">
        <Sidebar 
          open={sidebarOpen}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-0' : 'ml-0'}`}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Permissions</h1>
              <p className="text-gray-600">View your current access permissions across different modules</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {permissionModules.map((module) => (
                <Card key={module.key} className="h-fit">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900">{module.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {module.actions.map((action) => {
                        const hasPermission = (user.permissions[module.key as keyof typeof user.permissions] as any)[action];
                        return (
                          <div key={action} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50">
                            <span className="capitalize text-sm font-medium text-gray-700">{action}</span>
                            <div className="flex items-center gap-2">
                              {hasPermission ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <X className="h-4 w-4 text-red-600" />
                              )}
                              <Badge variant={hasPermission ? "default" : "secondary"} className="text-xs">
                                {hasPermission ? "Allowed" : "Denied"}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserPermissions;
