import { TableData } from "@/types/dynamicTable";

// Centralized local storage management for dynamic tables
const STORAGE_PREFIX = 'dynamicTableData_';

export const getDynamicTableData = (schemaId: string): TableData[] => {
  try {
    const savedData = localStorage.getItem(`${STORAGE_PREFIX}${schemaId}`);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error(`Failed to load data for schema ${schemaId}:`, error);
  }
  return [];
};

export const saveDynamicTableData = (schemaId: string, data: TableData[]): void => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${schemaId}`, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save data for schema ${schemaId}:`, error);
  }
};

export const clearDynamicTableData = (schemaId: string): void => {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${schemaId}`);
  } catch (error) {
    console.error(`Failed to clear data for schema ${schemaId}:`, error);
  }
};

export const clearAllDynamicTableData = (): void => {
  try {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(STORAGE_PREFIX));
    keys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clear all dynamic table data:', error);
  }
};

// Check if data exists for a schema
export const hasDynamicTableData = (schemaId: string): boolean => {
  return localStorage.getItem(`${STORAGE_PREFIX}${schemaId}`) !== null;
};