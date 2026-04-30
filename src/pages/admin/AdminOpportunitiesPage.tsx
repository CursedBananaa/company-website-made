import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminDashboardLayout } from "@/components/admin/DashboardLayout";
import { FileText, Clock, Edit, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Opportunity {
  id: string;
  title: string;
  company: string;
  tags: string[];
  duration: string;
  postedDays: number;
}

const THEMES = [
  { 
    cardGlow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:border-blue-500/50',
    buttonBg: 'bg-blue-500',
    buttonHover: 'hover:bg-blue-600',
    buttonGlow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]',
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10',
    titleColor: 'group-hover:text-blue-500 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]'
  },
  { 
    cardGlow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:border-emerald-500/50',
    buttonBg: 'bg-emerald-500',
    buttonHover: 'hover:bg-emerald-600',
    buttonGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-500/10',
    titleColor: 'group-hover:text-emerald-500 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'
  },
  { 
    cardGlow: 'hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:border-violet-500/50',
    buttonBg: 'bg-violet-500',
    buttonHover: 'hover:bg-violet-600',
    buttonGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.5)]',
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-500/10',
    titleColor: 'group-hover:text-violet-500 group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]'
  },
  { 
    cardGlow: 'hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:border-rose-500/50',
    buttonBg: 'bg-rose-500',
    buttonHover: 'hover:bg-rose-600',
    buttonGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.5)]',
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-500/10',
    titleColor: 'group-hover:text-rose-500 group-hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]'
  },
  { 
    cardGlow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:border-amber-500/50',
    buttonBg: 'bg-amber-500',
    buttonHover: 'hover:bg-amber-600',
    buttonGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-500/10',
    titleColor: 'group-hover:text-amber-500 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
  },
  { 
    cardGlow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:border-cyan-500/50',
    buttonBg: 'bg-cyan-500',
    buttonHover: 'hover:bg-cyan-600',
    buttonGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.5)]',
    iconColor: 'text-cyan-500',
    iconBg: 'bg-cyan-500/10',
    titleColor: 'group-hover:text-cyan-500 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]'
  }
];

const AdminOpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setIsLoading(true);
        const { data: opps } = await supabase
          .from("opportunity")
          .select("*, company_profile(user(full_name))")
          .order("created_at", { ascending: false });

        if (opps) {
          const formattedOpps = opps.map(opp => {
            // Calculate days ago
            const created = new Date(opp.created_at);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - created.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Parse tags
            const rawTags = opp.requirements ? opp.requirements.split(',').map((t: string) => t.trim()) : [];
            const tags = rawTags.filter((t: string) => t.length > 0).slice(0, 3); // limit to 3 tags

            // Get company name
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const companyName = (opp.company_profile as any)?.user?.full_name || "Unknown Company";

            return {
              id: opp.id.toString(),
              title: opp.title || "Untitled",
              company: companyName,
              tags: tags,
              duration: opp.duration ? `${opp.duration} days` : "Unknown duration",
              postedDays: diffDays,
            };
          });
          setOpportunities(formattedOpps);
        }
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Opportunities</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">Loading opportunities...</div>
          ) : opportunities.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">No opportunities found.</div>
          ) : (
            opportunities.map((opp, index) => {
              const theme = THEMES[index % THEMES.length];
              return (
              <div key={opp.id} className={`admin-opportunity-card group transition-all duration-300 ${theme.cardGlow}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    Posted {opp.postedDays} days ago
                  </span>
                  <Link
                    to={`/admin/opportunities/edit/${opp.id}`}
                    className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Link>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${theme.iconBg}`}>
                    <FileText className={`h-5 w-5 ${theme.iconColor}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-foreground leading-tight transition-all duration-300 ${theme.titleColor}`}>
                      {opp.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{opp.company}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {opp.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock className="h-4 w-4" />
                  <span>{opp.duration}</span>
                </div>

                <Link
                  to={`/admin/opportunities/${opp.id}/applicants`}
                  className={`block w-full text-center py-3 rounded-lg text-white font-medium transition-all duration-300 ${theme.buttonBg} ${theme.buttonHover} ${theme.buttonGlow} hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]`}
                >
                  View Applicant
                </Link>
              </div>
            )})
          )}
        </div>

        <Link
          to="/admin/opportunities/add"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
        >
          <Plus className="h-6 w-6 text-foreground" />
        </Link>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminOpportunitiesPage;
