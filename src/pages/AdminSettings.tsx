
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import UserManagement from '@/components/admin/UserManagement';
import { useState } from 'react';
import { User } from '@/types/user';
import { useToast } from '@/hooks/use-toast';
import { Settings, Users, Shield } from 'lucide-react';

const AdminSettings = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Admin Settings');

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/applications" replace />;
  }

  const handleEditUser = (user: User) => {
    toast({
      title: "Edit User",
      description: `Editing permissions for ${user.name}`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    toast({
      title: "Delete User",
      description: "User deleted successfully",
      variant: "destructive",
    });
  };

  const handleCreateUser = () => {
    toast({
      title: "Create User",
      description: "Opening user creation form",
    });
  };

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
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
                  <p className="text-gray-600">Manage users, permissions, and system configuration</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Active Admins</p>
                      <p className="text-2xl font-bold text-gray-900">3</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Settings className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Permission Groups</p>
                      <p className="text-2xl font-bold text-gray-900">6</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <UserManagement
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              onCreateUser={handleCreateUser}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSettings;
