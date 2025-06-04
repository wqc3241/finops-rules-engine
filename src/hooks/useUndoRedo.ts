
import { useState, useCallback } from 'react';
import { DynamicTableSchema, TableData } from '@/types/dynamicTable';

interface UndoRedoState {
  data: TableData[];
  schema: DynamicTableSchema;
  timestamp: number;
  action: string;
}

export const useUndoRedo = (
  initialData: TableData[], 
  initialSchema: DynamicTableSchema,
  onStateRestore: (data: TableData[], schema: DynamicTableSchema) => void
) => {
  const [history, setHistory] = useState<UndoRedoState[]>([
    { 
      data: JSON.parse(JSON.stringify(initialData)), 
      schema: JSON.parse(JSON.stringify(initialSchema)), 
      timestamp: Date.now(), 
      action: 'initial' 
    }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const saveState = useCallback((data: TableData[], schema: DynamicTableSchema, action: string) => {
    const newState: UndoRedoState = {
      data: JSON.parse(JSON.stringify(data)),
      schema: JSON.parse(JSON.stringify(schema)),
      timestamp: Date.now(),
      action
    };

    setHistory(prev => {
      // Remove any future states when adding a new state
      const newHistory = prev.slice(0, currentIndex + 1);
      return [...newHistory, newState];
    });
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const previousState = history[newIndex];
      setCurrentIndex(newIndex);
      onStateRestore(previousState.data, previousState.schema);
      return previousState;
    }
    return null;
  }, [currentIndex, history, onStateRestore]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      const nextState = history[newIndex];
      setCurrentIndex(newIndex);
      onStateRestore(nextState.data, nextState.schema);
      return nextState;
    }
    return null;
  }, [currentIndex, history, onStateRestore]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
    currentState: history[currentIndex]
  };
};
