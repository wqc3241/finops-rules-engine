export interface DataSourceConfig {
  type: 'supabase_table' | 'custom_query' | 'ai_report' | 'legacy';
  tableName?: string;
  columns?: string[];
  filters?: Filter[];
  groupBy?: string;
  aggregations?: Aggregation[];
  orderBy?: { column: string; direction: 'asc' | 'desc' };
  limit?: number;
  value?: string; // For legacy support
}

export interface Filter {
  column: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'not_in';
  value: any;
}

export interface Aggregation {
  column: string;
  function: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'distinct';
  alias?: string;
}

export interface VisualizationConfig {
  chartType?: 'bar' | 'line' | 'area' | 'pie' | 'donut';
  xAxis?: string;
  yAxis?: string | string[];
  colors?: string[];
  legend?: boolean;
  tooltip?: boolean;
  grid?: { horizontal?: boolean; vertical?: boolean };
  stacked?: boolean;
  columns?: string[];
  sortable?: boolean;
}

export interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
}
