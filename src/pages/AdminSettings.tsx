
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import UserManagement from '@/components/admin/UserManagement';
import { useState } from 'react';
import { User } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

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
        <main className="flex-1 p-6">
          <UserManagement
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onCreateUser={handleCreateUser}
          />
        </main>
      </div>
    </div>
  );
};

export default AdminSettings;
