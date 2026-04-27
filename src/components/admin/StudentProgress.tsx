import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface StudentProgressProps {
  data?: ChartData[];
  isLoading?: boolean;
}

export function StudentProgress({ data = [], isLoading = false }: StudentProgressProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          <div className="w-40 h-40">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading...</div>
            ) : data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No data</div>
            )}
          </div>
          <div className="space-y-2 flex-1">
            {!isLoading && data.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground truncate" title={item.name}>{item.name}</span>
                <span className="font-medium ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
