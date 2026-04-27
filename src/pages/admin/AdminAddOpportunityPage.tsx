import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminDashboardLayout } from "@/components/admin/DashboardLayout";
import { Camera, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FormData {
  name: string;
  description: string;
  appliedLink: string;
  focusDepartment: string;
  companyName: string;
  requiredSkills: string;
  applicationDeadline: string;
  skillsStudentLearn: string;
}

const AdminAddOpportunityPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [activeTab, setActiveTab] = useState<"template" | "instance">("template");
  const [formData, setFormData] = useState<FormData>({
    name: isEditing ? "Name Of Opportunity" : "",
    description: isEditing ? "Description" : "",
    appliedLink: isEditing ? "Applied Link" : "",
    focusDepartment: isEditing ? "Computer" : "",
    companyName: isEditing ? "WE" : "",
    requiredSkills: isEditing ? "Css,html" : "",
    applicationDeadline: isEditing ? "3/12/2027" : "",
    skillsStudentLearn: "",
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin/opportunities");
  };

  const handleDelete = () => {
    navigate("/admin/opportunities");
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">
          Add Internship Opportunity
        </h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("template")}
            className={`px-8 py-3 rounded-full font-medium transition-colors ${
              activeTab === "template"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Template
          </button>
          <button
            onClick={() => setActiveTab("instance")}
            className={`px-8 py-3 rounded-full font-medium transition-colors ${
              activeTab === "instance"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Instance
          </button>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-2">
            <Camera className="h-8 w-8 text-muted-foreground" />
          </div>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">
            {isEditing ? "Upload another Photo" : "Upload Photo"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Name Of Opportunity", field: "name" as keyof FormData },
              { label: "Description", field: "description" as keyof FormData },
              { label: "Applied Link", field: "appliedLink" as keyof FormData },
              { label: "Focus Department", field: "focusDepartment" as keyof FormData },
              { label: "Company Name", field: "companyName" as keyof FormData },
              { label: "Required Skills", field: "requiredSkills" as keyof FormData },
              { label: "Application Deadline", field: "applicationDeadline" as keyof FormData },
              { label: "Skills Student Learn", field: "skillsStudentLearn" as keyof FormData },
            ].map(({ label, field }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
                <input
                  type="text"
                  value={formData[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  placeholder={label}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 pt-6">
            <button
              type="submit"
              className="w-full max-w-md py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              {isEditing ? "Update" : "Add Now"}
            </button>

            {isEditing && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you Sure You Want to Delete this Opportunity?</AlertDialogTitle>
                    <AlertDialogDescription>
                      By Deleting This Opportunity You Can't Use it or Update on it Anymore.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-lg">Back</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-primary hover:bg-primary/90 rounded-lg"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </form>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminAddOpportunityPage;
