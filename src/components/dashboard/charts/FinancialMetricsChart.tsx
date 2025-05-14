
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface FinancialMetricsChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const FinancialMetricsChart = ({ data }: FinancialMetricsChartProps) => {
  return (
    <Card>
      <CardHeader className="p-3">
        <CardTitle className="text-base">Financial Metrics</CardTitle>
        <CardDescription className="text-xs">Key financial metrics across applications</CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
              <Legend />
              <Bar dataKey="value" name="Amount ($)" fill="#0EA5E9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialMetricsChart;
