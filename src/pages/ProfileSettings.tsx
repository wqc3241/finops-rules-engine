
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { User, Mail, Shield, Calendar, Save, X } from 'lucide-react';

const ProfileSettings = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Profile Settings');

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'manager': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'user': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
            <div className="max-w-6xl mx-auto">
              {/* Header Section */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile Settings</h1>
                    <p className="text-lg text-gray-600">Manage your personal information and account settings</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Overview Card */}
                <div className="lg:col-span-1">
                  <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4">
                        <User className="h-12 w-12 text-blue-600" />
                      </div>
                      <CardTitle className="text-2xl font-semibold text-gray-900 mb-2">{user.name}</CardTitle>
                      <Badge className={`mx-auto w-fit text-sm px-3 py-1 ${getRoleBadgeColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-700">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Shield className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-700">ID: {user.id}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-700">Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Personal Information Card */}
                <div className="lg:col-span-2">
                  <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <User className="h-6 w-6 text-blue-600" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                          <Input 
                            id="name" 
                            defaultValue={user.name}
                            className="focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                          <Input 
                            id="email" 
                            defaultValue={user.email}
                            type="email"
                            className="focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="role" className="text-sm font-medium text-gray-700">Role</Label>
                          <Input 
                            id="role" 
                            value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
                            disabled 
                            className="bg-gray-100 text-gray-600 border-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="userId" className="text-sm font-medium text-gray-700">User ID</Label>
                          <Input 
                            id="userId" 
                            value={user.id} 
                            disabled 
                            className="bg-gray-100 text-gray-600 border-gray-300"
                          />
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200">
                        <div className="flex gap-4">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                            <Save className="h-4 w-4" />
                            Save Changes
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2 border-gray-300">
                            <X className="h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileSettings;
