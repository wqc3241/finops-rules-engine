import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface AIGeneratedReport {
  id: string;
  title: string;
  description: string | null;
  query_parameters: any;
  report_data: any;
  chart_config: any;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AIGeneratedDashboard {
  id: string;
  name: string;
  description: string | null;
  layout_config: any;
  widgets: any;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useAIGeneratedReports = () => {
  return useQuery({
    queryKey: ['ai-generated-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_generated_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AIGeneratedReport[];
    },
  });
};

export const useAIGeneratedDashboards = () => {
  return useQuery({
    queryKey: ['ai-generated-dashboards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_generated_dashboards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AIGeneratedDashboard[];
    },
  });
};

export const useDeleteAIReport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (reportId: string) => {
      const { error } = await supabase
        .from('ai_generated_reports')
        .delete()
        .eq('id', reportId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-generated-reports'] });
      toast({ title: 'Success', description: 'Report deleted successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: `Failed to delete report: ${error.message}`, 
        variant: 'destructive' 
      });
    }
  });
};

export const useDeleteAIDashboard = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (dashboardId: string) => {
      const { error } = await supabase
        .from('ai_generated_dashboards')
        .delete()
        .eq('id', dashboardId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-generated-dashboards'] });
      toast({ title: 'Success', description: 'Dashboard deleted successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: `Failed to delete dashboard: ${error.message}`, 
        variant: 'destructive' 
      });
    }
  });
};