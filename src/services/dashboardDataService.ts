import { supabase } from '@/integrations/supabase/client';
import { DataSourceConfig, Filter, Aggregation } from '@/types/dashboard';

export class DashboardDataService {
  async fetchData(config: DataSourceConfig | null): Promise<any[]> {
    if (!config || config.type === 'legacy' || !config.tableName) {
      return [];
    }

    try {
      const selectClause = this.buildSelectClause(config);
      let query = (supabase as any)
        .from(config.tableName)
        .select(selectClause);

      // Apply filters
      config.filters?.forEach(filter => {
        query = this.applyFilter(query, filter);
      });

      // Apply ordering
      if (config.orderBy) {
        query = query.order(config.orderBy.column, { 
          ascending: config.orderBy.direction === 'asc' 
        });
      }

      // Apply limit
      if (config.limit) {
        query = query.limit(config.limit);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // If groupBy exists, perform aggregation in memory
      if (config.groupBy && config.aggregations) {
        return this.performAggregation(data || [], config);
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      return [];
    }
  }

  private buildSelectClause(config: DataSourceConfig): string {
    if (!config.columns || config.columns.length === 0) {
      return '*';
    }
    return config.columns.join(',');
  }

  private applyFilter(query: any, filter: Filter) {
    switch (filter.operator) {
      case 'equals':
        return query.eq(filter.column, filter.value);
      case 'not_equals':
        return query.neq(filter.column, filter.value);
      case 'greater_than':
        return query.gt(filter.column, filter.value);
      case 'less_than':
        return query.lt(filter.column, filter.value);
      case 'contains':
        return query.ilike(filter.column, `%${filter.value}%`);
      case 'in':
        return query.in(filter.column, Array.isArray(filter.value) ? filter.value : [filter.value]);
      case 'not_in':
        return query.not(filter.column, 'in', `(${Array.isArray(filter.value) ? filter.value.join(',') : filter.value})`);
      default:
        return query;
    }
  }

  private performAggregation(data: any[], config: DataSourceConfig) {
    if (!config.groupBy) return data;

    // Group data by the groupBy column
    const grouped = data.reduce((acc, row) => {
      const key = row[config.groupBy!] || 'null';
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {} as Record<string, any[]>);

    // Calculate aggregations for each group
    return Object.entries(grouped).map(([key, rows]: [string, any[]]) => {
      const result: any = { [config.groupBy!]: key };
      
      config.aggregations?.forEach(agg => {
        const columnValues = rows.map(r => r[agg.column]).filter(v => v != null);
        const aggKey = agg.alias || `${agg.column}_${agg.function}`;
        result[aggKey] = this.calculateAggregation(columnValues, agg.function);
      });

      return result;
    });
  }

  private calculateAggregation(values: any[], func: string): number {
    if (values.length === 0) return 0;
    
    const numbers = values.filter(v => typeof v === 'number' || !isNaN(Number(v))).map(Number);
    
    switch (func) {
      case 'sum':
        return numbers.reduce((a, b) => a + b, 0);
      case 'avg':
        return numbers.length > 0 ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0;
      case 'count':
        return values.length;
      case 'min':
        return numbers.length > 0 ? Math.min(...numbers) : 0;
      case 'max':
        return numbers.length > 0 ? Math.max(...numbers) : 0;
      case 'distinct':
        return new Set(values).size;
      default:
        return 0;
    }
  }
}

export const dashboardDataService = new DashboardDataService();
