
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
    <div className="min-h-screen bg-gray-50 w-full">
      <Navbar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex pt-16">
        <Sidebar 
          open={sidebarOpen}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              {/* Header Section */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Settings className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Settings</h1>
                    <p className="text-lg text-gray-600">Manage users, permissions, and system configuration</p>
                  </div>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                        <p className="text-3xl font-bold text-gray-900">12</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Active Admins</p>
                        <p className="text-3xl font-bold text-gray-900">3</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <Shield className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Permission Groups</p>
                        <p className="text-3xl font-bold text-gray-900">6</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <Settings className="h-8 w-8 text-orange-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* User Management Section */}
              <UserManagement
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
                onCreateUser={handleCreateUser}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSettings;
