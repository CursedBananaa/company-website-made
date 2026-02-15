import { useState } from "react";
import { ArrowUpRight, RefreshCw, Wallet } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AddProjectDialog } from "@/components/AddProjectDialog";

const recentActivities = [
  { icon: RefreshCw, text: "project A added" },
  { icon: RefreshCw, text: "Deadline For C changed" },
  { icon: RefreshCw, text: 'Member "Alan Cain" joined' },
  { icon: RefreshCw, text: "Deadline For C changed" },
  { icon: RefreshCw, text: "project A added" },
  { icon: RefreshCw, text: "Deadline For C changed" },
  { icon: RefreshCw, text: 'Member "Alan Cain" joined' },
  { icon: RefreshCw, text: "Deadline For C changed" },
  { icon: RefreshCw, text: "Deadline For C changed" },
];

export default function Home() {
  const navigate = useNavigate();
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

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
                <div className="space-y-1">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0 hover:bg-muted/50 hover:pl-2 transition-all duration-200 rounded-lg"
                    >
                      <activity.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{activity.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards - Right Side */}
          <div className="col-span-4 space-y-4">
            <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-none shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-4">
                <p className="text-sm text-white/80">You have</p>
                <p className="text-lg font-medium">3 new applicant</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm cursor-pointer hover:underline">
                    View
                  </span>
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white border-none shadow-lg shadow-pink-500/50 hover:shadow-pink-500/70 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-4">
                <p className="text-sm text-white/80">2 Project are</p>
                <p className="text-lg font-medium">Near Deadline</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm cursor-pointer hover:underline">
                    View
                  </span>
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
              </CardContent>
            </Card>

            <div className="hover:scale-[1.02] transition-transform duration-300">
              <StatCard
                title="Opportunities"
                value="7,265"
                change="+11.01%"
                changeType="positive"
                className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-none shadow-lg shadow-purple-500/50 [&_p.text-muted-foreground]:text-white/80 [&_p.font-semibold]:text-white"
              />
            </div>

            <div className="hover:scale-[1.02] transition-transform duration-300">
              <StatCard
                title="No Of Completed Projects"
                value="3,671"
                change="+6.08%"
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
