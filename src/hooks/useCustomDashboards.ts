import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CustomDashboard {
  id: string;
  name: string;
  description: string | null;
  folder_id: string | null;
  run_as: 'viewer' | 'owner';
  filters: any[];
  last_refreshed_at: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  widgets?: any;
  layout_config?: any;
}

export const useCustomDashboards = (folderId?: string | null) => {
  return useQuery({
    queryKey: ['custom-dashboards', folderId],
    queryFn: async () => {
      let query = supabase
        .from('custom_dashboards')
        .select('*')
        .eq('is_active', true);
      
      if (folderId !== undefined) {
        query = folderId ? query.eq('folder_id', folderId) : query.is('folder_id', null);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CustomDashboard[];
    },
  });
};

export const useCreateCustomDashboard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dashboard: { 
      name: string; 
      description?: string; 
      folder_id?: string;
      run_as?: 'viewer' | 'owner';
      filters?: any[];
      widgets?: any; 
      layout_config?: any;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('custom_dashboards')
        .insert({
          ...dashboard,
          created_by: user.id,
          run_as: dashboard.run_as || 'viewer',
          filters: dashboard.filters || [],
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-dashboards'] });
      toast.success('Dashboard created successfully');
    },
    onError: (error) => {
      console.error('Error creating dashboard:', error);
      toast.error('Failed to create dashboard');
    },
  });
};

export const useDeleteCustomDashboard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dashboardId: string) => {
      const { error } = await supabase
        .from('custom_dashboards')
        .delete()
        .eq('id', dashboardId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-dashboards'] });
      toast.success('Dashboard deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting dashboard:', error);
      toast.error('Failed to delete dashboard');
    },
  });
};
