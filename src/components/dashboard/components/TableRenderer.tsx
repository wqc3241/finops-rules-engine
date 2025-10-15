import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TableRendererProps {
  config: {
    columns?: string[];
    sortable?: boolean;
  };
  dataSource: string | null;
}

// Mock data
const MOCK_DATA = [
  { id: 1, name: 'Application #1234', status: 'Approved', amount: '$25,000', date: '2025-01-15' },
  { id: 2, name: 'Application #1235', status: 'Pending', amount: '$30,000', date: '2025-01-16' },
  { id: 3, name: 'Application #1236', status: 'Declined', amount: '$15,000', date: '2025-01-17' },
  { id: 4, name: 'Application #1237', status: 'Approved', amount: '$45,000', date: '2025-01-18' },
];

const TableRenderer: React.FC<TableRendererProps> = ({ config, dataSource }) => {
  const data = MOCK_DATA;
  
  if (data.length === 0) {
    return <div className="text-center text-muted-foreground p-4">No data available</div>;
  }

  const columns = config.columns || Object.keys(data[0]);

  return (
    <div className="overflow-auto max-h-full">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column} className="capitalize">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row: any, idx) => (
            <TableRow key={idx}>
              {columns.map((column) => (
                <TableCell key={column}>{row[column]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableRenderer;
