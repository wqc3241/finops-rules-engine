import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from 'react-grid-layout';

// Helper to ensure all components have layout entries
const syncLayoutWithComponents = (
  existingLayout: Layout[], 
  componentIds: string[]
): Layout[] => {
  const layoutMap = new Map(existingLayout.map(item => [item.i, item]));
  const synced: Layout[] = [];
  
  componentIds.forEach((id, index) => {
    if (layoutMap.has(id)) {
      // Component has layout entry, use it
      synced.push(layoutMap.get(id)!);
    } else {
      // Component missing from layout, create default entry
      synced.push({
        i: id,
        x: (index * 6) % 12,
        y: Math.floor(index / 2) * 4,
        w: 6,
        h: 4,
      });
    }
  });
  
  return synced;
};

export const useDashboardLayout = (dashboardId: string | null, componentIds: string[] = []) => {
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

      const existingLayout = (Array.isArray(data?.layout_config) ? data.layout_config as unknown as Layout[] : []);
      const syncedLayout = syncLayoutWithComponents(existingLayout, componentIds);
      setLayout(syncedLayout);
    };

    loadLayout();
  }, [dashboardId, componentIds.join(',')]);

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
  });

  return { layout, setLayout, saveLayout };
};
