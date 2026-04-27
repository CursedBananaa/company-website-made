import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/admin/DashboardLayout";
import { AdminStatCard } from "@/components/admin/StatCard";
import { AvailableOpportunities, AdminOpportunityApp } from "@/components/admin/AvailableOpportunities";
import { StudentProgress, ChartData } from "@/components/admin/StudentProgress";
import { TopInsights } from "@/components/admin/TopInsights";
import { supabase } from "@/integrations/supabase/client";

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

const AdminIndex = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    completedProjects: 0,
    opportunities: 0,
    totalProjects: 0,
  });
  const [recentApps, setRecentApps] = useState<AdminOpportunityApp[]>([]);
  const [progressData, setProgressData] = useState<ChartData[]>([]);
  const [insightsData, setInsightsData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setIsLoading(true);

        // 1. Fetch Global Stats
        const [
          { count: studentsCount },
          { count: completedCount },
          { count: oppsCount },
          { count: assignCount }
        ] = await Promise.all([
          supabase.from("user").select("*", { count: "exact", head: true }).eq("role", "student"),
          supabase.from("completed_opportunity").select("*", { count: "exact", head: true }),
          supabase.from("opportunity").select("*", { count: "exact", head: true }),
          supabase.from("assignment").select("*", { count: "exact", head: true })
        ]);

        setStats({
          totalStudents: studentsCount || 0,
          completedProjects: completedCount || 0,
          opportunities: oppsCount || 0,
          totalProjects: assignCount || 0,
        });

        // 2. Fetch Recent Applications (Global)
        const { data: appsData } = await supabase
          .from("application")
          .select("status, user:student_id(full_name)")
          .order("created_at", { ascending: false })
          .limit(5);

        if (appsData) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedApps = appsData.map((app: any) => ({
            name: app.user?.full_name || "Unknown Student",
            status: app.status || "pending",
            statusLabel: (app.status || "PENDING").toUpperCase(),
          }));
          setRecentApps(formattedApps);
        }

        // 3. Projects Progress (Global grouped by application status)
        const { data: allApps } = await supabase.from("application").select("status");
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

        // 4. Top Insights (Global Student Skills)
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
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <AdminStatCard
            label="Total Student"
            value={isLoading ? "..." : stats.totalStudents.toLocaleString()}
            change=""
            changeType="positive"
            className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-none shadow-lg shadow-purple-500/50 [&_p.text-muted-foreground]:text-white/80 [&_p.font-semibold]:text-white"
          />
          <AdminStatCard
            label="No Of Completed Projects"
            value={isLoading ? "..." : stats.completedProjects.toLocaleString()}
            change=""
            changeType="positive"
            className="bg-gradient-to-br from-pink-500 to-rose-600 text-white border-none shadow-lg shadow-pink-500/50 [&_p.text-muted-foreground]:text-white/80 [&_p.font-semibold]:text-white"
          />
          <AdminStatCard
            label="Opportunities"
            value={isLoading ? "..." : stats.opportunities.toLocaleString()}
            change=""
            changeType="positive"
            className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-none shadow-lg shadow-blue-500/50 [&_p.text-muted-foreground]:text-white/80 [&_p.font-semibold]:text-white"
          />
          <AdminStatCard
            label="Total Projects"
            value={isLoading ? "..." : stats.totalProjects.toLocaleString()}
            change=""
            changeType="positive"
            className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-none shadow-lg shadow-orange-500/50 [&_p.text-muted-foreground]:text-white/80 [&_p.font-semibold]:text-white"
          />
        </div>

        {/* Opportunities & Progress */}
        <div className="grid grid-cols-2 gap-6">
          <AvailableOpportunities opportunities={recentApps} isLoading={isLoading} />
          <StudentProgress data={progressData} isLoading={isLoading} />
        </div>

        {/* Top Insights Chart */}
        <TopInsights data={insightsData} isLoading={isLoading} />
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminIndex;
