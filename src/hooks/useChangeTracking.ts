import { useState, useEffect, useCallback } from "react";
import { TableData } from "@/types/dynamicTable";

interface TrackedChanges {
  schemaId: string;
  originalData: TableData[];
  currentData: TableData[];
  hasChanges: boolean;
}

export const useChangeTracking = () => {
  const [trackedChanges, setTrackedChanges] = useState<Record<string, TrackedChanges>>({});

  const startTracking = useCallback((schemaId: string, data: TableData[]) => {
    setTrackedChanges(prev => ({
      ...prev,
      [schemaId]: {
        schemaId,
        originalData: JSON.parse(JSON.stringify(data)), // deep copy
        currentData: JSON.parse(JSON.stringify(data)),
        hasChanges: false
      }
    }));
  }, []);

  const updateTracking = useCallback((schemaId: string, newData: TableData[]) => {
    setTrackedChanges(prev => {
      const tracked = prev[schemaId];
      if (!tracked) return prev;

      const hasChanges = JSON.stringify(tracked.originalData) !== JSON.stringify(newData);
      
      console.log('Change tracking update:', {
        schemaId,
        hasChanges,
        originalDataLength: tracked.originalData.length,
        newDataLength: newData.length,
        originalData: tracked.originalData,
        newData
      });
      
      return {
        ...prev,
        [schemaId]: {
          ...tracked,
          currentData: JSON.parse(JSON.stringify(newData)),
          hasChanges
        }
      };
    });
  }, []);

  const getChangedTables = useCallback(() => {
    return Object.values(trackedChanges).filter(tracked => tracked.hasChanges);
  }, [trackedChanges]);

  const getChangesSummary = useCallback(() => {
    const changedTables = getChangedTables();
    return changedTables.map(tracked => {
      const added = tracked.currentData.filter(current => 
        !tracked.originalData.find(orig => orig.id === current.id)
      );
      
      const modified = tracked.currentData.filter(current => {
        const original = tracked.originalData.find(orig => orig.id === current.id);
        return original && JSON.stringify(original) !== JSON.stringify(current);
      });
      
      const deleted = tracked.originalData.filter(original => 
        !tracked.currentData.find(current => current.id === original.id)
      );

      return {
        schemaId: tracked.schemaId,
        added: added.length,
        modified: modified.length,
        deleted: deleted.length,
        total: added.length + modified.length + deleted.length
      };
    });
  }, [getChangedTables]);

  const resetTracking = useCallback((schemaId?: string) => {
    if (schemaId) {
      setTrackedChanges(prev => {
        const { [schemaId]: removed, ...rest } = prev;
        return rest;
      });
    } else {
      setTrackedChanges({});
    }
  }, []);

  const getTableChanges = useCallback((schemaId: string) => {
    const tracked = trackedChanges[schemaId];
    if (!tracked) return null;

    return {
      originalData: tracked.originalData,
      currentData: tracked.currentData,
      hasChanges: tracked.hasChanges
    };
  }, [trackedChanges]);

  return {
    startTracking,
    updateTracking,
    getChangedTables,
    getChangesSummary,
    resetTracking,
    getTableChanges,
    trackedChanges
  };
};