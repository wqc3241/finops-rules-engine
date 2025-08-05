import { useState, useEffect, useCallback, useRef } from "react";
import { TableData } from "@/types/dynamicTable";
import { getInitialData } from "@/utils/mockDataUtils";
import { useApprovalWorkflow } from "./useApprovalWorkflow";
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
  const { isTableLocked } = useApprovalWorkflow();
  const { startTracking, updateTracking } = useChangeTracking();

  // Load initial data
  useEffect(() => {
    console.log('Loading data for schema:', schemaId);
    const savedData = localStorage.getItem(`dynamicTableData_${schemaId}`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('Loaded saved data:', parsedData);
        setLocalData(parsedData);
        startTracking(schemaId, parsedData);
      } catch (error) {
        console.error('Failed to parse saved data:', error);
        const initialData = getInitialData(schemaId);
        console.log('Using initial data:', initialData);
        setLocalData(initialData);
        startTracking(schemaId, initialData);
      }
    } else {
      const initialData = getInitialData(schemaId);
      console.log('No saved data, using initial data:', initialData);
      setLocalData(initialData);
      startTracking(schemaId, initialData);
    }
  }, [schemaId, startTracking]);

  // Save data to localStorage and update tracking
  useEffect(() => {
    if (localData.length > 0) {
      console.log('Saving data to localStorage:', localData);
      localStorage.setItem(`dynamicTableData_${schemaId}`, JSON.stringify(localData));
      updateTracking(schemaId, localData);
    }
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