
import { toast } from "sonner";

/**
 * Sort an array of objects by a specific property
 * @param array The array to sort
 * @param property The property to sort by
 * @param direction 'asc' for ascending, 'desc' for descending
 * @returns The sorted array
 */
export const sortByProperty = <T extends Record<string, any>>(
  array: T[],
  property: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  toast.success(`Sorted by ${String(property)} in ${direction === 'asc' ? 'ascending' : 'descending'} order`);
  
  return [...array].sort((a, b) => {
    const valueA = a[property];
    const valueB = b[property];
    
    // Handle string comparison
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return direction === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    // Handle number comparison
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return direction === 'asc' 
        ? valueA - valueB 
        : valueB - valueA;
    }
    
    // Handle date comparison
    if (valueA instanceof Date && valueB instanceof Date) {
      return direction === 'asc' 
        ? valueA.getTime() - valueB.getTime() 
        : valueB.getTime() - valueA.getTime();
    }
    
    // Default comparison for other types
    return direction === 'asc' 
      ? String(valueA).localeCompare(String(valueB)) 
      : String(valueB).localeCompare(String(valueA));
  });
};

/**
 * Filter an array of objects by a specific property
 * @param array The array to filter
 * @param property The property to filter by
 * @param value The value to filter for
 * @returns The filtered array
 */
export const filterByProperty = <T extends Record<string, any>>(
  array: T[],
  property: keyof T,
  value: any
): T[] => {
  toast.success(`Filtered by ${String(property)} containing "${value}"`);
  
  return array.filter(item => {
    const itemValue = item[property];
    
    if (typeof itemValue === 'string') {
      return itemValue.toLowerCase().includes(String(value).toLowerCase());
    }
    
    return itemValue === value;
  });
};

/**
 * Apply batch operations to multiple items
 * @param items The array of items to update
 * @param selectedIds The IDs of the selected items
 * @param operation The operation to perform
 * @returns The updated items array
 */
export const applyBatchOperation = <T extends Record<string, any>>(
  items: T[],
  selectedIds: string[],
  operation: (item: T) => T
): T[] => {
  return items.map(item => 
    selectedIds.includes(item.id) ? operation(item) : item
  );
};
