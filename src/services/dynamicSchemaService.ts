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

  // Check if a field is a multi-select field
  private isMultiSelectField = (tableName: string, columnName: string, value: any): boolean => {
    // Known multi-select fields
    if (tableName === 'pricing_types' && columnName === 'financial_products_list') return true;
    
    // Check if it's an array
    if (Array.isArray(value)) return true;
    
    return false;
  };

  // Get source table for a field
  private getSourceTableForField = (tableName: string, columnName: string): string | undefined => {
    // Known relationships
    if (tableName === 'pricing_types' && columnName === 'financial_products_list') {
      return 'financial-products';
    }
    
    return undefined;
  };

  // Get display column for a table
  private getDisplayColumnForTable = (sourceTable: string): string | undefined => {
    const displayMap: Record<string, string> = {
      'financial-products': 'productType',
      'lender': 'lenderName',
    };
    
    return displayMap[sourceTable] || 'id';
  };

  // Get custom column information for special cases
  private getCustomColumnInfo = (schemaId: string, columnName: string): { name?: string; type?: 'string' | 'number' | 'boolean'; sortable?: boolean; filterable?: boolean } => {
    // Custom formatting for discount-rules eligibility columns
    if (schemaId === 'discount-rules') {
      const discountRulesColumnMap: Record<string, { name?: string; type?: 'string' | 'number' | 'boolean'; sortable?: boolean; filterable?: boolean }> = {
        'inventory_scope': { 
          name: 'Inventory Scope', 
          type: 'string', 
          sortable: true, 
          filterable: true 
        },
        'purchase_types': { 
          name: 'Purchase Types', 
          type: 'string', 
          sortable: false, 
          filterable: true 
        },
        'markets_countries': { 
          name: 'Markets (Countries)', 
          type: 'string', 
          sortable: false, 
          filterable: true 
        },
        'markets_regions': { 
          name: 'Markets (Regions)', 
          type: 'string', 
          sortable: false, 
          filterable: true 
        },
        'markets_states': { 
          name: 'Markets (States)', 
          type: 'string', 
          sortable: false, 
          filterable: true 
        },
        'conditions_applies_to_all': { 
          name: 'Vehicle Conditions (All)', 
          type: 'boolean', 
          sortable: true, 
          filterable: true 
        },
        'conditions_values': { 
          name: 'Vehicle Conditions', 
          type: 'string', 
          sortable: false, 
          filterable: true 
        },
        'models_applies_to_all': { 
          name: 'Vehicle Models (All)', 
          type: 'boolean', 
          sortable: true, 
          filterable: true 
        },
        'models_values': { 
          name: 'Vehicle Models', 
          type: 'string', 
          sortable: false, 
          filterable: true 
        },
        'trims_applies_to_all': { 
          name: 'Vehicle Trims (All)', 
          type: 'boolean', 
          sortable: true, 
          filterable: true 
        },
        'trims_values': { 
          name: 'Vehicle Trims', 
          type: 'string', 
          sortable: false, 
          filterable: true 
        },
        'vehicle_year_applies_to_all': { 
          name: 'Vehicle Years (All)', 
          type: 'boolean', 
          sortable: true, 
          filterable: true 
        },
        'vehicle_year_values': { 
          name: 'Vehicle Years', 
          type: 'string', 
          sortable: false, 
          filterable: true 
        },
        'vin_list': { 
          name: 'VIN List', 
          type: 'string', 
          sortable: false, 
          filterable: true 
        },
        'config_filters': { 
          name: 'Configuration Filters', 
          type: 'string', 
          sortable: false, 
          filterable: false 
        },
        'priority': { 
          name: 'Priority', 
          type: 'number', 
          sortable: true, 
          filterable: true 
        }
      };
      
      return discountRulesColumnMap[columnName] || {};
    }
    
    return {};
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
      
      // Special debugging for problematic schemas
      const isProblematicSchema = ['credit-profile', 'pricing-config'].includes(schemaId);
      if (isProblematicSchema) {
        console.log(`🔍 Generating schema for problematic table: ${schemaId} -> ${tableName}`);
      }
      
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
      
      if (isProblematicSchema) {
        console.log(`🔑 Primary keys for ${tableName}:`, primaryKeys);
        console.log(`📋 Sample data keys:`, Object.keys(sampleData[0]));
      }

  // Convert columns to ColumnDefinition format based on sample data
      const sampleRow = sampleData[0];
      const columnDefinitions: ColumnDefinition[] = Object.keys(sampleRow)
        .filter(columnName => {
          // Hide template_metadata column for financial-program-config
          if (schemaId === 'financial-program-config' && columnName === 'template_metadata') {
            return false;
          }
          // Hide original eligibility JSON column for discount-rules (we show the normalized columns instead)
          if (schemaId === 'discount-rules' && columnName === 'eligibility') {
            return false;
          }
          return true;
        })
        .map((columnName) => {
        const value = sampleRow[columnName];
        const isPrimaryKey = primaryKeys.includes(columnName);
        const dataType = this.inferDataType(value);
        const isEditable = this.isColumnEditable(columnName, dataType, true, null) && !isPrimaryKey;
        
        // Detect multi-select fields and their dependencies
        const isArray = Array.isArray(value);
        const isMultiSelect = this.isMultiSelectField(tableName, columnName, value);
        const sourceTable = this.getSourceTableForField(tableName, columnName);
        
        // Get custom formatting for discount-rules eligibility columns
        const customColumnInfo = this.getCustomColumnInfo(schemaId, columnName);
        
        return {
          id: columnName,
          name: customColumnInfo.name || this.formatColumnName(columnName),
          key: columnName,
          type: customColumnInfo.type || dataType,
          inputType: isPrimaryKey || !isEditable ? 'Output' : 'Input',
          isRequired: isPrimaryKey && isEditable,
          sortable: customColumnInfo.sortable !== undefined ? customColumnInfo.sortable : true,
          filterable: customColumnInfo.filterable,
          editable: isEditable,
          isArray,
          isMultiSelect,
          sourceTable,
          displayColumn: sourceTable ? this.getDisplayColumnForTable(sourceTable) : undefined
        };
      });

      // Sort columns: Primary keys first, ID columns second, regular columns middle, timestamp columns last
      columnDefinitions.sort((a, b) => {
        const isPrimaryKeyA = primaryKeys.includes(a.key);
        const isPrimaryKeyB = primaryKeys.includes(b.key);
        const isIdA = a.key.toLowerCase().includes('id');
        const isIdB = b.key.toLowerCase().includes('id');
        const isTimestampA = ['created_at', 'updated_at', 'createdat', 'updatedat'].includes(a.key.toLowerCase());
        const isTimestampB = ['created_at', 'updated_at', 'createdat', 'updatedat'].includes(b.key.toLowerCase());
        
        // First tier: Primary key columns (highest priority)
        if (isPrimaryKeyA && !isPrimaryKeyB) return -1;
        if (!isPrimaryKeyA && isPrimaryKeyB) return 1;
        
        // Second tier: Other ID columns
        if (isIdA && !isIdB) return -1;
        if (!isIdA && isIdB) return 1;
        
        // Last tier: Timestamp columns
        if (isTimestampA && !isTimestampB) return 1;
        if (!isTimestampA && isTimestampB) return -1;
        
        // Within each tier, maintain existing sorting logic
        if (a.inputType === 'Output' && b.inputType === 'Input') return -1;
        if (a.inputType === 'Input' && b.inputType === 'Output') return 1;
        if (a.editable && !b.editable) return 1;
        if (!a.editable && b.editable) return -1;
        return a.name.localeCompare(b.name);
      });
      
      if (isProblematicSchema) {
        console.log(`📊 Final column order for ${tableName}:`, columnDefinitions.map(col => `${col.key} (${col.inputType})`));
      }

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
    // Force refresh for problematic schemas to ensure primary keys are included
    const problematicSchemas = ['credit-profile', 'pricing-config'];
    if (problematicSchemas.includes(schemaId)) {
      console.log(`🔄 Force refreshing schema for ${schemaId}`);
      this.clearSchemaCache(schemaId);
    }
    
    // Force refresh discount-rules to pick up new eligibility columns
    if (schemaId === 'discount-rules') {
      console.log(`🔄 Force refreshing discount-rules schema for new eligibility columns`);
      this.clearSchemaCache(schemaId);
    }
    
    // Check cache first
    if (this.schemaCache.has(schemaId)) {
      return this.schemaCache.get(schemaId)!;
    }

    // Generate from database
    return await this.generateSchemaFromDatabase(schemaId);
  }

  // Clear cache for a specific schema
  clearSchemaCache(schemaId: string): void {
    console.log(`🗑️ Clearing cache for schema: ${schemaId}`);
    this.schemaCache.delete(schemaId);
  }

  // Clear all cache
  clearAllCache(): void {
    console.log(`🗑️ Clearing all schema cache`);
    this.schemaCache.clear();
  }
  
  // Force refresh specific problematic schemas
  async forceRefreshProblematicSchemas(): Promise<void> {
    const problematicSchemas = ['credit-profile', 'pricing-config'];
    console.log(`🔄 Force refreshing problematic schemas:`, problematicSchemas);
    
    for (const schemaId of problematicSchemas) {
      this.clearSchemaCache(schemaId);
      await this.generateSchemaFromDatabase(schemaId);
    }
  }

  // Force refresh discount-rules schema to pick up new eligibility columns
  async forceRefreshDiscountRules(): Promise<void> {
    console.log(`🔄 Force refreshing discount-rules schema to pick up new eligibility columns`);
    this.clearSchemaCache('discount-rules');
    await this.generateSchemaFromDatabase('discount-rules');
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