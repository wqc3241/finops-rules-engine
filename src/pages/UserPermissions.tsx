
import React from 'react';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Check, X, Shield } from 'lucide-react';

const UserPermissions = () => {
  const { user, profile, hasPermission } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('User Permissions');

  if (!user) {
    return <Navigate to="/auth" replace />;
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
    <div className="min-h-screen bg-gray-50 w-full">
      <Navbar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar 
        open={sidebarOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      <main className="flex-1 pt-16 min-h-screen bg-gray-50">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              {/* Header Section */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Permissions</h1>
                    <p className="text-lg text-gray-600">View your current access permissions across different modules</p>
                  </div>
                </div>
              </div>
              
              {/* Permission Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {permissionModules.map((module) => (
                  <Card key={module.key} className="hover:shadow-md transition-shadow border-gray-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        {module.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {module.actions.map((action) => {
                          const hasPermissionForAction = hasPermission(module.key, action);
                          return (
                            <div key={action} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                              <span className="capitalize text-sm font-medium text-gray-700">
                                {action}
                              </span>
                              <div className="flex items-center gap-3">
                                {hasPermissionForAction ? (
                                  <div className="flex items-center gap-2">
                                    <div className="p-1 bg-green-100 rounded-full">
                                      <Check className="h-3 w-3 text-green-600" />
                                    </div>
                                    <Badge variant="default" className="bg-green-100 text-green-800 text-xs border-green-200">
                                      Allowed
                                    </Badge>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <div className="p-1 bg-red-100 rounded-full">
                                      <X className="h-3 w-3 text-red-600" />
                                    </div>
                                    <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs border-red-200">
                                      Denied
                                    </Badge>
                                  </div>
                                )}
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
          </div>
        </main>
    </div>
  );
};

export default UserPermissions;
