
import { useState, useEffect, useCallback, useRef } from "react";
import { TableData } from "@/types/dynamicTable";
import { getInitialData } from "@/utils/mockDataUtils";
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

  // Load initial data based on schema
  useEffect(() => {
    console.log('Loading data for schema:', schemaId);
    const savedData = localStorage.getItem(`dynamicTableData_${schemaId}`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('Loaded saved data:', parsedData);
        setData(parsedData);
      } catch (error) {
        console.error('Failed to parse saved data:', error);
        const initialData = getInitialData(schemaId);
        console.log('Using initial data:', initialData);
        setData(initialData);
      }
    } else {
      const initialData = getInitialData(schemaId);
      console.log('No saved data, using initial data:', initialData);
      setData(initialData);
    }
  }, [schemaId]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (data.length > 0) {
      console.log('Saving data to localStorage:', data);
      localStorage.setItem(`dynamicTableData_${schemaId}`, JSON.stringify(data));
    }
  }, [data, schemaId]);

  // Use ref to store the callback and update it only when needed
  const batchDeleteCallbackRef = useRef<(() => void) | null>(null);

  // Create batch delete function that always uses current data
  const batchDeleteFunction = useCallback(() => {
    setData(currentData => {
      const updatedData = currentData.filter(row => !selectedItems.includes(row.id));
      onSelectionChange?.([]);
      return updatedData;
    });
  }, [selectedItems, onSelectionChange]);

  // Store the function in ref and set up callback only once
  useEffect(() => {
    batchDeleteCallbackRef.current = batchDeleteFunction;
  }, [batchDeleteFunction]);

  // Set up the callback only once when the component mounts
  useEffect(() => {
    if (onSetBatchDeleteCallback) {
      onSetBatchDeleteCallback(() => batchDeleteCallbackRef.current?.());
    }
  }, [onSetBatchDeleteCallback]);

  const handleAddNew = (schema: any) => {
    if (!schema) {
      toast.error("Schema not found");
      return;
    }

    const newRow: TableData = {
      id: `new_${Date.now()}`,
    };

    // Initialize with default values based on column types
    schema.columns.forEach((column: any) => {
      if (column.key !== 'id') {
        switch (column.type) {
          case 'string':
            newRow[column.key] = '';
            break;
          case 'boolean':
            newRow[column.key] = false;
            break;
          case 'number':
            newRow[column.key] = 0;
            break;
        }
      }
    });

    setData(prev => [...prev, newRow]);
    toast.success("New record added");
  };

  return {
    data,
    setData,
    handleAddNew
  };
};
