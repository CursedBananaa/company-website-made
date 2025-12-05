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
  { name: "UI&UX", value: 310, color: "hsl(280, 67%, 45%)" },
  { name: "Big Data", value: 180, color: "hsl(0, 0%, 20%)" },
  { name: "Flutter", value: 200, color: "hsl(280, 67%, 45%)" },
  { name: "Testing", value: 150, color: "hsl(0, 0%, 20%)" },
  { name: "web Dev", value: 220, color: "hsl(280, 67%, 45%)" },
  { name: "Markting", value: 280, color: "hsl(0, 0%, 20%)" },
  { name: "Socail", value: 320, color: "hsl(280, 67%, 45%)" },
  { name: "photo shop", value: 180, color: "hsl(0, 0%, 20%)" },
  { name: "cyber suc", value: 250, color: "hsl(280, 67%, 45%)" },
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
          />
          <StatCard
            title="No Of Completed Projects"
            value="3,671"
            change="+6.08%"
            changeType="positive"
            variant="pink"
          />
          <StatCard
            title="Opportunities"
            value="7,265"
            change="+11.01%"
            changeType="positive"
          />
          <StatCard
            title="Total Projects"
            value="3,671"
            change="-0.03%"
            changeType="negative"
            variant="pink"
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
                    fill="hsl(var(--chart-purple))"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
