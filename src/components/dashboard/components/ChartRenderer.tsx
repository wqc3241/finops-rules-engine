import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { dashboardDataService } from '@/services/dashboardDataService';
import { DataSourceConfig, VisualizationConfig } from '@/types/dashboard';

interface ChartRendererProps {
  config: VisualizationConfig;
  dataSource: DataSourceConfig | null;
}

// Mock data for demonstration
const MOCK_DATA = [
  { month: 'Jan', count: 65, amount: 12000 },
  { month: 'Feb', count: 59, amount: 15000 },
  { month: 'Mar', count: 80, amount: 18000 },
  { month: 'Apr', count: 81, amount: 20000 },
  { month: 'May', count: 56, amount: 16000 },
  { month: 'Jun', count: 55, amount: 14000 },
];

const DEFAULT_COLORS = ['#9333EA', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

const ChartRenderer: React.FC<ChartRendererProps> = ({ config, dataSource }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await dashboardDataService.fetchData(dataSource);
        setData(result.length > 0 ? result : MOCK_DATA);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
        setData(MOCK_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataSource]);

  if (loading) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Loading...</div>;
  }

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>;
  }

  const chartType = config.chartType || 'bar';
  const xAxis = config.xAxis || 'month';
  const yAxis = typeof config.yAxis === 'string' ? config.yAxis : (config.yAxis?.[0] || 'count');
  const colors = config.colors || DEFAULT_COLORS;
  const showLegend = config.legend !== false;
  const showTooltip = config.tooltip !== false;
  const showGrid = config.grid?.horizontal !== false;

  const commonProps = {
    data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxis} />
            <YAxis />
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            <Line type="monotone" dataKey={yAxis} stroke={colors[0]} strokeWidth={2} />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxis} />
            <YAxis />
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            <Area type="monotone" dataKey={yAxis} stroke={colors[0]} fill={colors[0]} fillOpacity={0.6} />
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={yAxis}
              nameKey={xAxis}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
          </PieChart>
        );

      case 'bar':
      default:
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxis} />
            <YAxis />
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            <Bar dataKey={yAxis} fill={colors[0]} />
          </BarChart>
        );
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {renderChart()}
    </ResponsiveContainer>
  );
};

export default ChartRenderer;
