
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
        <main className="flex-1 p-6">
          <div className="max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Your Permissions</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {permissionModules.map((module) => (
                <Card key={module.key}>
                  <CardHeader>
                    <CardTitle className="text-lg">{module.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {module.actions.map((action) => {
                        const hasPermission = (user.permissions[module.key as keyof typeof user.permissions] as any)[action];
                        return (
                          <div key={action} className="flex items-center justify-between">
                            <span className="capitalize text-sm">{action}</span>
                            <div className="flex items-center gap-2">
                              {hasPermission ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <X className="h-4 w-4 text-red-600" />
                              )}
                              <Badge variant={hasPermission ? "default" : "secondary"}>
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
