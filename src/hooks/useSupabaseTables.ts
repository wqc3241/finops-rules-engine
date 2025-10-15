import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TableColumn } from '@/types/dashboard';

interface SupabaseTable {
  table_name: string;
  table_type: string;
}

export const useSupabaseTables = () => {
  const { data: tables, isLoading: tablesLoading } = useQuery<SupabaseTable[]>({
    queryKey: ['supabase-tables'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_all_tables');
      if (error) throw error;
      return data || [];
    },
  });

  const fetchColumnsForTable = async (tableName: string): Promise<TableColumn[]> => {
    const { data, error } = await supabase.rpc('get_table_columns', { 
      table_name_param: tableName 
    });
    
    if (error) throw error;
    
    const columns = data as any[] || [];
    return columns.map((col: any) => ({
      name: col.column_name,
      type: col.data_type,
      nullable: col.is_nullable === 'YES'
    }));
  };

  return { 
    tables: tables || [], 
    tablesLoading,
    fetchColumnsForTable 
  };
};
