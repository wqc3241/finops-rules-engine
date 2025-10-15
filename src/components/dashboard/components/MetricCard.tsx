import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  config: {
    value?: number | string;
    label?: string;
    trend?: number;
    trendLabel?: string;
    format?: 'number' | 'currency' | 'percentage';
  };
  dataSource: string | null;
}

const MetricCard: React.FC<MetricCardProps> = ({ config, dataSource }) => {
  // Mock data
  const value = config.value || 1234;
  const label = config.label || 'Total Applications';
  const trend = config.trend || 12.5;
  const trendLabel = config.trendLabel || 'vs last month';
  const format = config.format || 'number';

  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percentage':
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  const isPositiveTrend = trend >= 0;

  return (
    <div className="flex flex-col justify-center items-center h-full p-4">
      <div className="text-4xl font-bold mb-2">{formatValue(value)}</div>
      <div className="text-sm text-muted-foreground mb-2">{label}</div>
      <div className={`flex items-center gap-1 text-sm ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
        {isPositiveTrend ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <TrendingDown className="h-4 w-4" />
        )}
        <span>{Math.abs(trend)}% {trendLabel}</span>
      </div>
    </div>
  );
};

export default MetricCard;
