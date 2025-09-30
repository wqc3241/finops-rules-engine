import React, { useState, useCallback, useContext, createContext } from "react";
import { TableData } from "@/types/dynamicTable";

interface TrackedChanges {
  schemaId: string;
  originalData: TableData[];
  currentData: TableData[];
  hasChanges: boolean;
  primaryKey?: string;
}

interface ChangeTrackingContextValue {
  startTracking: (schemaId: string, data: TableData[], primaryKey?: string) => void;
  updateTracking: (schemaId: string, newData: TableData[]) => void;
  getChangedTables: () => TrackedChanges[];
  getChangesSummary: () => { schemaId: string; added: number; modified: number; deleted: number; total: number }[];
  resetTracking: (schemaId?: string) => void;
  getTableChanges: (schemaId: string) => { originalData: TableData[]; currentData: TableData[]; hasChanges: boolean; primaryKey?: string } | null;
  trackedChanges: Record<string, TrackedChanges>;
}

const ChangeTrackingContext = createContext<ChangeTrackingContextValue | null>(null);

export const ChangeTrackingProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [trackedChanges, setTrackedChanges] = useState<Record<string, TrackedChanges>>({});

  const startTracking = useCallback((schemaId: string, data: TableData[], primaryKey?: string) => {
    setTrackedChanges(prev => ({
      ...prev,
      [schemaId]: {
        schemaId,
        originalData: JSON.parse(JSON.stringify(data)), // deep copy
        currentData: JSON.parse(JSON.stringify(data)),
        hasChanges: false,
        primaryKey
      }
    }));
  }, []);

  const updateTracking = useCallback((schemaId: string, newData: TableData[]) => {
    setTrackedChanges(prev => {
      const tracked = prev[schemaId];
      if (!tracked) return prev;

      // Skip change detection if the new data is empty (likely during loading)
      if (newData.length === 0 && tracked.originalData.length > 0) {
        return prev;
      }

      const getKey = (row: any) => String(row?.[tracked.primaryKey || 'id'] ?? row?.id ?? row?._id ?? '');
      const origMap = new Map(tracked.originalData.map(r => [getKey(r), r] as const));
      const newMap = new Map(newData.map(r => [getKey(r), r] as const));

      let hasChanges = false;
      if (origMap.size !== newMap.size) {
        hasChanges = true;
      } else {
        for (const [k, n] of newMap) {
          const o = origMap.get(k);
          if (!o || JSON.stringify(o) !== JSON.stringify(n)) {
            hasChanges = true;
            break;
          }
        }
      }

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
      const getKey = (row: any) => String(row?.[tracked.primaryKey || 'id'] ?? row?.id ?? row?._id ?? '');
      const origMap = new Map(tracked.originalData.map(r => [getKey(r), r] as const));
      const newMap = new Map(tracked.currentData.map(r => [getKey(r), r] as const));

      let added = 0, modified = 0, deleted = 0;
      for (const [k, n] of newMap) {
        const o = origMap.get(k);
        if (!o) added++;
        else if (JSON.stringify(o) !== JSON.stringify(n)) modified++;
      }
      for (const k of origMap.keys()) {
        if (!newMap.has(k)) deleted++;
      }

      return { schemaId: tracked.schemaId, added, modified, deleted, total: added + modified + deleted };
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
      hasChanges: tracked.hasChanges,
      primaryKey: tracked.primaryKey
    };
  }, [trackedChanges]);

  const value: ChangeTrackingContextValue = {
    startTracking,
    updateTracking,
    getChangedTables,
    getChangesSummary,
    resetTracking,
    getTableChanges,
    trackedChanges
  };

  return (
    <ChangeTrackingContext.Provider value={value}>
      {children}
    </ChangeTrackingContext.Provider>
  );
};

// Hook - uses context if available; falls back to isolated state to avoid crashes
export const useChangeTracking = (): ChangeTrackingContextValue => {
  const ctx = useContext(ChangeTrackingContext);
  if (ctx) return ctx;

  // Fallback isolated instance (won't be shared). Prefer wrapping in ChangeTrackingProvider.
  const [trackedChanges, setTrackedChanges] = useState<Record<string, TrackedChanges>>({});

  const startTracking = useCallback((schemaId: string, data: TableData[], primaryKey?: string) => {
    setTrackedChanges(prev => ({
      ...prev,
      [schemaId]: {
        schemaId,
        originalData: JSON.parse(JSON.stringify(data)),
        currentData: JSON.parse(JSON.stringify(data)),
        hasChanges: false,
        primaryKey
      }
    }));
  }, []);

  const updateTracking = useCallback((schemaId: string, newData: TableData[]) => {
    setTrackedChanges(prev => {
      const tracked = prev[schemaId];
      if (!tracked) return prev;
      
      // Skip change detection if the new data is empty (likely during loading)
      if (newData.length === 0 && tracked.originalData.length > 0) {
        return prev;
      }
      
      const getKey = (row: any) => String(row?.[tracked.primaryKey || 'id'] ?? row?.id ?? row?._id ?? '');
      const origMap = new Map(tracked.originalData.map(r => [getKey(r), r] as const));
      const newMap = new Map(newData.map(r => [getKey(r), r] as const));
      let hasChanges = false;
      if (origMap.size !== newMap.size) hasChanges = true;
      else {
        for (const [k, n] of newMap) {
          const o = origMap.get(k);
          if (!o || JSON.stringify(o) !== JSON.stringify(n)) { hasChanges = true; break; }
        }
      }
      return { ...prev, [schemaId]: { ...tracked, currentData: JSON.parse(JSON.stringify(newData)), hasChanges } };
    });
  }, []);

  const getChangedTables = useCallback(() => Object.values(trackedChanges).filter(t => t.hasChanges), [trackedChanges]);

  const getChangesSummary = useCallback(() => {
    const changedTables = getChangedTables();
    return changedTables.map(tracked => {
      const getKey = (row: any) => String(row?.[tracked.primaryKey || 'id'] ?? row?.id ?? row?._id ?? '');
      const origMap = new Map(tracked.originalData.map(r => [getKey(r), r] as const));
      const newMap = new Map(tracked.currentData.map(r => [getKey(r), r] as const));
      let added = 0, modified = 0, deleted = 0;
      for (const [k, n] of newMap) {
        const o = origMap.get(k);
        if (!o) added++; else if (JSON.stringify(o) !== JSON.stringify(n)) modified++;
      }
      for (const k of origMap.keys()) { if (!newMap.has(k)) deleted++; }
      return { schemaId: tracked.schemaId, added, modified, deleted, total: added + modified + deleted };
    });
  }, [getChangedTables]);

  const resetTracking = useCallback((schemaId?: string) => {
    if (schemaId) {
      setTrackedChanges(prev => { const { [schemaId]: removed, ...rest } = prev; return rest; });
    } else {
      setTrackedChanges({});
    }
  }, []);

  const getTableChanges = useCallback((schemaId: string) => {
    const tracked = trackedChanges[schemaId];
    if (!tracked) return null;
    return { originalData: tracked.originalData, currentData: tracked.currentData, hasChanges: tracked.hasChanges, primaryKey: tracked.primaryKey };
  }, [trackedChanges]);

  return { startTracking, updateTracking, getChangedTables, getChangesSummary, resetTracking, getTableChanges, trackedChanges };
};