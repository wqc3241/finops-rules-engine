
export interface ColumnDefinition {
  id: string;
  name: string;
  key: string;
  type: 'string' | 'boolean' | 'number';
  inputType: 'Input' | 'Output';
  isRequired: boolean;
  sortable: boolean;
  editable: boolean;
  width?: number;
}

export interface DynamicTableSchema {
  id: string;
  name: string;
  columns: ColumnDefinition[];
}

export interface TableData {
  [key: string]: any;
}

export interface DynamicTableProps {
  schema: DynamicTableSchema;
  data: TableData[];
  onDataChange: (data: TableData[]) => void;
  onSchemaChange: (schema: DynamicTableSchema) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  selectedItems?: string[];
  allowColumnManagement?: boolean;
}
