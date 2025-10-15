import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from 'react-grid-layout';

export const useDashboardLayout = (dashboardId: string | null) => {
  const [layout, setLayout] = useState<Layout[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadLayout = async () => {
      if (!dashboardId) return;
      
      const { data } = await supabase
        .from('custom_dashboards')
        .select('layout_config')
        .eq('id', dashboardId)
        .single();

      if (data?.layout_config && Array.isArray(data.layout_config)) {
        setLayout(data.layout_config as unknown as Layout[]);
      }
    };

    loadLayout();
  }, [dashboardId]);

  const saveLayout = useMutation({
    mutationFn: async (newLayout: Layout[]) => {
      if (!dashboardId) throw new Error('No dashboard selected');
      
      const { error } = await supabase
        .from('custom_dashboards')
        .update({ 
          layout_config: newLayout as any,
          updated_at: new Date().toISOString() 
        })
        .eq('id', dashboardId);

      if (error) throw error;
      return newLayout;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-dashboards'] });
    },
  });

  return { layout, setLayout, saveLayout };
};
