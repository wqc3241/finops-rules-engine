
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ApprovalRatesChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const ApprovalRatesChart = ({ data }: ApprovalRatesChartProps) => {
  return (
    <Card>
      <CardHeader className="p-3">
        <CardTitle className="text-base">Approval Rates by Type</CardTitle>
        <CardDescription className="text-xs">Percentage of approved applications by type</CardDescription>
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
              <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value) => [`${value}%`, 'Approval Rate']} />
              <Legend />
              <Bar dataKey="value" name="Approval Rate (%)" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApprovalRatesChart;
