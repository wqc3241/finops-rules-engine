
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, UserPermissions } from '@/types/user';
import { Edit, Trash2, Plus } from 'lucide-react';
import EditUserPermissionsDialog from './EditUserPermissionsDialog';

interface UserManagementProps {
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onCreateUser: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  onEditUser,
  onDeleteUser,
  onCreateUser
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Mock users data
  const users: User[] = [
    {
      id: "user-1",
      name: "John Smith",
      email: "john.smith@company.com",
      role: "admin",
      permissions: {
        applications: { view: true, create: true, edit: true, delete: true },
        tasks: { view: true, create: true, edit: true, delete: true },
        reports: { view: true, create: true, edit: true, delete: true },
        dashboard: { view: true, edit: true },
        userManagement: { view: true, create: true, edit: true, delete: true },
        adminSettings: { view: true, edit: true }
      },
      createdAt: "2024-01-01",
      lastLogin: "2024-01-15T10:30:00Z"
    },
    {
      id: "user-2",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "manager",
      permissions: {
        applications: { view: true, create: true, edit: true, delete: false },
        tasks: { view: true, create: true, edit: true, delete: false },
        reports: { view: true, create: true, edit: false, delete: false },
        dashboard: { view: true, edit: false },
        userManagement: { view: true, create: false, edit: false, delete: false },
        adminSettings: { view: false, edit: false }
      },
      createdAt: "2024-01-02",
      lastLogin: "2024-01-14T15:45:00Z"
    },
    {
      id: "user-3",
      name: "Mike Davis",
      email: "mike.davis@company.com",
      role: "user",
      permissions: {
        applications: { view: true, create: false, edit: false, delete: false },
        tasks: { view: true, create: false, edit: false, delete: false },
        reports: { view: true, create: false, edit: false, delete: false },
        dashboard: { view: true, edit: false },
        userManagement: { view: false, create: false, edit: false, delete: false },
        adminSettings: { view: false, edit: false }
      },
      createdAt: "2024-01-03",
      lastLogin: "2024-01-13T09:20:00Z"
    }
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-orange-100 text-orange-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleSavePermissions = (userId: string, permissions: UserPermissions) => {
    console.log('Saving permissions for user:', userId, permissions);
    setIsEditDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button onClick={onCreateUser} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedUser && (
        <EditUserPermissionsDialog
          user={selectedUser}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSavePermissions}
        />
      )}
    </div>
  );
};

export default UserManagement;
