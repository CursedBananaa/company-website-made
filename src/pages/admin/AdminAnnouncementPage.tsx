import { useState } from "react";
import { AdminDashboardLayout } from "@/components/admin/DashboardLayout";
import { Edit, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Announcement {
  id: string;
  name: string;
  description: string;
  link: string;
}

const initialAnnouncements: Announcement[] = [
  {
    id: "1",
    name: "Name Of The Survey",
    description:
      "Free Classifieds Using Them To Promote Your Stuff Online Enhance Your Brand Potential With Giant Advertising Blimps, enhance Your Brand Potential With Giant Advertising Blimps Description: Free Classifieds Using Them To Promote Your Stuff Online Enhance Your Brand Potential With Giant Blimps.",
    link: "Https://Httpps.Googleforms.com",
  },
  {
    id: "2",
    name: "Name Of The Survey",
    description:
      "Free Classifieds Using Them To Promote Your Stuff Online Enhance Your Brand Potential With Giant Advertising Blimps, enhance Your Brand Potential With Giant Advertising Blimps Description: Free Classifieds Using Them To Promote Your Stuff Online Enhance Your Brand Potential With Giant Blimps.",
    link: "Https://Httpps.Googleforms.com",
  },
  {
    id: "3",
    name: "Name Of The Survey",
    description:
      "Free Classifieds Using Them To Promote Your Stuff Online Enhance Your Brand Potential With Giant Advertising Blimps, enhance Your Brand Potential With Giant Advertising Blimps Description: Free Classifieds Using Them To Promote Your Stuff Online Enhance Your Brand Potential With Giant Blimps.",
    link: "Https://Httpps.Googleforms.com",
  },
];

const AdminAnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold italic text-foreground mb-6">Announcement</h1>

        <div className="space-y-4">
          {announcements.map((announcement) => (
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
                  {announcement.link}
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
          ))}
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
