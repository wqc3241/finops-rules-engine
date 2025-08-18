import React from "react";
import { TableData } from "@/types/dynamicTable";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Minus, Edit } from "lucide-react";

interface DetailedChangeViewProps {
  schemaId: string;
  originalData: TableData[];
  currentData: TableData[];
  primaryKey?: string;
}

interface ChangeRecord {
  type: 'added' | 'modified' | 'deleted';
  key: string;
  record?: TableData;
  originalRecord?: TableData;
  changes?: { field: string; oldValue: any; newValue: any }[];
}

const DetailedChangeView: React.FC<DetailedChangeViewProps> = ({
  schemaId,
  originalData,
  currentData,
  primaryKey = 'id'
}) => {
  const getRecordKey = (row: any) => String(row?.[primaryKey] ?? row?.id ?? row?._id ?? '');
  
  const getDetailedChanges = (): ChangeRecord[] => {
    const origMap = new Map(originalData.map(r => [getRecordKey(r), r]));
    const newMap = new Map(currentData.map(r => [getRecordKey(r), r]));
    const changes: ChangeRecord[] = [];

    // Find added records
    for (const [key, record] of newMap) {
      if (!origMap.has(key)) {
        changes.push({ type: 'added', key, record });
      }
    }

    // Find modified records
    for (const [key, newRecord] of newMap) {
      const originalRecord = origMap.get(key);
      if (originalRecord && JSON.stringify(originalRecord) !== JSON.stringify(newRecord)) {
        const fieldChanges: { field: string; oldValue: any; newValue: any }[] = [];
        
        // Compare each field
        const allFields = new Set([...Object.keys(originalRecord), ...Object.keys(newRecord)]);
        for (const field of allFields) {
          if (JSON.stringify(originalRecord[field]) !== JSON.stringify(newRecord[field])) {
            fieldChanges.push({
              field,
              oldValue: originalRecord[field],
              newValue: newRecord[field]
            });
          }
        }
        
        changes.push({
          type: 'modified',
          key,
          record: newRecord,
          originalRecord,
          changes: fieldChanges
        });
      }
    }

    // Find deleted records
    for (const [key, record] of origMap) {
      if (!newMap.has(key)) {
        changes.push({ type: 'deleted', key, record });
      }
    }

    return changes;
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  };

  const formatFieldName = (field: string): string => {
    return field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const changes = getDetailedChanges();

  if (changes.length === 0) {
    return null;
  }

  return (
    <ScrollArea className="max-h-[400px] w-full">
      <div className="space-y-3">
        {changes.map((change, index) => (
          <Card key={`${change.type}-${change.key}-${index}`} className="p-3">
            {change.type === 'added' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-green-600" />
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    New Record
                  </Badge>
                  <span className="text-sm font-mono text-muted-foreground">
                    {primaryKey}: {change.key}
                  </span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(change.record || {}).map(([field, value]) => (
                      <div key={field} className="flex justify-between">
                        <span className="font-medium text-green-700">
                          {formatFieldName(field)}:
                        </span>
                        <span className="text-green-900 font-mono">
                          {formatValue(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {change.type === 'modified' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Edit className="h-4 w-4 text-blue-600" />
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Modified Record
                  </Badge>
                  <span className="text-sm font-mono text-muted-foreground">
                    {primaryKey}: {change.key}
                  </span>
                </div>
                <div className="space-y-2">
                  {change.changes?.map((fieldChange, idx) => (
                    <div key={idx} className="border border-blue-200 rounded p-2">
                      <div className="text-xs font-medium text-blue-700 mb-1">
                        {formatFieldName(fieldChange.field)}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-red-50 border border-red-200 rounded p-1">
                          <div className="text-red-600 font-medium mb-1">Before:</div>
                          <div className="text-red-900 font-mono">
                            {formatValue(fieldChange.oldValue)}
                          </div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded p-1">
                          <div className="text-green-600 font-medium mb-1">After:</div>
                          <div className="text-green-900 font-mono">
                            {formatValue(fieldChange.newValue)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {change.type === 'deleted' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Minus className="h-4 w-4 text-red-600" />
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    Deleted Record
                  </Badge>
                  <span className="text-sm font-mono text-muted-foreground">
                    {primaryKey}: {change.key}
                  </span>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(change.record || {}).map(([field, value]) => (
                      <div key={field} className="flex justify-between">
                        <span className="font-medium text-red-700">
                          {formatFieldName(field)}:
                        </span>
                        <span className="text-red-900 font-mono">
                          {formatValue(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default DetailedChangeView;