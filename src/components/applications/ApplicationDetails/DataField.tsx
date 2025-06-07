
import React from 'react';

interface DataFieldProps {
  label: string;
  value: string;
}

const DataField: React.FC<DataFieldProps> = ({ label, value }) => (
  <div className="flex">
    <span className="text-xs text-muted-foreground min-w-[140px]">{label}</span>
    <span className="text-xs font-medium">{value}</span>
  </div>
);

export default DataField;
