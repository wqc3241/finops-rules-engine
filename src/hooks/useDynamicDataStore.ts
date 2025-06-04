
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TableData } from '@/types/dynamicTable';
import { getInitialData } from '@/utils/mockDataUtils';

interface DataStore {
  [schemaId: string]: TableData[];
}

interface DynamicDataStoreContextType {
  getData: (schemaId: string) => TableData[];
  setData: (schemaId: string, data: TableData[]) => void;
  updateData: (schemaId: string, updater: (data: TableData[]) => TableData[]) => void;
}

const DynamicDataStoreContext = createContext<DynamicDataStoreContextType | undefined>(undefined);

export function DynamicDataStoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<DataStore>({});

  // Initialize data for a schema if not already loaded
  const initializeSchemaData = (schemaId: string) => {
    if (!store[schemaId]) {
      const savedData = localStorage.getItem(`dynamicTableData_${schemaId}`);
      let initialData: TableData[];
      
      if (savedData) {
        try {
          initialData = JSON.parse(savedData);
        } catch (error) {
          console.error('Failed to parse saved data:', error);
          initialData = getInitialData(schemaId);
        }
      } else {
        initialData = getInitialData(schemaId);
      }
      
      setStore(prev => ({ ...prev, [schemaId]: initialData }));
      return initialData;
    }
    return store[schemaId];
  };

  const getData = (schemaId: string): TableData[] => {
    if (!store[schemaId]) {
      return initializeSchemaData(schemaId);
    }
    return store[schemaId];
  };

  const setData = (schemaId: string, data: TableData[]) => {
    setStore(prev => ({ ...prev, [schemaId]: data }));
    // Save to localStorage
    localStorage.setItem(`dynamicTableData_${schemaId}`, JSON.stringify(data));
  };

  const updateData = (schemaId: string, updater: (data: TableData[]) => TableData[]) => {
    const currentData = getData(schemaId);
    const newData = updater(currentData);
    setData(schemaId, newData);
  };

  return (
    <DynamicDataStoreContext.Provider value={{ getData, setData, updateData }}>
      {children}
    </DynamicDataStoreContext.Provider>
  );
}

export function useDynamicDataStore() {
  const context = useContext(DynamicDataStoreContext);
  if (!context) {
    throw new Error('useDynamicDataStore must be used within DynamicDataStoreProvider');
  }
  return context;
}
