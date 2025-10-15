import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StandardReportRow } from '@/types/application/report';
import { toast } from '@/hooks/use-toast';

export const useStandardReports = () => {
  const queryClient = useQueryClient();

  // Fetch all standard reports with user profile joins
  const { data: reports, isLoading } = useQuery({
    queryKey: ['standard-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('standard_reports')
        .select(`
          *,
          created_by_profile:user_profiles!standard_reports_created_by_fkey(email),
          updated_by_profile:user_profiles!standard_reports_updated_by_fkey(email)
        `)
        .order('generated_date', { ascending: false });
      
      if (error) throw error;
      return data as unknown as StandardReportRow[];
    },
  });

  // Create a new report
  const createReport = useMutation({
    mutationFn: async (reportData: Partial<StandardReportRow>) => {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('standard_reports')
        .insert({
          title: reportData.title!,
          description: reportData.description,
          report_type: reportData.report_type!,
          report_data: reportData.report_data as any,
          created_by: userData.user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standard-reports'] });
      toast({
        title: 'Report created',
        description: 'Standard report has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create report: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete a report
  const deleteReport = useMutation({
    mutationFn: async (reportId: string) => {
      const { error } = await supabase
        .from('standard_reports')
        .delete()
        .eq('id', reportId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standard-reports'] });
      toast({
        title: 'Report deleted',
        description: 'Report has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete report: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    reports: reports || [],
    isLoading,
    createReport,
    deleteReport,
  };
};
