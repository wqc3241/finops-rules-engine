export interface TableFilter {
  columnKey: string;
  type: 'text' | 'number' | 'boolean' | 'date';
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte' | 'between' | 'is' | 'isNot';
  value: string | number | boolean | Date | null;
  value2?: string | number | Date; // For 'between' operator
}

export interface TableSort {
  columnKey: string;
  direction: 'asc' | 'desc';
}

export interface FilterOperatorConfig {
  label: string;
  value: string;
  supportsSecondValue?: boolean;
}

export const TEXT_OPERATORS: FilterOperatorConfig[] = [
  { label: 'Contains', value: 'contains' },
  { label: 'Equals', value: 'equals' },
  { label: 'Starts with', value: 'startsWith' },
  { label: 'Ends with', value: 'endsWith' },
];

export const NUMBER_OPERATORS: FilterOperatorConfig[] = [
  { label: 'Equals', value: 'equals' },
  { label: 'Greater than', value: 'gt' },
  { label: 'Less than', value: 'lt' },
  { label: 'Greater than or equal', value: 'gte' },
  { label: 'Less than or equal', value: 'lte' },
  { label: 'Between', value: 'between', supportsSecondValue: true },
];

export const BOOLEAN_OPERATORS: FilterOperatorConfig[] = [
  { label: 'Is', value: 'is' },
  { label: 'Is not', value: 'isNot' },
];

export const DATE_OPERATORS: FilterOperatorConfig[] = [
  { label: 'Equals', value: 'equals' },
  { label: 'After', value: 'gt' },
  { label: 'Before', value: 'lt' },
  { label: 'On or after', value: 'gte' },
  { label: 'On or before', value: 'lte' },
  { label: 'Between', value: 'between', supportsSecondValue: true },
];