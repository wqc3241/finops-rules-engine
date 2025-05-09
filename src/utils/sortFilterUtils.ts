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
  // Remove the toast notification from here as it's causing an infinite loop
  // It's better to show toasts at the UI component level when sorting is triggered
  
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
    
    // Handle date comparison - improved date handling with proper type checking
    if (valueA && valueB) {
      // Try to convert to dates if they're not already, but handle type checking properly
      const dateA = new Date(String(valueA));
      const dateB = new Date(String(valueB));
      
      // Only proceed with date comparison if both values produce valid dates
      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return direction === 'asc' 
          ? dateA.getTime() - dateB.getTime() 
          : dateB.getTime() - dateA.getTime();
      }
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
  // We keep this toast since it's not in a component render function and won't loop
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
