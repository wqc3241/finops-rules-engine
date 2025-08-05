import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TableData } from '@/types/dynamicTable';

interface SupabaseDataOperations {
  updateRecord: (tableName: string, id: string, updates: any) => Promise<void>;
  deleteRecord: (tableName: string, id: string) => Promise<void>;
  deleteRecords: (tableName: string, ids: string[]) => Promise<void>;
}

export const useSupabaseDataOperations = (): SupabaseDataOperations => {
  const { toast } = useToast();

  const updateRecord = useCallback(async (tableName: string, id: string, updates: any) => {
    try {
      const { error } = await supabase
        .from(tableName as any)
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Record updated successfully",
      });
    } catch (error) {
      console.error(`Error updating ${tableName} record:`, error);
      toast({
        title: "Error",
        description: `Failed to update ${tableName} record`,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const deleteRecord = useCallback(async (tableName: string, id: string) => {
    try {
      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Record deleted successfully",
      });
    } catch (error) {
      console.error(`Error deleting ${tableName} record:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${tableName} record`,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const deleteRecords = useCallback(async (tableName: string, ids: string[]) => {
    try {
      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .in('id', ids);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `${ids.length} records deleted successfully`,
      });
    } catch (error) {
      console.error(`Error deleting ${tableName} records:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${tableName} records`,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  return {
    updateRecord,
    deleteRecord,
    deleteRecords
  };
};