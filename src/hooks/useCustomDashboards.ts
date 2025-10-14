import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CustomDashboard {
  id: string;
  name: string;
  description: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  widgets?: any;
  layout_config?: any;
}

export const useCustomDashboards = () => {
  return useQuery({
    queryKey: ['custom-dashboards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_dashboards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CustomDashboard[];
    },
  });
};

export const useCreateCustomDashboard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dashboard: { name: string; description: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('custom_dashboards')
        .insert({
          name: dashboard.name,
          description: dashboard.description,
          created_by: user?.id,
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
