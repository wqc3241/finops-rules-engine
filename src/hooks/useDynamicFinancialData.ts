import { useState, useEffect, useCallback, useRef } from "react";
import { TableData } from "@/types/dynamicTable";
import { getInitialData } from "@/utils/mockDataUtils";
import { getDynamicTableData, saveDynamicTableData, hasDynamicTableData } from "@/utils/dynamicTableStorage";
import { useSupabaseApprovalWorkflow } from "./useSupabaseApprovalWorkflow";
import { useSupabaseTableData } from "./useSupabaseTableData";
import { useChangeTracking } from "./useChangeTracking";
import { useAuth } from "./useSupabaseAuth";
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
  const { user, profile } = useAuth();

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
    console.log('=== ADD NEW RECORD DEBUG ===');
    console.log('Schema ID:', schemaId);
    console.log('Schema:', schema);
    console.log('Current user:', user);
    console.log('Current profile:', profile);
    
    try {
      const tableName = getTableName(schemaId);
      console.log('Table name:', tableName);
      
      // Check current user authentication state
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      console.log('Auth check - Current user:', currentUser);
      console.log('Auth check - User error:', userError);
      
      if (!currentUser) {
        console.error('No authenticated user found');
        toast.error('You must be logged in to add records');
        return;
      }
      
      const newRow: any = {};
      
      // Handle table-specific required fields and defaults
      const handleTableSpecificFields = (tableName: string, row: any) => {
        switch (tableName) {
          case 'fee_rules':
            // fee_rules has a required _id field that's not UUID
            row['_id'] = `fee_${Date.now()}`;
            break;
          case 'credit_profiles':
            // Make sure required fields are set properly
            break;
          case 'tax_rules':
            // tax_rules requires tax_name and tax_type
            if (!row['tax_name']) row['tax_name'] = 'New Tax Rule';
            if (!row['tax_type']) row['tax_type'] = 'Percentage';
            break;
          case 'pricing_types':
            // pricing_types requires type_code and type_name
            if (!row['type_code']) row['type_code'] = 'NEW';
            if (!row['type_name']) row['type_name'] = 'New Type';
            break;
          case 'financial_program_configs':
            // program_code is required
            if (!row['program_code']) row['program_code'] = `PROG_${Date.now()}`;
            break;
        }
        return row;
      };
      
      // Initialize based on schema column types (excluding id which is auto-generated)
      schema.columns.forEach((column: any) => {
        console.log('Processing column:', column);
        if (column.key !== 'id' && column.editable) {
          switch (column.type) {
            case 'boolean':
              newRow[column.key] = false;
              break;
            case 'number':
              newRow[column.key] = 0;
              break;
            default:
              newRow[column.key] = column.isRequired ? 'Required Field' : '';
          }
        }
      });

      // Apply table-specific handling
      const finalRow = handleTableSpecificFields(tableName, newRow);

      console.log('Final row to insert:', finalRow);
      
      const { data: insertedData, error } = await supabase
        .from(tableName as any)
        .insert([finalRow])
        .select()
        .single();

      console.log('Supabase insert result:', { insertedData, error });

      if (error) {
        console.error('Supabase insert error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        toast.error(`Failed to add new record: ${error.message}`);
        return;
      }

      console.log('New row successfully inserted:', insertedData);
      setData(prevData => [insertedData, ...prevData]);
      toast.success('New record added successfully');
    } catch (error) {
      console.error('Catch block error in handleAddNewSupabase:', error);
      toast.error(`Failed to add new record: ${error instanceof Error ? error.message : 'Unknown error'}`);
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