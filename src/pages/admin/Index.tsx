import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { StatCard } from "@/components/admin/StatCard";
import { AvailableOpportunities } from "@/components/admin/AvailableOpportunities";
import { StudentProgress } from "@/components/admin/StudentProgress";
import { TopInsights } from "@/components/admin/TopInsights";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Total Student"
            value="7,265"
            change="+11.01%"
            changeType="positive"
            className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-none shadow-lg shadow-purple-500/50 [&_p.text-muted-foreground]:text-white/80 [&_p.font-semibold]:text-white"
          />
          <StatCard
            label="No Of Completed Projects"
            value="3,671"
            change="+6.08%"
            changeType="positive"
            className="bg-gradient-to-br from-pink-500 to-rose-600 text-white border-none shadow-lg shadow-pink-500/50 [&_p.text-muted-foreground]:text-white/80 [&_p.font-semibold]:text-white"
          />
          <StatCard
            label="Opportunities"
            value="7,265"
            change="+11.01%"
            changeType="positive"
            className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-none shadow-lg shadow-blue-500/50 [&_p.text-muted-foreground]:text-white/80 [&_p.font-semibold]:text-white"
          />
          <StatCard
            label="Total Projects"
            value="3,671"
            change="-0.03%"
            changeType="negative"
            className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-none shadow-lg shadow-orange-500/50 [&_p.text-muted-foreground]:text-white/80 [&_p.font-semibold]:text-white"
          />
        </div>

        {/* Opportunities & Progress */}
        <div className="grid grid-cols-2 gap-6">
          <AvailableOpportunities />
          <StudentProgress />
        </div>

        {/* Top Insights Chart */}
        <TopInsights />
      </div>
    </DashboardLayout>
  );
};

export default Index;
