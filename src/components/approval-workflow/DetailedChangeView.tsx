import React from "react";
import { TableData } from "@/types/dynamicTable";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

  const getChangedFields = (changes: { field: string; oldValue: any; newValue: any }[]): Set<string> => {
    return new Set(changes.map(c => c.field));
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  };

  const formatFieldName = (field: string): string => {
    return field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getAllFields = (changes: ChangeRecord[]): string[] => {
    const fieldsSet = new Set<string>();
    changes.forEach(change => {
      if (change.record) {
        Object.keys(change.record).forEach(field => fieldsSet.add(field));
      }
      if (change.originalRecord) {
        Object.keys(change.originalRecord).forEach(field => fieldsSet.add(field));
      }
    });
    return Array.from(fieldsSet).sort();
  };

  const renderChangeTable = (changeType: 'added' | 'modified' | 'deleted', typeChanges: ChangeRecord[]) => {
    if (typeChanges.length === 0) return null;

    const fields = getAllFields(typeChanges);
    const typeConfig = {
      added: {
        icon: Plus,
        label: 'New Records',
        badgeClass: 'bg-green-100 text-green-800',
        iconClass: 'text-green-600',
        rowClass: 'bg-green-50 hover:bg-green-100'
      },
      modified: {
        icon: Edit,
        label: 'Modified Records',
        badgeClass: 'bg-blue-100 text-blue-800',
        iconClass: 'text-blue-600',
        rowClass: 'bg-blue-50 hover:bg-blue-100'
      },
      deleted: {
        icon: Minus,
        label: 'Deleted Records',
        badgeClass: 'bg-red-100 text-red-800',
        iconClass: 'text-red-600',
        rowClass: 'bg-red-50 hover:bg-red-100'
      }
    };

    const config = typeConfig[changeType];
    const Icon = config.icon;

    return (
      <Card key={changeType} className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`h-4 w-4 ${config.iconClass}`} />
          <Badge variant="secondary" className={config.badgeClass}>
            {config.label} ({typeChanges.length})
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[80px] text-xs">{primaryKey}</TableHead>
                {fields.map(field => (
                  <TableHead key={field} className="min-w-[120px] text-xs">
                    {formatFieldName(field)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {typeChanges.map((change, index) => (
                <TableRow key={`${change.key}-${index}`} className={config.rowClass}>
                  <TableCell className="font-mono text-xs font-medium">
                    {change.key}
                  </TableCell>
                  {fields.map(field => {
                    const value = change.record?.[field];
                    
                    if (changeType === 'modified') {
                      const changedFields = getChangedFields(change.changes || []);
                      const isChanged = changedFields.has(field);
                      const fieldChange = change.changes?.find(c => c.field === field);
                      
                      return (
                        <TableCell key={field} className="text-xs">
                          {isChanged && fieldChange ? (
                            <div className="space-y-1">
                              <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-mono">
                                {formatValue(fieldChange.oldValue)}
                              </div>
                              <div className="text-center text-gray-400">↓</div>
                              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono">
                                {formatValue(fieldChange.newValue)}
                              </div>
                            </div>
                          ) : (
                            <span className="font-mono">
                              {formatValue(value)}
                            </span>
                          )}
                        </TableCell>
                      );
                    }
                    
                    return (
                      <TableCell key={field} className="font-mono text-xs">
                        {formatValue(value)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    );
  };

  const changes = getDetailedChanges();

  if (changes.length === 0) {
    return null;
  }

  const changesByType = {
    added: changes.filter(c => c.type === 'added'),
    modified: changes.filter(c => c.type === 'modified'),
    deleted: changes.filter(c => c.type === 'deleted')
  };

  return (
    <ScrollArea className="max-h-[400px] w-full">
      <div className="space-y-4">
        {renderChangeTable('added', changesByType.added)}
        {renderChangeTable('modified', changesByType.modified)}
        {renderChangeTable('deleted', changesByType.deleted)}
      </div>
    </ScrollArea>
  );
};

export default DetailedChangeView;