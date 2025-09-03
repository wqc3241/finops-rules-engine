import { createContext, useContext, ReactNode } from 'react';
import { DynamicTableSchema, ColumnDefinition } from '@/types/dynamicTable';
import { useDynamicSchemas } from './useDynamicSchemas';

interface DynamicTableSchemasContextType {
  schemas: Record<string, DynamicTableSchema>;
  updateSchema: (id: string, schema: DynamicTableSchema) => void;
  getSchema: (id: string) => Promise<DynamicTableSchema | undefined>;
  getSyncSchema: (id: string) => DynamicTableSchema | undefined;
  addColumn: (schemaId: string, column: ColumnDefinition) => void;
  removeColumn: (schemaId: string, columnId: string) => void;
  updateColumn: (schemaId: string, columnId: string, updates: Partial<ColumnDefinition>) => void;
  refreshSchema: (schemaId: string) => Promise<void>;
  loading: boolean;
}

const DynamicTableSchemasContext = createContext<DynamicTableSchemasContextType | undefined>(undefined);

interface DynamicTableSchemasProviderProps {
  children: ReactNode;
}

export const DynamicTableSchemasProvider = ({ children }: DynamicTableSchemasProviderProps) => {
  const dynamicSchemas = useDynamicSchemas();

  return (
    <DynamicTableSchemasContext.Provider value={dynamicSchemas}>
      {children}
    </DynamicTableSchemasContext.Provider>
  );
};

export const useDynamicTableSchemas = () => {
  const context = useContext(DynamicTableSchemasContext);
  if (!context) {
    throw new Error('useDynamicTableSchemas must be used within DynamicTableSchemasProvider');
  }
  return context;
};