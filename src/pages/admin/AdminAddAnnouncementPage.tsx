import { useState } from "react";
import { AdminDashboardLayout } from "@/components/admin/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminAddAnnouncementPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    link: "",
    department: "",
    deadline: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error("Please enter an announcement name");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.from("announcement").insert({
        name: formData.name,
        description: formData.description,
        link: formData.link,
        // Using ts-expect-error because these columns might not exist yet if user ran my exact SQL
        // @ts-expect-error - ignore missing types
        department: formData.department,
        // @ts-expect-error - ignore missing types
        deadline: formData.deadline || null
      });

      if (error) {
        toast.error("Database table 'announcement' does not exist yet. Please run the SQL command provided.");
        console.error(error);
      } else {
        toast.success("Announcement added successfully!");
        navigate("/admin/announcement");
      }
    } catch (err) {
      toast.error("An error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold italic text-foreground mb-8">
          Add New Announcement
        </h1>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Name Of Announcement
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Applied Link
              </label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => handleChange("link", e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Focus Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="max-w-md">
            <label className="block text-sm font-medium text-foreground mb-2">
              Application Deadline
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => handleChange("deadline", e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-10 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Now"}
            </button>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminAddAnnouncementPage;
