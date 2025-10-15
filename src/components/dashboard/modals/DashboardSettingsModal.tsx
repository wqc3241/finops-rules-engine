import React, { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomDashboard } from '@/hooks/useCustomDashboards';
import { useDashboardFolders } from '@/hooks/useDashboardFolders';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dashboard: CustomDashboard;
}

const DashboardSettingsModal: React.FC<DashboardSettingsModalProps> = ({
  open,
  onOpenChange,
  dashboard,
}) => {
  const [name, setName] = useState(dashboard.name);
  const [description, setDescription] = useState(dashboard.description || '');
  const [folderId, setFolderId] = useState<string>(dashboard.folder_id || '');
  const [runAs, setRunAs] = useState<'viewer' | 'owner'>(dashboard.run_as);
  
  const { data: folders } = useDashboardFolders();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    setName(dashboard.name);
    setDescription(dashboard.description || '');
    setFolderId(dashboard.folder_id || '');
    setRunAs(dashboard.run_as);
  }, [dashboard]);

  const updateDashboard = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('custom_dashboards')
        .update({
          name,
          description: description || null,
          folder_id: folderId || null,
          run_as: runAs,
        })
        .eq('id', dashboard.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-dashboards'] });
      toast({ title: 'Dashboard updated successfully' });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to update dashboard', description: error.message, variant: 'destructive' });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dashboard Settings</DialogTitle>
          <DialogDescription>
            Update dashboard configuration
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="folder">Folder</Label>
            <Select value={folderId || 'none'} onValueChange={setFolderId}>
              <SelectTrigger id="folder">
                <SelectValue placeholder="Select folder..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Root)</SelectItem>
                {folders?.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="runAs">Run As</Label>
            <Select value={runAs} onValueChange={(value: any) => setRunAs(value)}>
              <SelectTrigger id="runAs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer (Current User)</SelectItem>
                <SelectItem value="owner">Owner (Dashboard Creator)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => updateDashboard.mutate()} disabled={!name}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardSettingsModal;
