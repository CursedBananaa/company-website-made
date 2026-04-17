import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Plus, Edit, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AddProjectDialog } from "@/components/AddProjectDialog";
import { useProfile } from "@/contexts/ProfileContext";
import { toast } from "sonner";

export default function Projects() {
  const navigate = useNavigate();
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', profile.companyId],
    queryFn: async (): Promise<any[]> => {
      // TODO: replace with .NET endpoint when available
      return [];
    },
  });

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    toast.info("Delete endpoint not yet connected.");
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
            <p className="text-muted-foreground">No projects found. Add your first project!</p>
          ) : projects?.map((project: any) => (
            <Card key={project.id} className="relative">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{project.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status="active" />
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  {project.description}
                </p>

                {project.deadline && (
                  <p className="text-xs text-muted-foreground">
                    Deadline: {new Date(project.deadline).toLocaleDateString()}
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
