import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { DataSourceConfig } from '@/types/dashboard';

interface GaugeRendererProps {
  config: {
    value?: number;
    max?: number;
    label?: string;
    colors?: string[];
  };
  dataSource: DataSourceConfig | null;
}

const GaugeRenderer: React.FC<GaugeRendererProps> = ({ config, dataSource }) => {
  const value = config.value || 75;
  const max = config.max || 100;
  const label = config.label || 'Completion Rate';
  const colors = config.colors || ['#9333EA', '#E5E7EB'];

  const percentage = (value / max) * 100;
  const data = [
    { name: 'value', value: percentage },
    { name: 'remaining', value: 100 - percentage },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <ResponsiveContainer width="100%" height="70%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={0}
            dataKey="value"
          >
            <Cell fill={colors[0]} />
            <Cell fill={colors[1]} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center">
        <div className="text-3xl font-bold">{value}%</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
};

export default GaugeRenderer;
