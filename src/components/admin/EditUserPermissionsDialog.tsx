
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User, UserPermissions } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EditUserPermissionsDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userId: string, permissions: UserPermissions) => void;
}

const EditUserPermissionsDialog: React.FC<EditUserPermissionsDialogProps> = ({
  user,
  open,
  onOpenChange,
  onSave
}) => {
  const [permissions, setPermissions] = useState<UserPermissions>(user.permissions);

  useEffect(() => {
    setPermissions(user.permissions);
  }, [user]);

  const handlePermissionChange = (
    module: keyof UserPermissions,
    action: string,
    value: boolean
  ) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: value
      }
    }));
  };

  const handleSave = () => {
    onSave(user.id, permissions);
  };

  const permissionModules = [
    { key: 'applications', label: 'Applications', actions: ['view', 'create', 'edit', 'delete'] },
    { key: 'tasks', label: 'Tasks', actions: ['view', 'create', 'edit', 'delete'] },
    { key: 'reports', label: 'Reports', actions: ['view', 'create', 'edit', 'delete'] },
    { key: 'dashboard', label: 'Dashboard', actions: ['view', 'edit'] },
    { key: 'userManagement', label: 'User Management', actions: ['view', 'create', 'edit', 'delete'] },
    { key: 'adminSettings', label: 'Admin Settings', actions: ['view', 'edit'] },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Permissions for {user.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {permissionModules.map((module) => (
              <Card key={module.key}>
                <CardHeader>
                  <CardTitle className="text-lg">{module.label}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {module.actions.map((action) => (
                    <div key={action} className="flex items-center justify-between">
                      <Label htmlFor={`${module.key}-${action}`} className="capitalize">
                        {action}
                      </Label>
                      <Switch
                        id={`${module.key}-${action}`}
                        checked={(permissions[module.key as keyof UserPermissions] as any)[action]}
                        onCheckedChange={(value) =>
                          handlePermissionChange(module.key as keyof UserPermissions, action, value)
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserPermissionsDialog;
