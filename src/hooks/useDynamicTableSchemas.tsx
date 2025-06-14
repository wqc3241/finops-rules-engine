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
      { id: 'id', name: 'Bulletin ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'financialProgramCode', name: 'Financial Program Code', key: 'financialProgramCode', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'programId', name: 'Program Id', key: 'programId', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'pricingConfig', name: 'Pricing Config', key: 'pricingConfig', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'geoCode', name: 'Geo Code', key: 'geoCode', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'lenderName', name: 'Lender Name', key: 'lenderName', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'advertised', name: 'Advertised', key: 'advertised', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'pricingType', name: 'Pricing Type', key: 'pricingType', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
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
  },
  'pricing-rules': {
    id: 'pricing-rules',
    name: 'Pricing Rules',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'financialProgram', name: 'Financial Program', key: 'financialProgram', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'pricingConfig', name: 'Pricing Config', key: 'pricingConfig', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'pricingType', name: 'Pricing Type', key: 'pricingType', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'advertised', name: 'Advertised', key: 'advertised', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'pricingValue', name: 'Pricing Value', key: 'pricingValue', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'lenderList', name: 'Lender List', key: 'lenderList', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'geoCode', name: 'Geo Code', key: 'geoCode', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true }
    ]
  },
  'credit-profile': {
    id: 'credit-profile',
    name: 'Credit Profile',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'priority', name: 'Priority', key: 'priority', type: 'number', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'minCreditScore', name: 'Min Credit Score', key: 'minCreditScore', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'maxCreditScore', name: 'Max Credit Score', key: 'maxCreditScore', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'minIncome', name: 'Min Income', key: 'minIncome', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'maxIncome', name: 'Max Income', key: 'maxIncome', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'minAge', name: 'Min Age', key: 'minAge', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'maxAge', name: 'Max Age', key: 'maxAge', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'minPTI', name: 'Min PTI', key: 'minPTI', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'maxPTI', name: 'Max PTI', key: 'maxPTI', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'minDTI', name: 'Min DTI', key: 'minDTI', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'maxDTI', name: 'Max DTI', key: 'maxDTI', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'employmentType', name: 'Employment Type', key: 'employmentType', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true }
    ]
  },
  'pricing-config': {
    id: 'pricing-config',
    name: 'Pricing Config',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'minLTV', name: 'Min LTV', key: 'minLTV', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'maxLTV', name: 'Max LTV', key: 'maxLTV', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'minTerm', name: 'Min Term', key: 'minTerm', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'maxTerm', name: 'Max Term', key: 'maxTerm', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'minLeaseMileage', name: 'Min Lease Mileage', key: 'minLeaseMileage', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'maxLeaseMileage', name: 'Max Lease Mileage', key: 'maxLeaseMileage', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'priority', name: 'Priority', key: 'priority', type: 'number', inputType: 'Input', isRequired: true, sortable: true, editable: true }
    ]
  },
  'financial-program-config': {
    id: 'financial-program-config',
    name: 'Financial Program Config',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'programCode', name: 'Program Code', key: 'programCode', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'cloneFrom', name: 'Clone From', key: 'cloneFrom', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'priority', name: 'Priority', key: 'priority', type: 'number', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'financialProductId', name: 'Financial Product ID', key: 'financialProductId', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'productType', name: 'Product Type', key: 'productType', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'vehicleStyleId', name: 'Vehicle Style ID', key: 'vehicleStyleId', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'financingVehicleCondition', name: 'Financing Vehicle Condition', key: 'financingVehicleCondition', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'programStartDate', name: 'Program Start Date', key: 'programStartDate', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'programEndDate', name: 'Program End Date', key: 'programEndDate', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'isActive', name: 'Active', key: 'isActive', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'orderTypes', name: 'Order Types', key: 'orderTypes', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'version', name: 'Version', key: 'version', type: 'number', inputType: 'Input', isRequired: true, sortable: true, editable: true }
    ]
  },
  'advertised-offers': {
    id: 'advertised-offers',
    name: 'Advertised Offers',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'bulletinPricing', name: 'Bulletin Pricing', key: 'bulletinPricing', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'disclosure', name: 'Disclosure', key: 'disclosure', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'loanAmountPer10k', name: 'Loan Amount Per 10K', key: 'loanAmountPer10k', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'totalCostOfCredit', name: 'Total Cost of Credit', key: 'totalCostOfCredit', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true }
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
        // Ensure bulletin-pricing uses the latest column structure from DEFAULT_SCHEMAS
        // This helps override potentially outdated structures from localStorage.
        if (parsedSchemas['bulletin-pricing']) {
            parsedSchemas['bulletin-pricing'].columns = DEFAULT_SCHEMAS['bulletin-pricing'].columns;
        }
        setSchemas({ ...DEFAULT_SCHEMAS, ...parsedSchemas });
      } catch (error) {
        console.error('Failed to parse saved schemas:', error);
        setSchemas(DEFAULT_SCHEMAS); // Fallback to defaults if parsing fails
      }
    } else {
      setSchemas(DEFAULT_SCHEMAS); // Initialize with defaults if nothing is saved
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
