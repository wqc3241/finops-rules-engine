import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TableData } from "@/types/dynamicTable";
import { toast } from "sonner";

interface UseSupabaseTableDataProps {
  tableName: 'fee_rules' | 'tax_rules';
  schemaId: string;
  selectedItems: string[];
  onSelectionChange?: (items: string[]) => void;
  onSetBatchDeleteCallback?: (callback: () => void) => void;
}

export const useSupabaseTableData = ({
  tableName,
  schemaId,
  selectedItems,
  onSelectionChange,
  onSetBatchDeleteCallback
}: UseSupabaseTableDataProps) => {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Supabase
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: supabaseData, error } = await supabase
        .from(tableName)
        .select('*')
        .order(tableName === 'fee_rules' ? 'createdAt' : 'created_at', { ascending: false });

      if (error) {
        console.error('Error fetching data:', error);
        toast.error(`Failed to fetch ${tableName} data`);
        return;
      }

      setData(supabaseData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(`Failed to fetch ${tableName} data`);
    } finally {
      setLoading(false);
    }
  }, [tableName]);

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle adding new records
  const handleAddNew = useCallback(async (schema: any) => {
    const newRow: any = { id: crypto.randomUUID() };
    
    // Initialize with default values based on schema
    schema.columns.forEach((column: any) => {
      if (column.key !== 'id' && column.key !== 'created_at' && column.key !== 'updated_at' && column.key !== 'createdAt' && column.key !== 'updatedAt') {
        switch (column.type) {
          case 'boolean':
            newRow[column.key] = false;
            break;
          case 'number':
            newRow[column.key] = 0;
            break;
          default:
            newRow[column.key] = '';
        }
      }
    });

    try {
      const { data: insertedData, error } = await supabase
        .from(tableName)
        .insert([newRow])
        .select()
        .single();

      if (error) {
        console.error('Error inserting data:', error);
        toast.error(`Failed to add new ${tableName} record`);
        return;
      }

      setData(prev => [insertedData, ...prev]);
      toast.success(`New ${tableName} record added successfully`);
    } catch (error) {
      console.error('Error inserting data:', error);
      toast.error(`Failed to add new ${tableName} record`);
    }
  }, [tableName]);

  // Handle data updates
  const handleDataChange = useCallback(async (newData: TableData[]) => {
    setData(newData);
    
    // You could implement auto-save here if needed
    // For now, we'll just update the local state
  }, []);

  // Handle batch delete
  const batchDeleteFunction = useCallback(async () => {
    if (selectedItems.length === 0) return;

    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .in('id', selectedItems);

      if (error) {
        console.error('Error deleting records:', error);
        toast.error(`Failed to delete ${tableName} records`);
        return;
      }

      setData(prev => prev.filter(item => !selectedItems.includes(item.id)));
      onSelectionChange?.([]);
      toast.success(`${selectedItems.length} ${tableName} record(s) deleted successfully`);
    } catch (error) {
      console.error('Error deleting records:', error);
      toast.error(`Failed to delete ${tableName} records`);
    }
  }, [selectedItems, tableName, onSelectionChange]);

  // Set up batch delete callback
  useEffect(() => {
    if (onSetBatchDeleteCallback) {
      onSetBatchDeleteCallback(batchDeleteFunction);
    }
  }, [batchDeleteFunction, onSetBatchDeleteCallback]);

  return {
    data,
    loading,
    setData: handleDataChange,
    handleAddNew,
    refetch: fetchData
  };
};