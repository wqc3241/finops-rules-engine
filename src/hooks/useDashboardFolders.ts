import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DashboardFolder {
  id: string;
  name: string;
  access_roles: string[];
  parent_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useDashboardFolders = () => {
  return useQuery({
    queryKey: ['dashboard-folders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dashboard_folders')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as DashboardFolder[];
    },
  });
};

export const useCreateFolder = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (folder: { name: string; access_roles?: string[]; parent_id?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('dashboard_folders')
        .insert({
          ...folder,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-folders'] });
      toast({ title: 'Folder created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to create folder', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateFolder = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DashboardFolder> & { id: string }) => {
      const { data, error } = await supabase
        .from('dashboard_folders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-folders'] });
      toast({ title: 'Folder updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to update folder', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteFolder = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('dashboard_folders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-folders'] });
      toast({ title: 'Folder deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to delete folder', description: error.message, variant: 'destructive' });
    },
  });
};
