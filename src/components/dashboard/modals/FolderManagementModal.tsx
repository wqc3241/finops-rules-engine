import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useCreateFolder, useDashboardFolders } from '@/hooks/useDashboardFolders';
import { X } from 'lucide-react';

interface FolderManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AVAILABLE_ROLES = ['FS_OPS', 'FS_ADMIN', 'admin'];

const FolderManagementModal: React.FC<FolderManagementModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [folderName, setFolderName] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  
  const { data: folders } = useDashboardFolders();
  const createFolder = useCreateFolder();

  const toggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleCreate = () => {
    createFolder.mutate({
      name: folderName,
      access_roles: selectedRoles,
    }, {
      onSuccess: () => {
        setFolderName('');
        setSelectedRoles([]);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Folders</DialogTitle>
          <DialogDescription>
            Create and manage dashboard folders with role-based access
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="folderName">Create New Folder</Label>
            <Input
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Access Roles (leave empty for all users)</Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_ROLES.map(role => (
                <Badge
                  key={role}
                  variant={selectedRoles.includes(role) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleRole(role)}
                >
                  {role}
                  {selectedRoles.includes(role) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
          
          <Button onClick={handleCreate} disabled={!folderName}>
            Create Folder
          </Button>

          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium mb-2">Existing Folders</h4>
            <div className="space-y-2">
              {folders?.map(folder => (
                <div key={folder.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium">{folder.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {folder.access_roles?.length ? (
                        <span>Roles: {folder.access_roles.join(', ')}</span>
                      ) : (
                        <span>All users</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {!folders?.length && (
                <div className="text-sm text-muted-foreground">No folders yet</div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FolderManagementModal;
