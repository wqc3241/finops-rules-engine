
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DynamicTableSchema, ColumnDefinition } from '@/types/dynamicTable';

interface DynamicTableSchemasContextType {
  schemas: Record<string, DynamicTableSchema>;
  updateSchema: (id: string, schema: DynamicTableSchema) => void;
  getSchema: (id: string) => DynamicTableSchema | undefined;
  addColumn: (schemaId: string, column: ColumnDefinition) => void;
  removeColumn: (schemaId: string, columnId: string) => void;
  updateColumn: (schemaId: string, columnId: string, updates: Partial<ColumnDefinition>) => void;
}

const DynamicTableSchemasContext = createContext<DynamicTableSchemasContextType | undefined>(undefined);

const DEFAULT_SCHEMAS: Record<string, DynamicTableSchema> = {
  'bulletin-pricing': {
    id: 'bulletin-pricing',
    name: 'Bulletin Pricing',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'financialProgramCode', name: 'Financial Program Code', key: 'financialProgramCode', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'programId', name: 'Program Id', key: 'programId', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'pricingConfig', name: 'Pricing Config', key: 'pricingConfig', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'geoCode', name: 'Geo Code', key: 'geoCode', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'lenderName', name: 'Lender Name', key: 'lenderName', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'advertised', name: 'Advertised', key: 'advertised', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'pricingType', name: 'Pricing Type', key: 'pricingType', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'bulletinId', name: 'Bulletin ID', key: 'bulletinId', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'pricingValue', name: 'Pricing Value', key: 'pricingValue', type: 'number', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'uploadDate', name: 'Upload Date', key: 'uploadDate', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false }
    ]
  },
  'pricing-types': {
    id: 'pricing-types',
    name: 'Pricing Types',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'typeCode', name: 'Type Code', key: 'typeCode', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'typeName', name: 'Type Name', key: 'typeName', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true }
    ]
  },
  'financial-products': {
    id: 'financial-products',
    name: 'Financial Products',
    columns: [
      { id: 'id', name: 'Product ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'productType', name: 'Product Type', key: 'productType', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'productSubtype', name: 'Product Subtype', key: 'productSubtype', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'geoCode', name: 'Geo Code', key: 'geoCode', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'category', name: 'Category', key: 'category', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'isActive', name: 'Status', key: 'isActive', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true }
    ]
  }
};

export function DynamicTableSchemasProvider({ children }: { children: ReactNode }) {
  const [schemas, setSchemas] = useState<Record<string, DynamicTableSchema>>(DEFAULT_SCHEMAS);

  useEffect(() => {
    const saved = localStorage.getItem('dynamicTableSchemas');
    if (saved) {
      try {
        const parsedSchemas = JSON.parse(saved);
        setSchemas({ ...DEFAULT_SCHEMAS, ...parsedSchemas });
      } catch (error) {
        console.error('Failed to parse saved schemas:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dynamicTableSchemas', JSON.stringify(schemas));
  }, [schemas]);

  const updateSchema = (id: string, schema: DynamicTableSchema) => {
    setSchemas(prev => ({ ...prev, [id]: schema }));
  };

  const getSchema = (id: string) => schemas[id];

  const addColumn = (schemaId: string, column: ColumnDefinition) => {
    setSchemas(prev => {
      const schema = prev[schemaId];
      if (!schema) return prev;
      
      return {
        ...prev,
        [schemaId]: {
          ...schema,
          columns: [...schema.columns, column]
        }
      };
    });
  };

  const removeColumn = (schemaId: string, columnId: string) => {
    setSchemas(prev => {
      const schema = prev[schemaId];
      if (!schema) return prev;
      
      return {
        ...prev,
        [schemaId]: {
          ...schema,
          columns: schema.columns.filter(col => col.id !== columnId)
        }
      };
    });
  };

  const updateColumn = (schemaId: string, columnId: string, updates: Partial<ColumnDefinition>) => {
    setSchemas(prev => {
      const schema = prev[schemaId];
      if (!schema) return prev;
      
      return {
        ...prev,
        [schemaId]: {
          ...schema,
          columns: schema.columns.map(col => 
            col.id === columnId ? { ...col, ...updates } : col
          )
        }
      };
    });
  };

  return (
    <DynamicTableSchemasContext.Provider 
      value={{ schemas, updateSchema, getSchema, addColumn, removeColumn, updateColumn }}
    >
      {children}
    </DynamicTableSchemasContext.Provider>
  );
}

export function useDynamicTableSchemas() {
  const context = useContext(DynamicTableSchemasContext);
  if (!context) {
    throw new Error('useDynamicTableSchemas must be used within DynamicTableSchemasProvider');
  }
  return context;
}
