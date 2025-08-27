import { useState, useEffect, useCallback, useRef } from "react";
import { TableData } from "@/types/dynamicTable";
// Removed dependencies on mock data and local storage
import { useSupabaseApprovalWorkflow } from "./useSupabaseApprovalWorkflow";
import { useSupabaseTableData } from "./useSupabaseTableData";
import { useChangeTracking } from "./useChangeTracking";
import { useAuth } from "./useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseDynamicFinancialDataProps {
  schemaId: string;
  selectedItems: string[];
  onSelectionChange?: (items: string[], schemaId: string) => void;
  onSetBatchDeleteCallback?: (callback: () => void) => void;
  onSetBatchDuplicateCallback?: (callback: () => void) => void;
  // Pagination props
  pageSize?: number;
  currentPage?: number;
}

export const useDynamicFinancialData = ({
  schemaId,
  selectedItems,
  onSelectionChange,
  onSetBatchDeleteCallback,
  onSetBatchDuplicateCallback,
  pageSize = 100,
  currentPage = 1
}: UseDynamicFinancialDataProps) => {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
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
      'discount-rules': 'discount_rules',
      'gateway': 'gateways',
      'dealer': 'dealers',
      'lender': 'lenders',
      'country': 'countries',
      'state': 'states',
      'geo-location': 'geo_location',
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

  // Get appropriate ordering column dynamically for each table
  const getOrderByColumn = useCallback(async (tableName: string) => {
    try {
      // Try to get ordering column from database schema
      const { data: columnData, error } = await supabase.rpc('get_table_columns', { 
        table_name_param: tableName 
      }) as { data: Array<{ column_name: string, data_type: string, is_nullable: string, column_default: string }> | null, error: any };

      if (!error && columnData) {
        // Prefer timestamp columns for ordering
        const timestampColumns = ['created_at', 'updated_at', 'updated_date'];
        for (const tsCol of timestampColumns) {
          if (columnData.some((col) => col.column_name === tsCol)) {
            return tsCol;
          }
        }
        
        // If no timestamp columns, try to get primary key
        const { data: pkData, error: pkError } = await supabase.rpc('get_primary_keys', { 
          table_name_param: tableName 
        }) as { data: Array<{ column_name: string }> | null, error: any };
        
        if (!pkError && pkData && pkData.length > 0) {
          return pkData[0].column_name;
        }
        
        // Use first column as ultimate fallback
        if (columnData.length > 0) {
          return columnData[0].column_name;
        }
      }
    } catch (error) {
      console.warn(`Failed to get ordering column for ${tableName}:`, error);
    }

    // Table-specific fallbacks when database queries fail
    const fallbacks: Record<string, string> = {
      'geo_location': 'geo_code',
      'credit_profiles': 'profile_id', 
      'pricing_configs': 'pricing_rule_id',
      'financial_products': 'product_id',
      'bulletin_pricing': 'bulletin_id',
      'fee_rules': '_id',
    };

    return fallbacks[tableName] || 'id';
  }, []);

  // Load data from Supabase with pagination
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const tableName = getTableName(schemaId);
      const orderByColumn = await getOrderByColumn(tableName);
      
      // Calculate range for pagination
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize - 1;
      
      // Get total count
      const { count, error: countError } = await supabase
        .from(tableName as any)
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error getting count:', countError);
        setTotalCount(0);
      } else {
        setTotalCount(count || 0);
      }

      // Get paginated data
      const { data: supabaseData, error } = await supabase
        .from(tableName as any)
        .select('*')
        .order(orderByColumn, { ascending: false })
        .range(startIndex, endIndex);

      if (error) {
        console.error('Error loading data from Supabase:', error);
        toast.error(`Failed to load ${schemaId} data: ${error.message}`);
        setData([]);
        startTracking(schemaId, []);
      } else {
        console.log('Loaded paginated data from Supabase:', supabaseData);
        const formattedData = supabaseData || [];
        setData(formattedData);
        const pk = await getPrimaryKey(schemaId);
        startTracking(schemaId, formattedData, pk);
      }
    } catch (error) {
      console.error('Error in loadData:', error);
      toast.error(`Failed to load ${schemaId} data`);
      setData([]);
      startTracking(schemaId, []);
    } finally {
      setLoading(false);
    }
  }, [schemaId, startTracking, getOrderByColumn, currentPage, pageSize]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Update tracking when data changes
  useEffect(() => {
    updateTracking(schemaId, data);
  }, [data, schemaId, updateTracking]);

  // Get primary key name dynamically for a given schema
  const getPrimaryKey = useCallback(async (schemaId: string): Promise<string> => {
    try {
      const tableName = getTableName(schemaId);
      
      // Try to get primary key from database schema
      const { data: pkData, error } = await supabase.rpc('get_primary_keys', { 
        table_name_param: tableName 
      }) as { data: Array<{ column_name: string }> | null, error: any };

      if (!error && pkData && pkData.length > 0) {
        return pkData[0].column_name;
      }
    } catch (error) {
      console.warn(`Failed to get primary key for ${schemaId}:`, error);
    }

    // Table-specific fallbacks for when primary key detection fails
    const fallbacks: Record<string, string> = {
      'geo_location': 'geo_code',
      'credit_profiles': 'profile_id',
      'pricing_configs': 'pricing_rule_id',
      'financial_products': 'product_id',
      'bulletin_pricing': 'bulletin_id',
      'fee_rules': '_id',
    };
    
    const tableName = getTableName(schemaId);
    return fallbacks[tableName] || 'id';
  }, []);

  // Batch delete function for Supabase data
  const supabaseBatchDeleteFunction = useCallback(async () => {
    if (selectedItems.length === 0) return;
    
    try {
      const tableName = getTableName(schemaId);
      const primaryKey = await getPrimaryKey(schemaId);
      
      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .in(primaryKey, selectedItems);

      if (error) {
        console.error('Error deleting from Supabase:', error);
        toast.error('Failed to delete items');
        return;
      }

      console.log('Batch deleted items from Supabase:', selectedItems);
      
      // Update local state using the correct primary key
      setData(prevData => prevData.filter(item => !selectedItems.includes(item[primaryKey])));
      
      if (onSelectionChange) {
        onSelectionChange([], schemaId);
      }
      
      toast.success(`${selectedItems.length} item(s) deleted successfully`);
    } catch (error) {
      console.error('Error in batch delete:', error);
      toast.error('Failed to delete items');
    }
  }, [selectedItems, onSelectionChange, schemaId, getPrimaryKey]);

  // Batch duplicate function for Supabase data
  const supabaseBatchDuplicateFunction = useCallback(async () => {
    if (selectedItems.length === 0) return;
    
    try {
      const tableName = getTableName(schemaId);
      const primaryKey = await getPrimaryKey(schemaId);
      
      // Get the selected items to duplicate
      const itemsToDuplicate = data.filter(item => selectedItems.includes(item[primaryKey]));
      
      if (itemsToDuplicate.length === 0) {
        toast.error('No items found to duplicate');
        return;
      }

      // Create new records by duplicating the selected ones
      const duplicatedItems = itemsToDuplicate.map(item => {
        const newItem = { ...item };
        delete newItem[primaryKey]; // Remove primary key so it auto-generates
        
        // Special handling for financial-program-config
        if (schemaId === 'financial-program-config') {
          // Import getNextFPCId function logic directly since we can't import from utils
          const fpIds = data
            .map(row => typeof row.id === "string" && row.id.match(/^FPC(\d{2})$/) ? Number(row.id.slice(3)) : null)
            .filter((v): v is number => v !== null);
          const nextNumber = fpIds.length > 0 ? Math.max(...fpIds) + 1 : 1;
          const newId = `FPC${String(nextNumber).padStart(2, "0")}`;
          
          newItem.id = newId;
          newItem.version = ((item.version || 1) + 1);
          newItem.cloneFrom = item.programCode || item.program_code || null;
        } else {
          // For other tables, increment version if it exists
          if (item.version) {
            newItem.version = item.version + 1;
          }
        }
        
        return newItem;
      });

      // Insert duplicated items into Supabase
      const { data: insertedData, error } = await supabase
        .from(tableName as any)
        .insert(duplicatedItems)
        .select();

      if (error) {
        console.error('Error duplicating items in Supabase:', error);
        toast.error('Failed to duplicate items');
        return;
      }

      console.log('Batch duplicated items in Supabase:', insertedData);
      
      // Update local state with the new duplicated items
      setData(prevData => [...(insertedData || []), ...prevData]);
      
      if (onSelectionChange) {
        onSelectionChange([], schemaId);
      }
      
      toast.success(`${selectedItems.length} item(s) duplicated successfully`);
    } catch (error) {
      console.error('Error in batch duplicate:', error);
      toast.error('Failed to duplicate items');
    }
  }, [selectedItems, onSelectionChange, schemaId, getPrimaryKey, data]);

  // Store the latest batch delete function in a ref for Supabase data
  const batchDeleteRef = useRef<(() => void) | null>(null);
  batchDeleteRef.current = supabaseBatchDeleteFunction;

  // Store the latest batch duplicate function in a ref for Supabase data
  const batchDuplicateRef = useRef<(() => void) | null>(null);
  batchDuplicateRef.current = supabaseBatchDuplicateFunction;

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

  // Set up the batch duplicate callback
  useEffect(() => {
    if (onSetBatchDuplicateCallback) {
      const callback = () => {
        if (batchDuplicateRef.current) {
          batchDuplicateRef.current();
        }
      };
      onSetBatchDuplicateCallback(callback);
    }
  }, [onSetBatchDuplicateCallback]);

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
            // profile_id is required
            if (!row['profile_id']) row['profile_id'] = `PROF_${Date.now()}`;
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
          case 'pricing_configs':
            // pricing_rule_id is required
            if (!row['pricing_rule_id']) row['pricing_rule_id'] = `RULE_${Date.now()}`;
            break;
          case 'financial_products':
            // product_id and product_type are required
            if (!row['product_id']) row['product_id'] = `PROD_${Date.now()}`;
            if (!row['product_type']) row['product_type'] = 'Loan';
            break;
          case 'countries':
            // country_code and country_name are required
            if (!row['country_code']) row['country_code'] = 'XX';
            if (!row['country_name']) row['country_name'] = 'New Country';
            break;
          case 'states':
            // state_name is required
            if (!row['state_name']) row['state_name'] = 'New State';
            break;
          case 'order_types':
            // type_code and type_name are required
            if (!row['type_code']) row['type_code'] = 'NEW';
            if (!row['type_name']) row['type_name'] = 'New Type';
            break;
          case 'stipulations':
            // stipulation_name is required
            if (!row['stipulation_name']) row['stipulation_name'] = 'New Stipulation';
            break;
          case 'gateways':
            // gateway_name is required
            if (!row['gateway_name']) row['gateway_name'] = 'New Gateway';
            break;
          case 'lenders':
            // lender_name and Gateway lender ID are required
            if (!row['lender_name']) row['lender_name'] = 'New Lender';
            if (!row['Gateway lender ID']) row['Gateway lender ID'] = `GL_${Date.now()}`;
            break;
          case 'dealers':
            // id is required and not auto-generated
            if (!row['id']) row['id'] = `D_${Date.now()}`;
            break;
        }
        return row;
      };
      
      // Initialize based on schema column types (excluding primary keys which are auto-generated or manually handled)
      const primaryKey = await getPrimaryKey(schemaId);
      schema.columns.forEach((column: any) => {
        console.log('Processing column:', column);
        if (column.key !== primaryKey && column.editable) {
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

      console.log('Final row to insert (pre-sanitize):', finalRow);

      // IMPORTANT: Remove empty-string values to avoid type errors on numeric/integer columns
      const sanitizedRow = Object.fromEntries(
        Object.entries(finalRow).filter(([, v]) => v !== '' && v !== undefined)
      );

      console.log('Final row to insert (sanitized):', sanitizedRow);
      
      const { data: insertedData, error } = await supabase
        .from(tableName as any)
        .insert([sanitizedRow])
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
  }, [schemaId, getPrimaryKey]);

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
    refetch: loadData,
    totalCount,
    pageSize,
    currentPage
  };
};