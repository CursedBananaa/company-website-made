import { useState } from "react";
import { AdminDashboardLayout } from "@/components/admin/DashboardLayout";
import { Mail, Phone, MapPin, Briefcase, Camera, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const AdminProfilePage = () => {
  const [profileData, setProfileData] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@sha8lny.com",
    phone: "+1 234 567 890",
    location: "New York, USA",
    role: "Administrator",
    bio: "System administrator managing the sha8lny platform.",
  });

  const handleChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-2 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your admin account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-semibold text-primary">AD</span>
                </div>
                <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4 text-primary-foreground" />
                </button>
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-muted-foreground">{profileData.role}</p>
              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{profileData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{profileData.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{profileData.location}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-sm">{profileData.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">Edit Profile</h2>
              <p className="text-muted-foreground text-sm">Update your personal information</p>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">First Name</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-input bg-muted/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-input bg-muted/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-input bg-muted/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Phone</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-input bg-muted/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-input bg-muted/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Bio</label>
                <Textarea
                  value={profileData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  className="min-h-[120px] bg-muted/50 border-input resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminProfilePage;
