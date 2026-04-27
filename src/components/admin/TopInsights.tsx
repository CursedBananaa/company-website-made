import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Back-End", value: 280, color: "hsl(280, 67%, 45%)" },
  { name: "AI", value: 320, color: "hsl(142, 76%, 36%)" },
  { name: "Front-End", value: 250, color: "hsl(45, 93%, 47%)" },
  { name: "UI&UX", value: 310, color: "hsl(190, 80%, 45%)" },
  { name: "Big Data", value: 180, color: "hsl(330, 70%, 50%)" },
  { name: "Flutter", value: 200, color: "hsl(250, 60%, 55%)" },
  { name: "Testing", value: 150, color: "hsl(25, 90%, 55%)" },
  { name: "web Dev", value: 220, color: "hsl(210, 80%, 50%)" },
  { name: "Markting", value: 280, color: "hsl(160, 60%, 40%)" },
  { name: "Socail", value: 320, color: "hsl(290, 60%, 50%)" },
  { name: "photo shop", value: 180, color: "hsl(15, 80%, 55%)" },
  { name: "cyber sec", value: 250, color: "hsl(260, 60%, 45%)" },
];

export function TopInsights() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top Insights</CardTitle>
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Filter className="h-4 w-4" />
          Filter By
        </button>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
