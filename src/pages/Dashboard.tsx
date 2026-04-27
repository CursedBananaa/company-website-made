import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/contexts/ProfileContext";

interface OpportunityApp {
  name: string;
  status: "active" | "pending" | "complete" | "draft" | string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const COLORS = [
  "hsl(280, 67%, 45%)", // Purple
  "hsl(142, 76%, 36%)", // Green
  "hsl(45, 93%, 47%)",  // Yellow
  "hsl(190, 80%, 45%)", // Cyan
  "hsl(330, 70%, 50%)", // Pink
  "hsl(250, 60%, 55%)", // Indigo
  "hsl(25, 90%, 55%)",  // Orange
  "hsl(210, 80%, 50%)", // Blue
  "hsl(160, 60%, 40%)", // Teal
  "hsl(290, 60%, 50%)", // Magenta
  "hsl(15, 80%, 55%)",  // Red-Orange
  "hsl(220, 14%, 80%)", // Gray
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    completedProjects: 0,
    opportunities: 0,
    totalProjects: 0,
  });
  const [recentApps, setRecentApps] = useState<OpportunityApp[]>([]);
  const [progressData, setProgressData] = useState<ChartData[]>([]);
  const [insightsData, setInsightsData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useProfile();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!profile.companyId) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);

        const { data: myOpportunities } = await supabase
          .from("opportunity")
          .select("id")
          .eq("company_id", profile.companyId);
        
        const opportunityIds = myOpportunities?.map(o => o.id) || [];

        // 1. Fetch Stats
        const [
          { count: studentsCount },
          { count: completedCount },
          { count: oppsCount },
          { count: assignCount }
        ] = await Promise.all([
          supabase.from("user").select("*", { count: "exact", head: true }).eq("role", "student"),
          opportunityIds.length > 0 ? supabase.from("completed_opportunity").select("*", { count: "exact", head: true }).in("opportunity_id", opportunityIds) : { count: 0 },
          supabase.from("opportunity").select("*", { count: "exact", head: true }).eq("company_id", profile.companyId),
          opportunityIds.length > 0 ? supabase.from("assignment").select("*", { count: "exact", head: true }).in("opportunity_id", opportunityIds) : { count: 0 }
        ]);

        setStats({
          totalStudents: studentsCount || 0,
          completedProjects: completedCount || 0,
          opportunities: oppsCount || 0,
          totalProjects: assignCount || 0,
        });

        // 2. Fetch Recent Applications
        let appsData = null;
        if (opportunityIds.length > 0) {
          const { data } = await supabase
            .from("application")
            .select("status, user:student_id(full_name)")
            .in("opportunity_id", opportunityIds)
            .order("created_at", { ascending: false })
            .limit(5);
          appsData = data;
        }

        if (appsData) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedApps = appsData.map((app: any) => ({
            name: app.user?.full_name || "Unknown Student",
            status: app.status || "pending",
          }));
          setRecentApps(formattedApps);
        }

        // 3. Projects Progress (Grouped by application status)
        let allApps = null;
        if (opportunityIds.length > 0) {
          const { data } = await supabase
            .from("application")
            .select("status")
            .in("opportunity_id", opportunityIds);
          allApps = data;
        }
        if (allApps) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const statusCounts = allApps.reduce((acc: any, app) => {
            const status = (app.status || "UNKNOWN").toUpperCase();
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {});

          const progressChart = Object.keys(statusCounts).map((key, index) => ({
            name: key,
            value: statusCounts[key],
            color: COLORS[index % COLORS.length]
          }));
          setProgressData(progressChart);
        }

        // 4. Top Insights (Student Skills)
        const { data: skillsData } = await supabase.from("student_skills").select("skill_name");
        if (skillsData) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const skillCounts = skillsData.reduce((acc: any, skill) => {
            const name = skill.skill_name || "Unknown";
            acc[name] = (acc[name] || 0) + 1;
            return acc;
          }, {});

          // Sort by count descending and take top 12
          const sortedSkills = Object.keys(skillCounts)
            .map(key => ({ name: key, count: skillCounts[key] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 12);

          const insightsChart = sortedSkills.map((skill, index) => ({
            name: skill.name,
            value: skill.count,
            color: COLORS[index % COLORS.length]
          }));
          setInsightsData(insightsChart);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [profile.companyId]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            title="Total Student"
            value={isLoading ? "..." : stats.totalStudents.toLocaleString()}
            change=""
            changeType="positive"
            className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-none shadow-lg shadow-purple-500/50 [&_p.text-muted-foreground]:text-white/80 [&_p.font-semibold]:text-white"
          />
          <StatCard
            title="No Of Completed Projects"
            value={isLoading ? "..." : stats.completedProjects.toLocaleString()}
            change=""
            changeType="positive"
            className="bg-gradient-to-br from-pink-500 to-rose-600 text-white border-none shadow-lg shadow-pink-500/50 [&_p.text-muted-foreground]:text-white/80 [&_p.font-semibold]:text-white"
          />
          <StatCard
            title="Opportunities"
            value={isLoading ? "..." : stats.opportunities.toLocaleString()}
            change=""
            changeType="positive"
            className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-none shadow-lg shadow-blue-500/50 [&_p.text-muted-foreground]:text-white/80 [&_p.font-semibold]:text-white"
          />
          <StatCard
            title="Total Projects"
            value={isLoading ? "..." : stats.totalProjects.toLocaleString()}
            change=""
            changeType="positive"
            className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-none shadow-lg shadow-orange-500/50 [&_p.text-muted-foreground]:text-white/80 [&_p.font-semibold]:text-white"
          />
        </div>

        {/* Opportunities & Progress */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : recentApps.length > 0 ? (
                recentApps.map((opp, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                      <span className="text-sm">{opp.name}</span>
                    </div>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <StatusBadge status={opp.status as any} />
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No applications found.</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projects Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <div className="w-40 h-40">
                  {isLoading ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading...</div>
                  ) : progressData.length > 0 ? (
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
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No data</div>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  {!isLoading && progressData.map((item, index) => (
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
        </div>

        {/* Top Insights Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Insights (Skills)</CardTitle>
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <Filter className="h-4 w-4" />
              Filter By
            </button>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {isLoading ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading...</div>
              ) : insightsData.length > 0 ? (
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
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No data available</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
