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
          <h1 className="text-2xl font-semibold">welcom back, MicroSoft</h1>
          <p className="text-muted-foreground">
            Here is a quick look what is happening today&gt;
          </p>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Action</h2>
          <div className="flex gap-4">
            <Button
              className="bg-primary hover:bg-primary/90 px-6"
              onClick={() => setIsAddProjectOpen(true)}
            >
              Add project
            </Button>
            <Button
              className="bg-chart-green hover:bg-chart-green/90 text-success-foreground px-6"
              onClick={() => navigate("/applicants")}
            >
              View Applicant
            </Button>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6"
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
            <Card className="border border-border h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {recentActivities.map((activity, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0"
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
            <Card className="border border-border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">You have</p>
                <p className="text-lg font-medium">3 new applicant</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-primary cursor-pointer hover:underline">
                    View
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/50 border-0">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">2 Project are</p>
                <p className="text-lg font-medium">Near Deadline</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-primary cursor-pointer hover:underline">
                    View
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <StatCard
              title="Opportunities"
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
          </div>
        </div>
      </div>

      <AddProjectDialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen} />
    </DashboardLayout>
  );
}
