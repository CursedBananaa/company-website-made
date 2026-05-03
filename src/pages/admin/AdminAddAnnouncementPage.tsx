import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/admin/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminAddAnnouncementPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    image_url: "",
  });

  useEffect(() => {
    if (isEditMode && id) {
      const fetchAnnouncement = async () => {
        try {
          setIsLoading(true);
          const { data, error } = await supabase
            .from("announcement")
            .select("*")
            .eq("id", id)
            .single();

          if (error) throw error;
          
          if (data) {
            setFormData({
              title: data.title || "",
              description: data.description || "",
              link: data.link || "",
              image_url: data.image_url || "",
            });
          }
        } catch (err) {
          console.error("Error fetching announcement:", err);
          toast.error("Failed to load announcement data");
          navigate("/admin/announcement");
        } finally {
          setIsLoading(false);
        }
      };

      fetchAnnouncement();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      toast.error("Please enter an announcement title");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        title: formData.title,
        description: formData.description,
        link: formData.link,
        image_url: formData.image_url || null
      };

      let result;
      if (isEditMode && id) {
        result = await supabase.from("announcement").update(payload).eq("id", id);
      } else {
        result = await supabase.from("announcement").insert(payload);
      }

      if (result.error) {
        toast.error("Database table 'announcement' does not exist yet. Please run the SQL command provided.");
        console.error(result.error);
      } else {
        toast.success(isEditMode ? "Announcement updated successfully!" : "Announcement added successfully!");
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
          {isEditMode ? "Edit Announcement" : "Add New Announcement"}
        </h1>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title Of Announcement
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
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
                  Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => handleChange("image_url", e.target.value)}
                  placeholder="https://example.com/image.png"
                  className="w-full h-11 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-10 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting 
                  ? (isEditMode ? "Updating..." : "Adding...") 
                  : (isEditMode ? "Update Now" : "Add Now")}
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminAddAnnouncementPage;
