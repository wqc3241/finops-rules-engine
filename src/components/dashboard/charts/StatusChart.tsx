
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface StatusChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

// Colors for different status types
const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#F59E0B', '#10B981', '#6366F1'];

const StatusChart = ({ data }: StatusChartProps) => {
  return (
    <Card>
      <CardHeader className="p-3">
        <CardTitle className="text-base">Application Status Distribution</CardTitle>
        <CardDescription className="text-xs">Breakdown by current status</CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} applications`, 'Count']} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusChart;
