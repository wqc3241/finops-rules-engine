import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DashboardComponent {
  id: string;
  dashboard_id: string;
  type: 'chart' | 'table' | 'metric' | 'gauge';
  title: string;
  data_source: string | null;
  visualization_config: any;
  filter_bindings: any[];
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  created_at: string;
  updated_at: string;
}

export const useDashboardComponents = (dashboardId: string | null) => {
  return useQuery({
    queryKey: ['dashboard-components', dashboardId],
    queryFn: async () => {
      if (!dashboardId) return [];
      
      const { data, error } = await supabase
        .from('dashboard_components')
        .select('*')
        .eq('dashboard_id', dashboardId)
        .order('created_at');
      
      if (error) throw error;
      return data as DashboardComponent[];
    },
    enabled: !!dashboardId,
  });
};

export const useCreateComponent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (component: Omit<DashboardComponent, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('dashboard_components')
        .insert(component)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-components', data.dashboard_id] });
      toast({ title: 'Component added successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to add component', description: error.message, variant: 'destructive' });
    },
  });
};

export const useUpdateComponent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dashboard_id, ...updates }: Partial<DashboardComponent> & { id: string; dashboard_id: string }) => {
      const { data, error } = await supabase
        .from('dashboard_components')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-components', data.dashboard_id] });
      toast({ title: 'Component updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to update component', description: error.message, variant: 'destructive' });
    },
  });
};

export const useDeleteComponent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, dashboard_id }: { id: string; dashboard_id: string }) => {
      const { error } = await supabase
        .from('dashboard_components')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { dashboard_id };
    },
    onSuccess: ({ dashboard_id }) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-components', dashboard_id] });
      toast({ title: 'Component deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to delete component', description: error.message, variant: 'destructive' });
    },
  });
};
