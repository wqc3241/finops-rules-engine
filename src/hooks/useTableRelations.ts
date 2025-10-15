import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ForeignKeyRelation } from '@/types/report';

export const useTableRelations = (tableName: string | null) => {
  return useQuery<ForeignKeyRelation[]>({
    queryKey: ['table-foreign-keys', tableName],
    queryFn: async () => {
      if (!tableName) return [];
      
      const { data, error } = await supabase.rpc('get_foreign_keys', {
        table_name_param: tableName
      });
      
      if (error) throw error;
      
      return (data || []).map((fk: any) => ({
        sourceColumn: fk.source_column,
        foreignTable: fk.foreign_table,
        foreignColumn: fk.foreign_column
      }));
    },
    enabled: !!tableName
  });
};
