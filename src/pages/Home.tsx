import { ArrowUpRight, RefreshCw } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const recentActivities = [
  { icon: RefreshCw, text: "project A added" },
  { icon: RefreshCw, text: "Deadline For C changed" },
  { icon: RefreshCw, text: 'Member "Alan Cain" joined' },
];

export default function Home() {
  const navigate = useNavigate();

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

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
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

          <Card className="bg-secondary border-0">
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

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <activity.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">{activity.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/50 border-secondary">
            <CardHeader>
              <CardTitle className="text-lg">Quick Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => navigate("/projects")}
              >
                Add project
              </Button>
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => navigate("/applicants")}
              >
                View Applicant
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
