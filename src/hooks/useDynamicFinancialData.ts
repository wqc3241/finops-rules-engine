import { useState, useEffect, useCallback, useRef } from "react";
import { TableData } from "@/types/dynamicTable";
import { getInitialData } from "@/utils/mockDataUtils";
import { useSupabaseTableData } from "./useSupabaseTableData";
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
  // Check if this schema should use Supabase data
  const useSupabase = schemaId === 'fee-rules' || schemaId === 'tax-rules';
  
  // Map schema IDs to Supabase table names
  const getTableName = (id: string): 'fee_rules' | 'tax_rules' => {
    switch (id) {
      case 'fee-rules': return 'fee_rules';
      case 'tax-rules': return 'tax_rules';
      default: return 'fee_rules'; // fallback, should not happen
    }
  };

  // Use Supabase hook for fee-rules and tax-rules
  const supabaseData = useSupabaseTableData({
    tableName: getTableName(schemaId),
    schemaId,
    selectedItems,
    onSelectionChange,
    onSetBatchDeleteCallback
  });

  // Local state for other schemas
  const [localData, setLocalData] = useState<TableData[]>([]);

  // Load initial data for non-Supabase schemas
  useEffect(() => {
    if (!useSupabase) {
      console.log('Loading data for schema:', schemaId);
      const savedData = localStorage.getItem(`dynamicTableData_${schemaId}`);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          console.log('Loaded saved data:', parsedData);
          setLocalData(parsedData);
        } catch (error) {
          console.error('Failed to parse saved data:', error);
          const initialData = getInitialData(schemaId);
          console.log('Using initial data:', initialData);
          setLocalData(initialData);
        }
      } else {
        const initialData = getInitialData(schemaId);
        console.log('No saved data, using initial data:', initialData);
        setLocalData(initialData);
      }
    }
  }, [schemaId, useSupabase]);

  // Save data to localStorage for non-Supabase schemas
  useEffect(() => {
    if (!useSupabase && localData.length > 0) {
      console.log('Saving data to localStorage:', localData);
      localStorage.setItem(`dynamicTableData_${schemaId}`, JSON.stringify(localData));
    }
  }, [localData, schemaId, useSupabase]);

  // Batch delete function for local data
  const localBatchDeleteFunction = useCallback(() => {
    if (selectedItems.length === 0) return;
    
    console.log('Batch deleting items:', selectedItems);
    setLocalData(prevData => {
      const newData = prevData.filter(item => !selectedItems.includes(item.id));
      console.log('Data after batch delete:', newData);
      return newData;
    });
    
    if (onSelectionChange) {
      onSelectionChange([]);
    }
    
    toast.success(`${selectedItems.length} item(s) deleted successfully`);
  }, [selectedItems, onSelectionChange]);

  // Store the latest batch delete function in a ref for local data
  const batchDeleteRef = useRef<(() => void) | null>(null);
  batchDeleteRef.current = localBatchDeleteFunction;

  // Set up the batch delete callback for local data
  useEffect(() => {
    if (!useSupabase && onSetBatchDeleteCallback) {
      const callback = () => {
        if (batchDeleteRef.current) {
          batchDeleteRef.current();
        }
      };
      onSetBatchDeleteCallback(callback);
    }
  }, [onSetBatchDeleteCallback, useSupabase]);

  // Function to add new record for local data
  const handleAddNewLocal = useCallback((schema: any) => {
    console.log('Adding new record for schema:', schema);
    
    const newRow: any = {
      id: `${schema.id.toUpperCase()}_${Date.now()}`
    };
    
    // Initialize based on schema column types
    schema.columns.forEach((column: any) => {
      if (column.key !== 'id') {
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

    console.log('New row created:', newRow);
    setLocalData(prevData => [newRow, ...prevData]);
  }, []);

  // Return appropriate data and functions based on whether using Supabase
  if (useSupabase) {
    return {
      data: supabaseData.data,
      setData: supabaseData.setData,
      handleAddNew: supabaseData.handleAddNew,
      loading: supabaseData.loading
    };
  }

  return {
    data: localData,
    setData: setLocalData,
    handleAddNew: handleAddNewLocal,
    loading: false
  };
};