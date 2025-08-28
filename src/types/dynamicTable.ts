
export interface ColumnDefinition {
  id: string;
  name: string;
  key: string;
  type: 'string' | 'boolean' | 'number';
  inputType: 'Input' | 'Output';
  isRequired: boolean;
  sortable: boolean;
  filterable?: boolean; // NEW: allow filtering on column
  editable: boolean;
  width?: number;
  // New fields for table dependencies
  sourceTable?: string;
  sourceColumn?: string;
  isForeignKey?: boolean;          // <--- NEW: indicate FK column
  displayColumn?: string;          // <--- NEW: display field for FK relation
  isMultiSelect?: boolean;         // <--- NEW: indicate multi-select column
  isArray?: boolean;               // <--- NEW: indicate array type column
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
  onEditRow?: (rowId: string, rowData: TableData) => void;
  // New: persist single-cell edits
  onSaveCell?: (rowId: string, columnKey: string, value: any) => Promise<void> | void;
  // Pagination props
  totalCount?: number;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number, pageSize: number) => void;
}
