
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface StatusTransitionChartProps {
  data: Array<{
    status: string;
    averageDays: number;
  }>;
}

const StatusTransitionChart = ({ data }: StatusTransitionChartProps) => {
  return (
    <Card>
      <CardHeader className="p-3">
        <CardTitle className="text-base">Status Transition Times</CardTitle>
        <CardDescription className="text-xs">Average days spent in each application status</CardDescription>
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
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} days`, 'Average Time']} />
              <Legend />
              <Bar dataKey="averageDays" name="Average Days" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusTransitionChart;
