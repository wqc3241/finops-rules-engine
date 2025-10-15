export interface ForeignKeyRelation {
  sourceColumn: string;
  foreignTable: string;
  foreignColumn: string;
}

export interface ReportFilter {
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'is' | 'in';
  value: any;
  // For foreign key filters
  isForeignKey?: boolean;
  foreignTable?: string;
  foreignColumn?: string;
}

export interface ReportConfig {
  sourceTable: string;
  selectedColumns: string[];
  filters: ReportFilter[];
  orderBy?: { column: string; direction: 'asc' | 'desc' };
  limit?: number;
}
