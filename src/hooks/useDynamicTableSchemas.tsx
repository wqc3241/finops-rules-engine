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
      { id: 'id', name: 'Bulletin ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'financialProgramCode', name: 'Financial Program Code', key: 'financialProgramCode', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'programId', name: 'Program Id', key: 'programId', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'pricingConfig', name: 'Pricing Config', key: 'pricingConfig', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'geoCode', name: 'Geo Code', key: 'geoCode', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'lenderName', name: 'Lender Name', key: 'lenderName', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'advertised', name: 'Advertised', key: 'advertised', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'pricingType', name: 'Pricing Type', key: 'pricingType', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'pricingValue', name: 'Pricing Value', key: 'pricingValue', type: 'number', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'uploadDate', name: 'Upload Date', key: 'uploadDate', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false }
    ]
  },
  'pricing-types': {
    id: 'pricing-types',
    name: 'Pricing Types',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'typeCode', name: 'Type Code', key: 'typeCode', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'typeName', name: 'Type Name', key: 'typeName', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true }
    ]
  },
  'financial-products': {
    id: 'financial-products',
    name: 'Financial Products',
    columns: [
      { id: 'id', name: 'Product ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'productType', name: 'Product Type', key: 'productType', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'productSubtype', name: 'Product Subtype', key: 'productSubtype', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'geoCode', name: 'Geo Code', key: 'geoCode', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'category', name: 'Category', key: 'category', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'isActive', name: 'Status', key: 'isActive', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true }
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
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'priority', name: 'Priority', key: 'priority', type: 'number', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'minCreditScore', name: 'Min Credit Score', key: 'minCreditScore', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'maxCreditScore', name: 'Max Credit Score', key: 'maxCreditScore', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'minIncome', name: 'Min Income', key: 'minIncome', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'maxIncome', name: 'Max Income', key: 'maxIncome', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'minAge', name: 'Min Age', key: 'minAge', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'maxAge', name: 'Max Age', key: 'maxAge', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'minPTI', name: 'Min PTI', key: 'minPTI', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'maxPTI', name: 'Max PTI', key: 'maxPTI', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'minDTI', name: 'Min DTI', key: 'minDTI', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'maxDTI', name: 'Max DTI', key: 'maxDTI', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'employmentType', name: 'Employment Type', key: 'employmentType', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true }
    ]
  },
  'pricing-config': {
    id: 'pricing-config',
    name: 'Pricing Config',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'minLTV', name: 'Min LTV', key: 'minLTV', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'maxLTV', name: 'Max LTV', key: 'maxLTV', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'minTerm', name: 'Min Term', key: 'minTerm', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'maxTerm', name: 'Max Term', key: 'maxTerm', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'minLeaseMileage', name: 'Min Lease Mileage', key: 'minLeaseMileage', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'maxLeaseMileage', name: 'Max Lease Mileage', key: 'maxLeaseMileage', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'priority', name: 'Priority', key: 'priority', type: 'number', inputType: 'Input', isRequired: true, sortable: true, editable: true }
    ]
  },
  'financial-program-config': {
    id: 'financial-program-config',
    name: 'Financial Program Config',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'programCode', name: 'Program Code', key: 'programCode', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'cloneFrom', name: 'Clone From', key: 'cloneFrom', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'priority', name: 'Priority', key: 'priority', type: 'number', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'financialProductId', name: 'Financial Product ID', key: 'financialProductId', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'productType', name: 'Product Type', key: 'productType', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'vehicleStyleId', name: 'Vehicle Style ID', key: 'vehicleStyleId', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'financingVehicleCondition', name: 'Financing Vehicle Condition', key: 'financingVehicleCondition', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'programStartDate', name: 'Program Start Date', key: 'programStartDate', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'programEndDate', name: 'Program End Date', key: 'programEndDate', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'isActive', name: 'Active', key: 'isActive', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'orderTypes', name: 'Order Types', key: 'orderTypes', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'version', name: 'Version', key: 'version', type: 'number', inputType: 'Input', isRequired: true, sortable: true, editable: true }
    ]
  },
  'advertised-offers': {
    id: 'advertised-offers',
    name: 'Advertised Offers',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'bulletinPricing', name: 'Bulletin Pricing', key: 'bulletinPricing', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'disclosure', name: 'Disclosure', key: 'disclosure', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'loanAmountPer10k', name: 'Loan Amount Per 10K', key: 'loanAmountPer10k', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'totalCostOfCredit', name: 'Total Cost of Credit', key: 'totalCostOfCredit', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true }
    ]
  },
  'gateway': {
    id: 'gateway',
    name: 'Gateway',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'gatewayName', name: 'Gateway Name', key: 'gatewayName', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
    ]
  },
  'dealer': {
    id: 'dealer',
    name: 'Dealer',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'dealerName', name: 'Dealer Name', key: 'dealerName', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
    ]
  },
  'lender': {
    id: 'lender',
    name: 'Lender',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'lenderName', name: 'Lender Name', key: 'lenderName', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
    ]
  },
  'country': {
    id: 'country',
    name: 'Country',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'countryName', name: 'Country Name', key: 'countryName', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'countryCode', name: 'Country Code', key: 'countryCode', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
    ]
  },
  'state': {
    id: 'state',
    name: 'State',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'stateName', name: 'State Name', key: 'stateName', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
    ]
  },
  'location-geo': {
    id: 'location-geo',
    name: 'LocationGeo',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'locationName', name: 'Location Name', key: 'locationName', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'geoCode', name: 'Geo Code', key: 'geoCode', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
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
      { id: 'typeName', name: 'Type Name', key: 'typeName', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'typeCode', name: 'Type Code', key: 'typeCode', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true }
    ]
  },
  'fee-rules': {
    id: 'fee-rules',
    name: 'Fee Rules',
    columns: [
      { id: 'id', name: 'ID', key: 'id', type: 'string', inputType: 'Output', isRequired: true, sortable: true, editable: false },
      { id: 'fee_name', name: 'Fee Name', key: 'fee_name', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'fee_type', name: 'Fee Type', key: 'fee_type', type: 'string', inputType: 'Input', isRequired: true, sortable: true, editable: true },
      { id: 'amount', name: 'Amount', key: 'amount', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'is_active', name: 'Is Active', key: 'is_active', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'fee_active', name: 'Fee Active', key: 'fee_active', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'fee_taxable', name: 'Fee Taxable', key: 'fee_taxable', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'is_deleted', name: 'Is Deleted', key: 'is_deleted', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'self_reg', name: 'Self Reg', key: 'self_reg', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'fee_country', name: 'Fee Country', key: 'fee_country', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'fee_currency', name: 'Fee Currency', key: 'fee_currency', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'fee_state', name: 'Fee State', key: 'fee_state', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'type', name: 'Type', key: 'type', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'name', name: 'Name', key: 'name', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'category', name: 'Category', key: 'category', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'pay_type', name: 'Pay Type', key: 'pay_type', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'provider', name: 'Provider', key: 'provider', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'subcategory', name: 'Subcategory', key: 'subcategory', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'capitalize_type', name: 'Capitalize Type', key: 'capitalize_type', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'created_by', name: 'Created By', key: 'created_by', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'updated_by', name: 'Updated By', key: 'updated_by', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'description', name: 'Description', key: 'description', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'fr_ca_translation', name: 'FR CA Translation', key: 'fr_ca_translation', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'fee_range_type', name: 'Fee Range Type', key: 'fee_range_type', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'pricing_version', name: 'Pricing Version', key: 'pricing_version', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'migration', name: 'Migration', key: 'migration', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'fee_tax_rate', name: 'Fee Tax Rate', key: 'fee_tax_rate', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'version_number', name: 'Version Number', key: 'version_number', type: 'number', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'is_new_experience', name: 'Is New Experience', key: 'is_new_experience', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'purchase_type_applies_to_all', name: 'Purchase Type Applies To All', key: 'purchase_type_applies_to_all', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'vehicle_model_applies_to_all', name: 'Vehicle Model Applies To All', key: 'vehicle_model_applies_to_all', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'title_status_applies_to_all', name: 'Title Status Applies To All', key: 'title_status_applies_to_all', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'vehicle_year_applies_to_all', name: 'Vehicle Year Applies To All', key: 'vehicle_year_applies_to_all', type: 'boolean', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'start_date', name: 'Start Date', key: 'start_date', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'end_date', name: 'End Date', key: 'end_date', type: 'string', inputType: 'Input', isRequired: false, sortable: true, editable: true },
      { id: 'created_at', name: 'Created At', key: 'created_at', type: 'string', inputType: 'Output', isRequired: false, sortable: true, editable: false },
      { id: 'updated_at', name: 'Updated At', key: 'updated_at', type: 'string', inputType: 'Output', isRequired: false, sortable: true, editable: false }
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
        // Ensure bulletin-pricing uses the latest column structure from DEFAULT_SCHEMAS
        // This helps override potentially outdated structures from localStorage.
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
