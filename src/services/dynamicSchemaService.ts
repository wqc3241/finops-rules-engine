import { supabase } from "@/integrations/supabase/client";
import { DynamicTableSchema, ColumnDefinition } from "@/types/dynamicTable";

class DynamicSchemaService {
  private schemaCache = new Map<string, DynamicTableSchema>();
  
  // Map schema IDs to actual database table names
  private getActualTableName = (schemaId: string): string => {
    const tableMap: Record<string, string> = {
      'bulletin-pricing': 'bulletin_pricing',
      'pricing-types': 'pricing_types',
      'financial-products': 'financial_products',
      'credit-profile': 'credit_profiles',
      'pricing-config': 'pricing_configs',
      'financial-program-config': 'financial_program_configs',
      'advertised-offers': 'advertised_offers',
      'fee-rules': 'fee_rules',
      'tax-rules': 'tax_rules',
      'discount-rules': 'discount_rules',
      'gateway': 'gateways',
      'dealer': 'dealers',
      'lender': 'lenders',
      'country': 'countries',
      'state': 'states',
      'geo-location': 'geo_location',
      'lease-config': 'lease_configs',
      'vehicle-condition': 'vehicle_conditions',
      'vehicle-options': 'vehicle_options',
      'routing-rule': 'routing_rules',
      'stipulation': 'stipulations',
      'vehicle-style-coding': 'vehicle_style_coding',
      'order-type': 'order_types'
    };
    
    return tableMap[schemaId] || schemaId;
  };

  // Get schema display name
  private getSchemaDisplayName = (schemaId: string): string => {
    const nameMap: Record<string, string> = {
      'bulletin-pricing': 'Bulletin Pricing',
      'pricing-types': 'Pricing Types',
      'financial-products': 'Financial Products',
      'credit-profile': 'Credit Profile',
      'pricing-config': 'Pricing Config',
      'financial-program-config': 'Financial Program Config',
      'advertised-offers': 'Advertised Offers',
      'fee-rules': 'Fee Rules',
      'tax-rules': 'Tax Rules',
      'discount-rules': 'Discount Rules',
      'gateway': 'Gateway',
      'dealer': 'Dealer',
      'lender': 'Lender',
      'country': 'Country',
      'state': 'State',
      'geo-location': 'Geo Location',
      'lease-config': 'Lease Config',
      'vehicle-condition': 'Vehicle Condition',
      'vehicle-options': 'Vehicle Options',
      'routing-rule': 'Routing Rule',
      'stipulation': 'Stipulation',
      'vehicle-style-coding': 'Vehicle Style Coding',
      'order-type': 'Order Type'
    };
    
    return nameMap[schemaId] || schemaId;
  };

