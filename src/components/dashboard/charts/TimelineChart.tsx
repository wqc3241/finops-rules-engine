
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface TimelineChartProps {
  data: Array<{
    date: string;
    count: number;
  }>;
}

const TimelineChart = ({ data }: TimelineChartProps) => {
  // Format dates for better display
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }));

  return (
    <Card>
      <CardHeader className="p-3">
        <CardTitle className="text-base">Applications Over Time</CardTitle>
        <CardDescription className="text-xs">Number of applications submitted by date</CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedDate" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} applications`, 'Count']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                name="Applications"
                stroke="#8B5CF6" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineChart;
