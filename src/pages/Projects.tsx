import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Opportunity, CompanyProfile, User } from "@/types";

// ... existing code ...
import { Plus, Edit, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AddProjectDialog } from "@/components/AddProjectDialog";



export default function Projects() {
  const navigate = useNavigate();
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Opportunity | undefined>(undefined);
  const queryClient = useQueryClient();

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const { error } = await supabase.from('opportunity').delete().eq('id', id);
      if (error) {
        toast.error("Failed to delete project");
      } else {
        toast.success("Project deleted successfully");
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      }
    }
  };

  const handleEdit = (project: Opportunity) => {
    setEditingProject(project);
    setIsAddProjectOpen(true);
  };

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunity')
        .select(`
          *,
          company_profile (
            user (
              full_name
            )
          )
        `);
      
      if (error) throw error;
      return data;
    },
  });

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
          onOpenChange={(open) => {
            setIsAddProjectOpen(open);
            if (!open) setEditingProject(undefined);
          }} 
          projectToEdit={editingProject}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <p>Loading projects...</p>
          ) : projects?.map((project: Opportunity & { company_profile: (CompanyProfile & { user: User | null }) | null }) => (
            <Card key={project.id} className="relative">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{project.title}</h3>
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
                    className="bg-primary hover:bg-primary/90"
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
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
