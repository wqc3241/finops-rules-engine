import { useState, useEffect, useCallback, useRef } from "react";
import { TableData } from "@/types/dynamicTable";
import { getInitialData } from "@/utils/mockDataUtils";
import { getDynamicTableData, saveDynamicTableData, hasDynamicTableData } from "@/utils/dynamicTableStorage";
import { useSupabaseApprovalWorkflow } from "./useSupabaseApprovalWorkflow";
import { useSupabaseTableData } from "./useSupabaseTableData";
import { useChangeTracking } from "./useChangeTracking";
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
  // All schemas now use local data (Supabase disconnected)
  const [localData, setLocalData] = useState<TableData[]>([]);
  const { isTableLocked } = useSupabaseApprovalWorkflow();
  const { startTracking, updateTracking } = useChangeTracking();

  // Load initial data
  useEffect(() => {
    if (hasDynamicTableData(schemaId)) {
      const savedData = getDynamicTableData(schemaId);
      setLocalData(savedData);
      startTracking(schemaId, savedData);
    } else {
      const initialData = getInitialData(schemaId);
      setLocalData(initialData);
      startTracking(schemaId, initialData);
      // Save initial data immediately to prevent duplicate initialization
      saveDynamicTableData(schemaId, initialData);
    }
  }, [schemaId, startTracking]);

  // Save data to localStorage and update tracking (debounced to prevent excessive saves)
  const saveDataRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    // Clear any pending save
    if (saveDataRef.current) {
      clearTimeout(saveDataRef.current);
    }
    
    // Debounce saves to prevent excessive localStorage operations
    saveDataRef.current = setTimeout(() => {
      saveDynamicTableData(schemaId, localData);
      updateTracking(schemaId, localData);
    }, 100);
    
    return () => {
      if (saveDataRef.current) {
        clearTimeout(saveDataRef.current);
      }
    };
  }, [localData, schemaId, updateTracking]);

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

  return {
    data: localData,
    setData: setLocalData,
    handleAddNew: handleAddNewLocal,
    loading: false,
    isLocked: isTableLocked(schemaId)
  };
};