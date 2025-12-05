import { Plus, Edit, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const projects = [
  {
    name: "progect A",
    status: "active" as const,
    assignee: "Christine Brooks",
    createdBy: "Jane smith",
    details: "UI&UX To Disen Web TO Comang...",
    deadline: "28/7/2024",
    price: "$500$",
  },
  {
    name: "progect B",
    status: "pending" as const,
    assignee: "Christine Brooks",
    createdBy: "Jane smith",
    details: "UI&UX To Disen Web TO Comang...",
    deadline: "28/7/2024",
    price: "290$",
  },
  {
    name: "progect C",
    status: "draft" as const,
    assignee: "Christine Brooks",
    createdBy: "Jane smith",
    details: "UI&UX To Disen Web TO Comang...",
    deadline: "28/7/2024",
    price: "$500$",
  },
  {
    name: "progect D",
    status: "active" as const,
    assignee: "Christine Brooks",
    createdBy: "Jane smith",
    details: "UI&UX To Disen Web TO Comang...",
    deadline: "28/7/2024",
    price: "$500$",
  },
  {
    name: "progect E",
    status: "complete" as const,
    assignee: "Rosie Pearson",
    createdBy: "Jane smith",
    details: "UI&UX To Disen Web TO Comang...",
    deadline: "28/7/2024",
    price: "$500$",
  },
  {
    name: "progect B",
    status: "pending" as const,
    assignee: "Christine Brooks",
    createdBy: "Jane smith",
    details: "UI&UX To Disen Web TO Comang...",
    deadline: "28/7/2024",
    price: "290$",
  },
  {
    name: "progect A",
    status: "active" as const,
    assignee: "Christine Brooks",
    createdBy: "Jane smith",
    details: "UI&UX To Disen Web TO Comang...",
    deadline: null,
    price: null,
  },
  {
    name: "progect F",
    status: "draft" as const,
    assignee: "Christine Brooks",
    createdBy: "Jane smith",
    details: "UI&UX To Disen Web TO Comang...",
    deadline: null,
    price: null,
  },
  {
    name: "progect I",
    status: "pending" as const,
    assignee: "Christine Brooks",
    createdBy: "Jane smith",
    details: "UI&UX To Disen Web TO Comang...",
    deadline: null,
    price: null,
  },
];

export default function Projects() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Projects</h1>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => navigate("/applicants")}
          >
            View Applicant
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {projects.map((project, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{project.name}</h3>
                  <button className="w-6 h-6 rounded-full bg-chart-green flex items-center justify-center">
                    <Plus className="h-4 w-4 text-success-foreground" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={project.status} />
                  <span className="text-sm text-muted-foreground">
                    {project.assignee}
                  </span>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">creatred By</span>
                  <span className="ml-4">{project.createdBy}</span>
                </div>

                <p className="text-xs text-muted-foreground">
                  DETAILS: {project.details}
                </p>

                {project.deadline && (
                  <p className="text-xs text-muted-foreground">
                    Deadline:{project.deadline}
                  </p>
                )}

                {project.price && (
                  <p className="text-xs text-muted-foreground">
                    price: {project.price}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delet
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
