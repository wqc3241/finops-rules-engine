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
      { id: 'bulletin_id', name: 'Bulletin ID', key: 'bulletin_id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'financial_program_code', name: 'Financial Program Code', key: 'financial_program_code', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'pricing_config', name: 'Pricing Config', key: 'pricing_config', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'geo_code', name: 'Geo Code', key: 'geo_code', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'lender_list', name: 'Lender List', key: 'lender_list', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'advertised', name: 'Advertised', key: 'advertised', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'pricing_type', name: 'Pricing Type', key: 'pricing_type', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'pricing_value', name: 'Pricing Value', key: 'pricing_value', type: 'number', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'credit_profile', name: 'Credit Profile', key: 'credit_profile', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'upload_date', name: 'Upload Date', key: 'upload_date', type: 'string', inputType: 'Output', isRequired: false, sortable: true, editable: false }
    ]
  },
  'pricing-types': {
    id: 'pricing-types',
    name: 'Pricing Types',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'type_code', name: 'Type Code', key: 'type_code', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'type_name', name: 'Type Name', key: 'type_name', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true }
    ]
  },
  'financial-products': {
    id: 'financial-products',
    name: 'Financial Products',
    columns: [
      { id: 'product_id', name: 'Product ID', key: 'product_id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'product_type', name: 'Product Type', key: 'product_type', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'product_subtype', name: 'Product Subtype', key: 'product_subtype', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'geo_code', name: 'Geo Code', key: 'geo_code', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'category', name: 'Category', key: 'category', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'is_active', name: 'Status', key: 'is_active', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true }
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
      { id: 'profile_id', name: 'Profile ID', key: 'profile_id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'priority', name: 'Priority', key: 'priority', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'min_credit_score', name: 'Min Credit Score', key: 'min_credit_score', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'max_credit_score', name: 'Max Credit Score', key: 'max_credit_score', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'min_income', name: 'Min Income', key: 'min_income', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'max_income', name: 'Max Income', key: 'max_income', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'min_age', name: 'Min Age', key: 'min_age', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'max_age', name: 'Max Age', key: 'max_age', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'min_pti', name: 'Min PTI', key: 'min_pti', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'max_pti', name: 'Max PTI', key: 'max_pti', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'min_dti', name: 'Min DTI', key: 'min_dti', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'max_dti', name: 'Max DTI', key: 'max_dti', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'employment_type', name: 'Employment Type', key: 'employment_type', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true }
    ]
  },
  'pricing-config': {
    id: 'pricing-config',
    name: 'Pricing Config',
    columns: [
      { id: 'pricing_rule_id', name: 'Pricing Rule ID', key: 'pricing_rule_id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'min_ltv', name: 'Min LTV', key: 'min_ltv', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'max_ltv', name: 'Max LTV', key: 'max_ltv', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'min_term', name: 'Min Term', key: 'min_term', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'max_term', name: 'Max Term', key: 'max_term', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'min_lease_mileage', name: 'Min Lease Mileage', key: 'min_lease_mileage', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'max_lease_mileage', name: 'Max Lease Mileage', key: 'max_lease_mileage', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'priority', name: 'Priority', key: 'priority', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true }
    ]
  },
  'financial-program-config': {
    id: 'financial-program-config',
    name: 'Financial Program Config',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'program_code', name: 'Program Code', key: 'program_code', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'clone_from', name: 'Clone From', key: 'clone_from', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'priority', name: 'Priority', key: 'priority', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'financial_product_id', name: 'Financial Product ID', key: 'financial_product_id', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'product_type', name: 'Product Type', key: 'product_type', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'vehicle_style_id', name: 'Vehicle Style ID', key: 'vehicle_style_id', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'financing_vehicle_condition', name: 'Financing Vehicle Condition', key: 'financing_vehicle_condition', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'program_start_date', name: 'Program Start Date', key: 'program_start_date', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'program_end_date', name: 'Program End Date', key: 'program_end_date', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'is_active', name: 'Active', key: 'is_active', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'order_types', name: 'Order Types', key: 'order_types', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'advertised', name: 'Advertised', key: 'advertised', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'version', name: 'Version', key: 'version', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true }
    ]
  },
  'advertised-offers': {
    id: 'advertised-offers',
    name: 'Advertised Offers',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'financial_program_code', name: 'Financial Program Code', key: 'financial_program_code', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'lender', name: 'Lender', key: 'lender', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'term', name: 'Term', key: 'term', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'is_active', name: 'Active', key: 'is_active', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true }
    ]
  },
  'gateway': {
    id: 'gateway',
    name: 'Gateway',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'gateway_name', name: 'Gateway Name', key: 'gateway_name', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'geo_code', name: 'Geo Code', key: 'geo_code', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'platform_id', name: 'Platform ID', key: 'platform_id', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
    ]
  },
  'dealer': {
    id: 'dealer',
    name: 'Dealer',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'dba_name', name: 'DBA Name', key: 'dba_name', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'legal_entity_name', name: 'Legal Entity Name', key: 'legal_entity_name', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'gateway_dealer_id', name: 'Gateway Dealer ID', key: 'gateway_dealer_id', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'geo_code', name: 'Geo Code', key: 'geo_code', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'selling_state', name: 'Selling State', key: 'selling_state', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
    ]
  },
  'lender': {
    id: 'lender',
    name: 'Lender',
    columns: [
      { id: 'Gateway lender ID', name: 'Gateway Lender ID', key: 'Gateway lender ID', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'lender_name', name: 'Lender Name', key: 'lender_name', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'gateway_lender_name', name: 'Gateway Lender Name', key: 'gateway_lender_name', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'lien_holder_name', name: 'Lien Holder Name', key: 'lien_holder_name', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'lender_address', name: 'Lender Address', key: 'lender_address', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
    ]
  },
  'country': {
    id: 'country',
    name: 'Country',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'country_name', name: 'Country Name', key: 'country_name', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'country_code', name: 'Country Code', key: 'country_code', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
    ]
  },
  'state': {
    id: 'state',
    name: 'State',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'state_name', name: 'State Name', key: 'state_name', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'state_code', name: 'State Code', key: 'state_code', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'country_id', name: 'Country ID', key: 'country_id', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
    ]
  },
  'location-geo': {
    id: 'location-geo',
    name: 'LocationGeo',
    columns: [
      { id: 'Geo Code', name: 'Geo Code', key: 'Geo Code', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'Location Name', name: 'Location Name', key: 'Location Name', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'Country Name', name: 'Country Name', key: 'Country Name', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'Country Code', name: 'Country Code', key: 'Country Code', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'State Name', name: 'State Name', key: 'State Name', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'State/ Provinces Code', name: 'State/Province Code', key: 'State/ Provinces Code', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
    ]
  },
  'lease-config': {
    id: 'lease-config',
    name: 'Lease Config',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'configName', name: 'Config Name', key: 'configName', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
    ]
  },
  'vehicle-condition': {
    id: 'vehicle-condition',
    name: 'Vehicle Condition',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'condition', name: 'Condition', key: 'condition', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
    ]
  },
  'vehicle-options': {
    id: 'vehicle-options',
    name: 'Vehicle Options',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'optionName', name: 'Option Name', key: 'optionName', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
    ]
  },
  'routing-rule': {
    id: 'routing-rule',
    name: 'Routing Rule',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'ruleName', name: 'Rule Name', key: 'ruleName', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
    ]
  },
  'stipulation': {
    id: 'stipulation',
    name: 'Stipulation',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'stipulationName', name: 'Stipulation Name', key: 'stipulationName', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
    ]
  },
  'vehicle-style-coding': {
    id: 'vehicle-style-coding',
    name: 'Vehicle Style Coding',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'code', name: 'Style Code', key: 'code', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'description', name: 'Description', key: 'description', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
    ]
  },
  'order-type': {
    id: 'order-type',
    name: 'Order Type',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'type_name', name: 'Type Name', key: 'type_name', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'type_code', name: 'Type Code', key: 'type_code', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true }
    ]
  },
  'fee-rules': {
    id: 'fee-rules',
    name: 'Fee Rules',
    columns: [
      // Primary ID
      { id: '_id', name: 'ID', key: '_id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      
      // Basic info
      { id: 'name', name: 'Name', key: 'name', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'description', name: 'Description', key: 'description', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'category', name: 'Category', key: 'category', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'subcategory', name: 'Subcategory', key: 'subcategory', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'type', name: 'Type', key: 'type', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      
      // Amount and currency
      { id: 'feeAmount', name: 'Fee Amount', key: 'feeAmount', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'feeCurrency', name: 'Fee Currency', key: 'feeCurrency', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'feeRangeType', name: 'Fee Range Type', key: 'feeRangeType', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'feeRanges', name: 'Fee Ranges', key: 'feeRanges', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      
      // Status and flags
      { id: 'feeActive', name: 'Fee Active', key: 'feeActive', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'feeTaxable', name: 'Fee Taxable', key: 'feeTaxable', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'isDeleted', name: 'Is Deleted', key: 'isDeleted', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'selfReg', name: 'Self Registration', key: 'selfReg', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      
      // Geographic and payment info
      { id: 'feeCountry', name: 'Fee Country', key: 'feeCountry', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'feeState', name: 'Fee State', key: 'feeState', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'payType', name: 'Pay Type', key: 'payType', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'provider', name: 'Provider', key: 'provider', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      
      // Tax information
      { id: 'feeTaxRate', name: 'Fee Tax Rate', key: 'feeTaxRate', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      
      // Dates
      { id: 'startDate', name: 'Start Date', key: 'startDate', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'endDate', name: 'End Date', key: 'endDate', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      
      // Purchase type conditions
      { id: 'purchaseType_values', name: 'Purchase Type Values', key: 'purchaseType_values', type: 'string', inputType: 'Input', isRequired: false, sortable: false, editable: true },
      { id: 'purchaseType_appliesToAll', name: 'Purchase Type Applies to All', key: 'purchaseType_appliesToAll', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      
      // Vehicle model conditions
      { id: 'vehicleModel_values', name: 'Vehicle Model Values', key: 'vehicleModel_values', type: 'string', inputType: 'Input', isRequired: false, sortable: false, editable: true },
      { id: 'vehicleModel_appliesToAll', name: 'Vehicle Model Applies to All', key: 'vehicleModel_appliesToAll', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      
      // Title status conditions
      { id: 'titleStatus_values', name: 'Title Status Values', key: 'titleStatus_values', type: 'string', inputType: 'Input', isRequired: false, sortable: false, editable: true },
      { id: 'titleStatus_appliesToAll', name: 'Title Status Applies to All', key: 'titleStatus_appliesToAll', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      
      // Vehicle year conditions
      { id: 'vehicleYear_values', name: 'Vehicle Year Values', key: 'vehicleYear_values', type: 'string', inputType: 'Input', isRequired: false, sortable: false, editable: true },
      { id: 'vehicleYear_appliesToAll', name: 'Vehicle Year Applies to All', key: 'vehicleYear_appliesToAll', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      
      // Capitalize and translation
      { id: 'capitalizeType', name: 'Capitalize Type', key: 'capitalizeType', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'frCaTranslation', name: 'French CA Translation', key: 'frCaTranslation', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      
      // Metadata
      { id: 'pricingVersion', name: 'Pricing Version', key: 'pricingVersion', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'migration', name: 'Migration', key: 'migration', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: '__v', name: 'Version', key: '__v', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'isNewExperience', name: 'Is New Experience', key: 'isNewExperience', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      
      // Audit fields
      { id: 'createdBy', name: 'Created By', key: 'createdBy', type: 'string', inputType: 'Output', isRequired: false, sortable: true, editable: false },
      { id: 'updatedBy', name: 'Updated By', key: 'updatedBy', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'createdAt', name: 'Created At', key: 'createdAt', type: 'string', inputType: 'Output', isRequired: false, sortable: true, editable: false },
      { id: 'updatedAt', name: 'Updated At', key: 'updatedAt', type: 'string', inputType: 'Output', isRequired: false, sortable: true, editable: false }
    ]
  },
  'tax-rules': {
    id: 'tax-rules',
    name: 'Tax Rules',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'tax_name', name: 'Tax Name', key: 'tax_name', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'tax_type', name: 'Tax Type', key: 'tax_type', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'rate', name: 'Rate (%)', key: 'rate', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'geo_code', name: 'Geo Code', key: 'geo_code', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'is_active', name: 'Active', key: 'is_active', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'created_at', name: 'Created At', key: 'created_at', type: 'string', inputType: 'Output', isRequired: false, sortable: true, editable: false }
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
        // Clear fee-rules from cache to ensure we use the latest schema structure
        delete parsedSchemas['fee-rules'];
        // Ensure fee-rules and tax-rules use the latest column structure from DEFAULT_SCHEMAS
        // This helps override potentially outdated structures from localStorage.
        if (parsedSchemas['fee-rules']) {
            parsedSchemas['fee-rules'].columns = DEFAULT_SCHEMAS['fee-rules'].columns;
        }
        if (parsedSchemas['tax-rules']) {
            parsedSchemas['tax-rules'].columns = DEFAULT_SCHEMAS['tax-rules'].columns;
        }
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
