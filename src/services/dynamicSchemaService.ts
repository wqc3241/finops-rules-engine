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
      'gateway': 'gateways',
      'dealer': 'dealers',
      'lender': 'lenders',
      'country': 'countries',
      'state': 'states',
      'location-geo': 'geo_location',
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
      'gateway': 'Gateway',
      'dealer': 'Dealer',
      'lender': 'Lender',
      'country': 'Country',
      'state': 'State',
      'location-geo': 'Location Geo',
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

  // Get primary key columns for a table (fallback approach)
  private getPrimaryKeys(tableName: string): string[] {
    // Use known primary keys for each table
    const primaryKeyMap: Record<string, string[]> = {
      'credit_profiles': ['profile_id'],
      'pricing_configs': ['pricing_rule_id'],
      'financial_products': ['product_id'],
      'bulletin_pricing': ['bulletin_id'],
      'fee_rules': ['_id'],
      'lenders': ['Gateway lender ID'],
      'geo_location': ['Geo Code']
    };
    
    return primaryKeyMap[tableName] || ['id'];
  }

  // Create fallback schema when no data is available
  private createFallbackSchema(schemaId: string, tableName: string): DynamicTableSchema {
    const primaryKeys = this.getPrimaryKeys(tableName);
    
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
        return this.createFallbackSchema(schemaId, tableName);
      }

      // Get primary keys
      const primaryKeys = this.getPrimaryKeys(tableName);

      // Convert columns to ColumnDefinition format based on sample data
      const sampleRow = sampleData[0];
      const columnDefinitions: ColumnDefinition[] = Object.keys(sampleRow).map((columnName) => {
        const value = sampleRow[columnName];
        const isPrimaryKey = primaryKeys.includes(columnName);
        const dataType = this.inferDataType(value);
        const isEditable = this.isColumnEditable(columnName, dataType, true, null);
        
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
      'gateway',
      'dealer',
      'lender',
      'country',
      'state',
      'location-geo',
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