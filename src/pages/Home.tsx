import { useState, useEffect } from "react";
import { ArrowUpRight, RefreshCw, Wallet, UserPlus, Clock, Briefcase, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AddProjectDialog } from "@/components/AddProjectDialog";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/contexts/ProfileContext";

interface Activity {
  icon: any;
  text: string;
  time: string;
}

export default function Home() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    newApplicants: 0,
    nearDeadline: 0,
    opportunities: 0,
    completedProjects: 0,
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!profile.companyId) {
      setIsLoading(false);
      return;
    }
    fetchHomeData();
  }, [profile.companyId]);

  const fetchHomeData = async () => {
    try {
      setIsLoading(true);

      // Get all opportunities for this company
      const { data: myOpps } = await supabase
        .from("opportunity")
        .select("id, title, deadline")
        .eq("company_id", profile.companyId);

      const oppIds = myOpps?.map((o) => o.id) || [];

      // Parallel fetches
      const [
        { count: pendingCount },
        { count: oppsCount },
        { count: completedCount },
        { data: recentApps },
      ] = await Promise.all([
        // New (pending) applicants
        oppIds.length > 0
          ? supabase
              .from("application")
              .select("*", { count: "exact", head: true })
              .in("opportunity_id", oppIds)
              .eq("status", "pending")
          : { count: 0 },

        // Total opportunities
        supabase
          .from("opportunity")
          .select("*", { count: "exact", head: true })
          .eq("company_id", profile.companyId),

        // Completed projects
        oppIds.length > 0
          ? supabase
              .from("completed_opportunity")
              .select("*", { count: "exact", head: true })
              .in("opportunity_id", oppIds)
          : { count: 0 },

        // Recent applications for activity feed
        oppIds.length > 0
          ? supabase
              .from("application")
              .select(
                `
                status,
                created_at,
                opportunity ( title ),
                student_profile (
                  user ( full_name )
                )
              `
              )
              .in("opportunity_id", oppIds)
              .order("created_at", { ascending: false })
              .limit(10)
          : { data: [] },
      ]);

      // Near deadline: opportunities with deadline within next 7 days
      const now = new Date();
      const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const nearDeadlineCount =
        myOpps?.filter((opp) => {
          if (!opp.deadline) return false;
          const dl = new Date(opp.deadline);
          return dl >= now && dl <= in7Days;
        }).length || 0;

      setStats({
        newApplicants: pendingCount || 0,
        nearDeadline: nearDeadlineCount,
        opportunities: oppsCount || 0,
        completedProjects: completedCount || 0,
      });

      // Build activity feed from real applications
      const activities: Activity[] = (recentApps || []).map((app: any) => {
        const studentName = app.student_profile?.user?.full_name || "A student";
        const projectTitle = app.opportunity?.title || "a project";
        const timeAgo = getTimeAgo(app.created_at);

        let icon = RefreshCw;
        let text = "";

        switch (app.status) {
          case "pending":
            icon = UserPlus;
            text = `${studentName} applied to "${projectTitle}"`;
            break;
          case "ongoing":
            icon = Briefcase;
            text = `${studentName} started training at "${projectTitle}"`;
            break;
          case "completed":
          case "completed_by_company":
            icon = CheckCircle;
            text = `${studentName} completed "${projectTitle}"`;
            break;
          case "rejected":
            icon = RefreshCw;
            text = `Application from ${studentName} was rejected`;
            break;
          default:
            icon = RefreshCw;
            text = `${studentName} updated status on "${projectTitle}"`;
        }

        return { icon, text, time: timeAgo };
      });

      setRecentActivities(activities);
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-semibold">Welcome Back!</h1>
          <p className="text-muted-foreground">
            Here is a quick look of what is happening today.
          </p>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Action</h2>
          <div className="flex gap-4">
            <Button
              className="bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 px-6 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300"
              onClick={() => setIsAddProjectOpen(true)}
            >
              Add project
            </Button>
            <Button
              className="bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 shadow-lg shadow-green-500/50 hover:shadow-green-500/70 transition-all duration-300"
              onClick={() => navigate("/applicants")}
            >
              View Applicant
            </Button>
            <Button
              className="bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70 transition-all duration-300"
              onClick={() => navigate("/payment")}
            >
              <Wallet className="h-4 w-4 mr-2" />
              PAY
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Recent Activity - Left Side */}
          <div className="col-span-8">
            <Card className="border border-border h-full hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:border-primary/50 transition-all duration-500">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading activity...</p>
                ) : recentActivities.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent activity yet.</p>
                ) : (
                  <div className="space-y-1">
                    {recentActivities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0 hover:bg-muted/50 hover:pl-2 transition-all duration-200 rounded-lg"
                      >
                        <activity.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm flex-1">{activity.text}</span>
                        <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards - Right Side */}
          <div className="col-span-4 space-y-4">
            <Card
              className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-none shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 cursor-pointer group"
              onClick={() => navigate("/applicants")}
            >
              <CardContent className="p-4">
                <p className="text-sm text-white/80">You have</p>
                <p className="text-lg font-medium">
                  {isLoading ? "..." : `${stats.newApplicants} new applicant${stats.newApplicants !== 1 ? "s" : ""}`}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm cursor-pointer hover:underline">View</span>
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-gradient-to-br from-pink-500 to-rose-600 text-white border-none shadow-lg shadow-pink-500/50 hover:shadow-pink-500/70 transition-all duration-300 cursor-pointer group"
              onClick={() => navigate("/projects")}
            >
              <CardContent className="p-4">
                <p className="text-sm text-white/80">
                  {isLoading ? "..." : `${stats.nearDeadline} Project${stats.nearDeadline !== 1 ? "s" : ""} ${stats.nearDeadline === 1 ? "is" : "are"}`}
                </p>
                <p className="text-lg font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Near Deadline
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm cursor-pointer hover:underline">View</span>
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
              </CardContent>
            </Card>

            <div
              className="hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
              onClick={() => navigate("/projects")}
            >
              <StatCard
                title="Opportunities"
                value={isLoading ? "..." : stats.opportunities.toLocaleString()}
                change=""
                changeType="positive"
                className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-none shadow-lg shadow-purple-500/50 [&_p.text-muted-foreground]:text-white/80 [&_p.font-semibold]:text-white"
              />
            </div>

            <div className="hover:scale-[1.02] transition-transform duration-300">
              <StatCard
                title="No Of Completed Projects"
                value={isLoading ? "..." : stats.completedProjects.toLocaleString()}
                change=""
                changeType="positive"
                className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-none shadow-lg shadow-orange-500/50 [&_p.text-muted-foreground]:text-white/80 [&_p.font-semibold]:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <AddProjectDialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen} />
    </DashboardLayout>
  );
}
