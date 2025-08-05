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
