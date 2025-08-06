import { useState, useEffect, useCallback, useRef } from "react";
import { TableData } from "@/types/dynamicTable";
import { getInitialData } from "@/utils/mockDataUtils";
import { getDynamicTableData, saveDynamicTableData, hasDynamicTableData } from "@/utils/dynamicTableStorage";
import { useSupabaseApprovalWorkflow } from "./useSupabaseApprovalWorkflow";
import { useSupabaseTableData } from "./useSupabaseTableData";
import { useChangeTracking } from "./useChangeTracking";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseDynamicFinancialDataProps {
  schemaId: string;
  selectedItems: string[];
  onSelectionChange?: (items: string[]) => void;
  onSetBatchDeleteCallback?: (callback: () => void) => void;
}

export const useDynamicFinancialData = ({
  schemaId,
  selectedItems,
  onSelectionChange,
  onSetBatchDeleteCallback
}: UseDynamicFinancialDataProps) => {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const { isTableLocked } = useSupabaseApprovalWorkflow();
  const { startTracking, updateTracking } = useChangeTracking();

  // Map schema IDs to Supabase table names with type safety
  const getTableName = (schemaId: string) => {
    const tableMap = {
      'bulletin-pricing': 'bulletin_pricing',
      'pricing-types': 'pricing_types',
      'financial-products': 'financial_products',
      'credit-profile': 'credit_profiles',
      'pricing-config': 'pricing_configs',
      'financial-program-config': 'financial_program_configs',
      'advertised-offers': 'advertised_offers',
      'fee-rules': 'fee_rules',
      'tax-rules': 'tax_rules',
      'gateway': 'gateways',
      'dealer': 'dealers',
      'lender': 'lenders',
      'country': 'countries',
      'state': 'states',
      'location-geo': 'location_geo',
      'lease-config': 'lease_configs',
      'vehicle-condition': 'vehicle_conditions',
      'vehicle-options': 'vehicle_options',
      'routing-rule': 'routing_rules',
      'stipulation': 'stipulations',
      'vehicle-style-coding': 'vehicle_style_coding',
      'order-type': 'order_types'
    } as const;
    
    type TableName = typeof tableMap[keyof typeof tableMap];
    return (tableMap[schemaId as keyof typeof tableMap] || schemaId) as TableName;
  };

  // Load data from Supabase
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const tableName = getTableName(schemaId);
      const { data: supabaseData, error } = await supabase
        .from(tableName as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading data from Supabase:', error);
        toast.error(`Failed to load ${schemaId} data`);
        // Fallback to initial data if Supabase fails
        const fallbackData = getInitialData(schemaId);
        setData(fallbackData);
        startTracking(schemaId, fallbackData);
      } else {
        console.log('Loaded data from Supabase:', supabaseData);
        const formattedData = supabaseData || [];
        setData(formattedData);
        startTracking(schemaId, formattedData);
      }
    } catch (error) {
      console.error('Error in loadData:', error);
      const fallbackData = getInitialData(schemaId);
      setData(fallbackData);
      startTracking(schemaId, fallbackData);
    } finally {
      setLoading(false);
    }
  }, [schemaId, startTracking]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Update tracking when data changes
  useEffect(() => {
    updateTracking(schemaId, data);
  }, [data, schemaId, updateTracking]);

  // Batch delete function for Supabase data
  const supabaseBatchDeleteFunction = useCallback(async () => {
    if (selectedItems.length === 0) return;
    
    try {
      const tableName = getTableName(schemaId);
      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .in('id', selectedItems);

      if (error) {
        console.error('Error deleting from Supabase:', error);
        toast.error('Failed to delete items');
        return;
      }

      console.log('Batch deleted items from Supabase:', selectedItems);
      
      // Update local state
      setData(prevData => prevData.filter(item => !selectedItems.includes(item.id)));
      
      if (onSelectionChange) {
        onSelectionChange([]);
      }
      
      toast.success(`${selectedItems.length} item(s) deleted successfully`);
    } catch (error) {
      console.error('Error in batch delete:', error);
      toast.error('Failed to delete items');
    }
  }, [selectedItems, onSelectionChange, schemaId]);

  // Store the latest batch delete function in a ref for Supabase data
  const batchDeleteRef = useRef<(() => void) | null>(null);
  batchDeleteRef.current = supabaseBatchDeleteFunction;

  // Set up the batch delete callback
  useEffect(() => {
    if (onSetBatchDeleteCallback) {
      const callback = () => {
        if (batchDeleteRef.current) {
          batchDeleteRef.current();
        }
      };
      onSetBatchDeleteCallback(callback);
    }
  }, [onSetBatchDeleteCallback]);

  // Function to add new record to Supabase
  const handleAddNewSupabase = useCallback(async (schema: any) => {
    try {
      const tableName = getTableName(schemaId);
      
      const newRow: any = {};
      
      // Initialize based on schema column types (excluding id which is auto-generated)
      schema.columns.forEach((column: any) => {
        if (column.key !== 'id' && column.editable) {
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

      console.log('Adding new row to Supabase:', newRow);
      
      const { data: insertedData, error } = await supabase
        .from(tableName as any)
        .insert([newRow])
        .select()
        .single();

      if (error) {
        console.error('Error inserting to Supabase:', error);
        toast.error('Failed to add new record');
        return;
      }

      console.log('New row inserted:', insertedData);
      setData(prevData => [insertedData, ...prevData]);
      toast.success('New record added successfully');
    } catch (error) {
      console.error('Error in handleAddNewSupabase:', error);
      toast.error('Failed to add new record');
    }
  }, [schemaId]);

  // Function to update data in Supabase
  const handleDataChange = useCallback(async (newData: TableData[]) => {
    setData(newData);
    // Note: Individual row updates are handled by the DynamicTable component
    // This function mainly handles bulk state updates
  }, []);

  return {
    data,
    setData: handleDataChange,
    handleAddNew: handleAddNewSupabase,
    loading,
    isLocked: isTableLocked(schemaId),
    refetch: loadData
  };
};