import { useState, useEffect, useCallback } from 'react';
import { DynamicTableSchema, ColumnDefinition } from '@/types/dynamicTable';
import { dynamicSchemaService } from '@/services/dynamicSchemaService';

interface UseDynamicSchemasReturn {
  schemas: Record<string, DynamicTableSchema>;
  getSchema: (id: string) => Promise<DynamicTableSchema | undefined>;
  getSyncSchema: (id: string) => DynamicTableSchema | undefined;
  updateSchema: (id: string, schema: DynamicTableSchema) => void;
  addColumn: (schemaId: string, column: ColumnDefinition) => void;
  removeColumn: (schemaId: string, columnId: string) => void;
  updateColumn: (schemaId: string, columnId: string, updates: Partial<ColumnDefinition>) => void;
  refreshSchema: (schemaId: string) => Promise<void>;
  loading: boolean;
}

export const useDynamicSchemas = (): UseDynamicSchemasReturn => {
  const [schemas, setSchemas] = useState<Record<string, DynamicTableSchema>>({});
  const [loading, setLoading] = useState(false);

  // Get schema (load from database if not cached)
  const getSchema = useCallback(async (id: string): Promise<DynamicTableSchema | undefined> => {
    if (schemas[id]) {
      return schemas[id];
    }

    setLoading(true);
    try {
      const schema = await dynamicSchemaService.getSchema(id);
      if (schema) {
        setSchemas(prev => ({ ...prev, [id]: schema }));
        return schema;
      }
    } catch (error) {
      console.error(`Error loading schema ${id}:`, error);
    } finally {
      setLoading(false);
    }
    
    return undefined;
  }, [schemas]);

  // Update schema in memory and cache
  const updateSchema = useCallback((id: string, schema: DynamicTableSchema) => {
    setSchemas(prev => ({ ...prev, [id]: schema }));
  }, []);

  // Add column to schema
  const addColumn = useCallback((schemaId: string, column: ColumnDefinition) => {
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
  }, []);

  // Remove column from schema
  const removeColumn = useCallback((schemaId: string, columnId: string) => {
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
  }, []);

  // Update column in schema
  const updateColumn = useCallback((schemaId: string, columnId: string, updates: Partial<ColumnDefinition>) => {
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
  }, []);

  // Refresh schema from database
  const refreshSchema = useCallback(async (schemaId: string) => {
    setLoading(true);
    try {
      // Clear cache and reload
      dynamicSchemaService.clearSchemaCache(schemaId);
      // Also remove from local state to force fresh load
      setSchemas(prev => {
        const newSchemas = { ...prev };
        delete newSchemas[schemaId];
        return newSchemas;
      });
      const schema = await dynamicSchemaService.getSchema(schemaId);
      if (schema) {
        setSchemas(prev => ({ ...prev, [schemaId]: schema }));
      }
    } catch (error) {
      console.error(`Error refreshing schema ${schemaId}:`, error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Synchronous get schema (returns from cache only)
  const getSyncSchema = useCallback((id: string): DynamicTableSchema | undefined => {
    return schemas[id];
  }, [schemas]);

  return {
    schemas,
    getSchema,
    getSyncSchema,
    updateSchema,
    addColumn,
    removeColumn,
    updateColumn,
    refreshSchema,
    loading
  };
};