import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AdminDashboardLayout } from "@/components/admin/DashboardLayout";
import { FileText, Clock, Edit, Plus, Trash2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useNavigate } from "react-router-dom";
import { AddProjectDialog } from "@/components/AddProjectDialog";
import { Input } from "@/components/ui/input";

interface Opportunity {
  id: string;
  title: string;
  company: string;
  tags: string[];
  duration: string;
  postedDays: number;
  raw: any;
}

const THEMES = [
  {
    cardGlow:
      "hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:border-blue-500/50",
    buttonBg: "bg-blue-500",
    buttonHover: "hover:bg-blue-600",
    buttonGlow: "shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    titleColor:
      "group-hover:text-blue-500 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]",
  },
  {
    cardGlow:
      "hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:border-emerald-500/50",
    buttonBg: "bg-emerald-500",
    buttonHover: "hover:bg-emerald-600",
    buttonGlow: "shadow-[0_0_15px_rgba(16,185,129,0.5)]",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    titleColor:
      "group-hover:text-emerald-500 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]",
  },
  {
    cardGlow:
      "hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:border-violet-500/50",
    buttonBg: "bg-violet-500",
    buttonHover: "hover:bg-violet-600",
    buttonGlow: "shadow-[0_0_15px_rgba(139,92,246,0.5)]",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
    titleColor:
      "group-hover:text-violet-500 group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]",
  },
  {
    cardGlow:
      "hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:border-rose-500/50",
    buttonBg: "bg-rose-500",
    buttonHover: "hover:bg-rose-600",
    buttonGlow: "shadow-[0_0_15px_rgba(244,63,94,0.5)]",
    iconColor: "text-rose-500",
    iconBg: "bg-rose-500/10",
    titleColor:
      "group-hover:text-rose-500 group-hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]",
  },
  {
    cardGlow:
      "hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:border-amber-500/50",
    buttonBg: "bg-amber-500",
    buttonHover: "hover:bg-amber-600",
    buttonGlow: "shadow-[0_0_15px_rgba(245,158,11,0.5)]",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    titleColor:
      "group-hover:text-amber-500 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]",
  },
  {
    cardGlow:
      "hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:border-cyan-500/50",
    buttonBg: "bg-cyan-500",
    buttonHover: "hover:bg-cyan-600",
    buttonGlow: "shadow-[0_0_15px_rgba(6,182,212,0.5)]",
    iconColor: "text-cyan-500",
    iconBg: "bg-cyan-500/10",
    titleColor:
      "group-hover:text-cyan-500 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]",
  },
];

const AdminOpportunitiesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (highlightId && opportunities.length > 0) {
      setTimeout(() => {
        const element = document.getElementById(`project-${highlightId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    }
  }, [highlightId, opportunities]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this opportunity?")) {
      try {
        const { error } = await supabase
          .from("opportunity")
          .delete()
          .eq("id", id);
        if (error) throw error;
        setOpportunities((prev) => prev.filter((opp) => opp.id !== id));
      } catch (error) {
        console.error("Error deleting opportunity:", error);
        alert("Failed to delete opportunity");
      }
    }
  };

  const fetchOpportunities = async () => {
    try {
      setIsLoading(true);
      const { data: opps } = await supabase
        .from("opportunity")
        .select("*, company_profile(user(full_name))")
        .order("created_at", { ascending: false });

      if (opps) {
        const formattedOpps = opps.map((opp) => {
          // Calculate days ago
          const created = new Date(opp.created_at);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - created.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          // Parse tags
          const rawTags = opp.requirements
            ? opp.requirements.split(",").map((t: string) => t.trim())
            : [];
          const tags = rawTags.filter((t: string) => t.length > 0).slice(0, 3); // limit to 3 tags

          const companyName = opp.company_id
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ? (opp.company_profile as any)?.user?.full_name || "Unknown Company"
            : "Admin";

          return {
            id: opp.id.toString(),
            title: opp.title || "Untitled",
            company: companyName,
            tags: tags,
            duration: opp.duration
              ? `${opp.duration} days`
              : "Unknown duration",
            postedDays: diffDays,
            raw: opp,
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

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsAddProjectOpen(open);
    if (!open) {
      setEditingProject(null);
      fetchOpportunities();
    }
  };

  const handleEdit = (projectRaw: any) => {
    setEditingProject(projectRaw);
    setIsAddProjectOpen(true);
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const title = opp.title.toLowerCase();
    const company = opp.company.toLowerCase();
    const description = (opp.raw?.description || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || company.includes(query) || description.includes(query);
  });

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Opportunities</h1>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/admin/opportunities/all/applicants")}
              variant="outline"
            >
              View Applicants
            </Button>
            <Button onClick={() => setIsAddProjectOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>

        <AddProjectDialog
          open={isAddProjectOpen}
          onOpenChange={handleOpenChange}
          projectToEdit={editingProject}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <p>Loading projects...</p>
          ) : filteredOpportunities?.length === 0 ? (
            <p className="text-muted-foreground">No opportunities found.</p>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            filteredOpportunities?.map((opp: any, index: number) => {
              const theme = THEMES[index % THEMES.length];
              return (
                <Card
                  key={opp.id}
                  id={`project-${opp.id}`}
                  className={`relative group transition-all duration-1000 overflow-hidden ${theme.cardGlow} ${
                    highlightId === opp.id.toString()
                      ? "ring-4 ring-primary border-primary bg-primary/5 scale-[1.02] shadow-xl"
                      : ""
                  }`}
                >
                  {opp.raw?.image_url && (
                    <div className="w-full h-40 overflow-hidden">
                      <img
                        src={opp.raw.image_url}
                        alt={opp.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3
                        className={`font-semibold transition-all duration-300 ${theme.titleColor}`}
                      >
                        {opp.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status="active" />
                      <span className="text-sm text-muted-foreground"></span>
                    </div>

                    <div className="text-sm">
                      <span className="text-muted-foreground">Created By</span>
                      <span className="ml-4">{opp.company || "Unknown"}</span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      DETAILS: {opp.raw?.description}
                    </p>

                    {opp.raw?.deadline && (
                      <p className="text-xs text-muted-foreground">
                        Deadline:{" "}
                        {new Date(opp.raw.deadline).toLocaleDateString()}
                      </p>
                    )}

                    {opp.raw?.amount_of_money && (
                      <p className="text-xs text-muted-foreground">
                        Price: {opp.raw.amount_of_money}$
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className={`text-white border-none transition-all duration-300 ${theme.buttonBg} ${theme.buttonHover} ${theme.buttonGlow}`}
                        onClick={() => handleEdit(opp.raw)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDelete(opp.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminOpportunitiesPage;
