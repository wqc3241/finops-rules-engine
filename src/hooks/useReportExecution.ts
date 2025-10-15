import { supabase } from '@/integrations/supabase/client';
import { ReportConfig, ReportFilter, ForeignKeyRelation } from '@/types/report';

export const useReportExecution = () => {
  const buildSelectClause = (columns: string[], foreignKeys: ForeignKeyRelation[]): string => {
    const directColumns: string[] = [];
    const fkSelects: Record<string, string[]> = {};

    columns.forEach(col => {
      if (col.includes('.')) {
        const [fkColumn, targetColumn] = col.split('.');
        if (!fkSelects[fkColumn]) {
          fkSelects[fkColumn] = [];
        }
        fkSelects[fkColumn].push(targetColumn);
      } else {
        directColumns.push(col);
      }
    });

    let selectClause = directColumns.join(', ');

    Object.entries(fkSelects).forEach(([fkColumn, targetColumns]) => {
      const fkRelation = foreignKeys.find(fk => fk.sourceColumn === fkColumn);
      if (fkRelation) {
        const fkSelect = `${fkRelation.foreignTable}(${targetColumns.join(', ')})`;
        selectClause += selectClause ? `, ${fkSelect}` : fkSelect;
      }
    });

    return selectClause || '*';
  };

  const applyFilter = (query: any, filter: ReportFilter) => {
    const { column, operator, value, isForeignKey, foreignTable, foreignColumn } = filter;
    
    const filterColumn = isForeignKey && foreignTable && foreignColumn 
      ? `${foreignTable}.${foreignColumn}` 
      : column;

    switch (operator) {
      case 'eq':
        return query.eq(filterColumn, value);
      case 'neq':
        return query.neq(filterColumn, value);
      case 'gt':
        return query.gt(filterColumn, value);
      case 'gte':
        return query.gte(filterColumn, value);
      case 'lt':
        return query.lt(filterColumn, value);
      case 'lte':
        return query.lte(filterColumn, value);
      case 'like':
        return query.like(filterColumn, `%${value}%`);
      case 'ilike':
        return query.ilike(filterColumn, `%${value}%`);
      case 'is':
        return query.is(filterColumn, value);
      case 'in':
        return query.in(filterColumn, Array.isArray(value) ? value : [value]);
      default:
        return query;
    }
  };

  const executeReport = async (config: ReportConfig, foreignKeys: ForeignKeyRelation[] = []) => {
    const selectClause = buildSelectClause(config.selectedColumns, foreignKeys);
    
    // Use dynamic typing for flexibility with runtime table names
    // @ts-ignore - Dynamic table names require runtime flexibility
    let query = supabase.from(config.sourceTable).select(selectClause);
    
    // Apply filters
    config.filters.forEach(filter => {
      query = applyFilter(query, filter);
    });
    
    // Apply ordering
    if (config.orderBy) {
      query = query.order(config.orderBy.column, { 
        ascending: config.orderBy.direction === 'asc' 
      });
    }
    
    // Apply limit
    const limit = config.limit || 100;
    query = query.limit(limit);
    
    const { data, error } = await query;
    if (error) throw error;
    
    return data;
  };

  return { executeReport };
};