  // Convert snake_case to Title Case
  private formatColumnName = (columnName: string): string => {
    return columnName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Infer data type from value
  private inferDataType = (value: any): 'string' | 'number' | 'boolean' => {
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    return 'string';
  };

  // Check if column should be editable
  private isColumnEditable = (columnName: string, dataType: string, isNullable: boolean, columnDefault: string | null): boolean => {
    // Primary key columns are not editable
    if (columnName === 'id' || columnName.endsWith('_id')) return false;
    
    // Timestamp columns are usually not editable
    if (columnName === 'created_at' || columnName === 'updated_at') return false;
    
    return true;
  };

  // Get primary key columns dynamically from database schema
  private async getPrimaryKeys(tableName: string): Promise<string[]> {
    try {
      // Query information_schema to get actual primary keys
      const { data, error } = await supabase.rpc('get_primary_keys', { 
        table_name_param: tableName 
      }) as { data: Array<{ column_name: string }> | null, error: any };

      if (error) {
        console.warn(`Failed to get primary keys for ${tableName}, using fallback:`, error);
        return this.getFallbackPrimaryKeys(tableName);
      }

      if (data && data.length > 0) {
        return data.map((row) => row.column_name);
      }

      return this.getFallbackPrimaryKeys(tableName);
    } catch (error) {
      console.warn(`Error getting primary keys for ${tableName}:`, error);
      return this.getFallbackPrimaryKeys(tableName);
    }
  }

  // Fallback primary key detection for when database query fails
  private getFallbackPrimaryKeys(tableName: string): string[] {
    const fallbackMap: Record<string, string[]> = {
      'credit_profiles': ['profile_id'],
      'pricing_configs': ['pricing_rule_id'],
      'financial_products': ['product_id'],
      'bulletin_pricing': ['bulletin_id'],
      'fee_rules': ['_id'],
      'discount_rules': ['id'],
      'geo_location': ['geo_code'],
    };
    
    return fallbackMap[tableName] || ['id'];
  }

  // Create fallback schema when no data is available
  private async createFallbackSchema(schemaId: string, tableName: string): Promise<DynamicTableSchema> {
    const primaryKeys = await this.getPrimaryKeys(tableName);
    
    // Basic fallback columns
    const columns: ColumnDefinition[] = [
      {
        id: primaryKeys[0],
        name: this.formatColumnName(primaryKeys[0]),
        key: primaryKeys[0],
        type: 'string',
        inputType: 'Output',
        isRequired: true,
        sortable: true,
        editable: false
      }
    ];

    return {
      id: schemaId,
      name: this.getSchemaDisplayName(schemaId),
      columns
    };
  }

  // Get ordering column for a table (fallback for tables without timestamps)
  private async getOrderingColumn(tableName: string): Promise<string> {
    // First try to find a timestamp column
    const timestampColumns = ['created_at', 'updated_at', 'updated_date'];
    
    try {
      // Get column information from the database
      const { data: columnData, error } = await supabase.rpc('get_table_columns', { 
        table_name_param: tableName 
      }) as { data: Array<{ column_name: string, data_type: string, is_nullable: string, column_default: string }> | null, error: any };

      if (!error && columnData) {
        // Look for timestamp columns first
        for (const tsCol of timestampColumns) {
          if (columnData.some((col) => col.column_name === tsCol)) {
            return tsCol;
          }
        }
        
        // If no timestamp columns, use primary key
        const primaryKeys = await this.getPrimaryKeys(tableName);
        if (primaryKeys.length > 0) {
          return primaryKeys[0];
        }
        
        // If no primary key, use first column
        if (columnData.length > 0) {
          return columnData[0].column_name;
        }
      }
    } catch (error) {
      console.warn(`Failed to get ordering column for ${tableName}:`, error);
    }

    // Ultimate fallback
    return 'id';
  }

  // Generate schema from database
  async generateSchemaFromDatabase(schemaId: string): Promise<DynamicTableSchema | null> {
    try {
      const tableName = this.getActualTableName(schemaId);
      
      // Get a sample row to determine column structure
      const { data: sampleData, error: sampleError } = await supabase
        .from(tableName as any)
        .select('*')
        .limit(1);

      if (sampleError) {
        console.error('Error fetching sample data:', sampleError);
        return null;
      }

      // If no data, create fallback schema
      if (!sampleData || sampleData.length === 0) {
        console.warn(`No data found for table: ${tableName}, using fallback schema`);
        return await this.createFallbackSchema(schemaId, tableName);
      }

      // Get primary keys dynamically
      const primaryKeys = await this.getPrimaryKeys(tableName);

      // Convert columns to ColumnDefinition format based on sample data
      const sampleRow = sampleData[0];
      const columnDefinitions: ColumnDefinition[] = Object.keys(sampleRow).map((columnName) => {
        const value = sampleRow[columnName];
        const isPrimaryKey = primaryKeys.includes(columnName);
        const dataType = this.inferDataType(value);
        const isEditable = this.isColumnEditable(columnName, dataType, true, null) && !isPrimaryKey;
        
        return {
          id: columnName,
          name: this.formatColumnName(columnName),
          key: columnName,
          type: dataType,
          inputType: isPrimaryKey || !isEditable ? 'Output' : 'Input',
          isRequired: isPrimaryKey && isEditable,
          sortable: true,
          editable: isEditable
        };
      });

      // Sort columns: primary keys first, then editable columns, then read-only
      columnDefinitions.sort((a, b) => {
        if (a.inputType === 'Output' && b.inputType === 'Input') return -1;
        if (a.inputType === 'Input' && b.inputType === 'Output') return 1;
        if (a.editable && !b.editable) return 1;
        if (!a.editable && b.editable) return -1;
        return a.name.localeCompare(b.name);
      });

      const schema: DynamicTableSchema = {
        id: schemaId,
        name: this.getSchemaDisplayName(schemaId),
        columns: columnDefinitions
      };

      // Cache the schema
      this.schemaCache.set(schemaId, schema);
      
      console.log(`Generated schema for ${schemaId}:`, schema);
      return schema;

    } catch (error) {
      console.error(`Error generating schema for ${schemaId}:`, error);
      return null;
    }
  }

  // Get schema (from cache or generate)
  async getSchema(schemaId: string): Promise<DynamicTableSchema | null> {
    // Check cache first
    if (this.schemaCache.has(schemaId)) {
      return this.schemaCache.get(schemaId)!;
    }

    // Generate from database
    return await this.generateSchemaFromDatabase(schemaId);
  }

  // Clear cache for a specific schema
  clearSchemaCache(schemaId: string): void {
    this.schemaCache.delete(schemaId);
  }

  // Clear all cache
  clearAllCache(): void {
    this.schemaCache.clear();
  }

  // Get all available schema IDs
  getAvailableSchemaIds(): string[] {
    return [
      'bulletin-pricing',
      'pricing-types', 
      'financial-products',
      'credit-profile',
      'pricing-config',
      'financial-program-config',
      'advertised-offers',
      'fee-rules',
      'tax-rules',
      'discount-rules',
      'gateway',
      'dealer',
      'lender',
      'country',
      'state',
      'geo-location',
      'lease-config',
      'vehicle-condition',
      'vehicle-options',
      'routing-rule',
      'stipulation',
      'vehicle-style-coding',
      'order-type'
    ];
  }
}

export const dynamicSchemaService = new DynamicSchemaService();