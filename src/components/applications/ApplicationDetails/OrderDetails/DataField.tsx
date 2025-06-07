
import React from 'react';

interface DataFieldProps {
  label: string;
  value: string;
}

export const DataField: React.FC<DataFieldProps> = ({ label, value }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);
