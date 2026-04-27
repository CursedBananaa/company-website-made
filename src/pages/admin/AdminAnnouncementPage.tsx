import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/admin/DashboardLayout";
import { Edit, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Announcement {
  id: string;
  name: string;
  description: string;
  link: string;
}

const AdminAnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from("announcement").select("*").order("created_at", { ascending: false });
      
      if (error) {
        // Table probably doesn't exist yet
        console.warn("Could not fetch announcements:", error);
      } else if (data) {
        setAnnouncements(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("announcement").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete announcement.");
    } else {
      toast.success("Announcement deleted!");
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold italic text-foreground mb-6">Announcement</h1>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading announcements...</div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
              No announcements found. Make sure the database table exists!
            </div>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-card border border-border rounded-lg p-5 flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    {announcement.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    <span className="font-medium text-foreground">Description:</span>{" "}
                    {announcement.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Link:</span>{" "}
                    <a href={announcement.link} target="_blank" rel="noreferrer" className="text-primary hover:underline">{announcement.link}</a>
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <button
                    onClick={() => navigate(`/admin/announcement/edit/${announcement.id}`)}
                    className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => navigate("/admin/announcement/add")}
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminAnnouncementPage;
