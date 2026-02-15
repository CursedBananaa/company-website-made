import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const opportunities = [
  { name: "Christine Brooks", status: "active" as const },
  { name: "Rosie Todd", status: "pending" as const },
  { name: "Rosie Pearson", status: "complete" as const },
  { name: ".........................", status: "draft" as const },
];

const progressData = [
  { name: "Completed", value: 52.1, color: "hsl(280, 67%, 45%)" },
  { name: "PENDING", value: 22.8, color: "hsl(45, 93%, 47%)" },
  { name: "ACTIVE", value: 13.9, color: "hsl(142, 76%, 36%)" },
  { name: "DRAFT", value: 11.2, color: "hsl(220, 14%, 80%)" },
];

const insightsData = [
  { name: "Back-End", value: 280, color: "hsl(280, 67%, 45%)" },
  { name: "AI", value: 320, color: "hsl(142, 76%, 36%)" },
  { name: "Front-End", value: 250, color: "hsl(45, 93%, 47%)" },
  { name: "UI&UX", value: 310, color: "hsl(190, 80%, 45%)" }, // Cyan
  { name: "Big Data", value: 180, color: "hsl(330, 70%, 50%)" }, // Pink
  { name: "Flutter", value: 200, color: "hsl(250, 60%, 55%)" }, // Purple
  { name: "Testing", value: 150, color: "hsl(25, 90%, 55%)" }, // Orange
  { name: "web Dev", value: 220, color: "hsl(210, 80%, 50%)" }, // Blue
  { name: "Markting", value: 280, color: "hsl(160, 60%, 40%)" }, // Green
  { name: "Socail", value: 320, color: "hsl(290, 60%, 50%)" }, // Magenta
  { name: "photo shop", value: 180, color: "hsl(15, 80%, 55%)" }, // Red-Orange
  { name: "cyber suc", value: 250, color: "hsl(260, 60%, 45%)" }, // Indigo
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            title="Total Student"
            value="7,265"
            change="+11.01%"
            changeType="positive"
            className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-none shadow-lg shadow-purple-500/50 [&_p.text-muted-foreground]:text-white/80 [&_p.font-semibold]:text-white"
          />
          <StatCard
            title="No Of Completed Projects"
            value="3,671"
            change="+6.08%"
            changeType="positive"
            className="bg-gradient-to-br from-pink-500 to-rose-600 text-white border-none shadow-lg shadow-pink-500/50 [&_p.text-muted-foreground]:text-white/80 [&_p.font-semibold]:text-white"
          />
          <StatCard
            title="Opportunities"
            value="7,265"
            change="+11.01%"
            changeType="positive"
            className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-none shadow-lg shadow-blue-500/50 [&_p.text-muted-foreground]:text-white/80 [&_p.font-semibold]:text-white"
          />
          <StatCard
            title="Total Projects"
            value="3,671"
            change="-0.03%"
            changeType="negative"
            className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-none shadow-lg shadow-orange-500/50 [&_p.text-muted-foreground]:text-white/80 [&_p.font-semibold]:text-white"
          />
        </div>

        {/* Opportunities & Progress */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {opportunities.map((opp, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                    <span className="text-sm">{opp.name}</span>
                  </div>
                  <StatusBadge status={opp.status} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projects Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <div className="w-40 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={progressData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {progressData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {progressData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="font-medium ml-auto">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Insights Chart */}
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
                <BarChart data={insightsData}>
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
                  <Bar
                    dataKey="value"
                    radius={[4, 4, 0, 0]}
                  >
                    {insightsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
