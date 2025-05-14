
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ApplicationTypeChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const ApplicationTypeChart = ({ data }: ApplicationTypeChartProps) => {
  return (
    <Card>
      <CardHeader className="p-3">
        <CardTitle className="text-base">Application Types</CardTitle>
        <CardDescription className="text-xs">Distribution between lease and loan applications</CardDescription>
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
              <Tooltip formatter={(value) => [`${value} applications`, 'Count']} />
              <Legend />
              <Bar dataKey="value" name="Applications" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationTypeChart;
