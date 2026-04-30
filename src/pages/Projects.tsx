import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import { Plus, Edit, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AddProjectDialog } from "@/components/AddProjectDialog";
import { useProfile } from "@/contexts/ProfileContext";
import { toast } from "sonner";

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

export default function Projects() {
  const navigate = useNavigate();
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', profile.companyId],
    queryFn: async () => {
      if (!profile.companyId) return [];

      const { data, error } = await supabase
        .from('opportunity')
        .select(`
          *,
          company_profile (
            user (
              full_name
            )
          )
        `)
        .eq('company_id', profile.companyId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile.companyId,
  });

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const { error } = await supabase
        .from('opportunity')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setIsAddProjectOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsAddProjectOpen(open);
    if (!open) {
      setEditingProject(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Projects</h1>
          <div className="flex gap-3">
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => setIsAddProjectOpen(true)}
            >
              Add Project
            </Button>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => navigate("/applicants")}
            >
              View Applicant
            </Button>
          </div>
        </div>

        <AddProjectDialog 
          open={isAddProjectOpen} 
          onOpenChange={handleOpenChange} 
          projectToEdit={editingProject}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <p>Loading projects...</p>
          ) : projects?.length === 0 ? (
             <p className="text-muted-foreground">No projects found for your company.</p>
          ) : projects?.map((project: any, index: number) => {
            const theme = THEMES[index % THEMES.length];
            return (
            <Card key={project.id} className={`relative group transition-all duration-300 ${theme.cardGlow}`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className={`font-semibold transition-all duration-300 ${theme.titleColor}`}>{project.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status="active" /> 
                  <span className="text-sm text-muted-foreground">
                    {/* Assignee logic could go here if we had it */}
                  </span>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Created By</span>
                  <span className="ml-4">
                    {project.company_profile?.user?.full_name || "Unknown"}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  DETAILS: {project.description}
                </p>

                {project.deadline && (
                  <p className="text-xs text-muted-foreground">
                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </p>
                )}

                {project.amount_of_money && (
                  <p className="text-xs text-muted-foreground">
                    Price: {project.amount_of_money}$
                  </p>
                )}

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className={`text-white border-none transition-all duration-300 ${theme.buttonBg} ${theme.buttonHover} ${theme.buttonGlow}`}
                    onClick={() => handleEdit(project)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          )})}
        </div>
      </div>
    </DashboardLayout>
  );
}
