import { useState } from "react";
import { AdminDashboardLayout } from "@/components/admin/DashboardLayout";
import { Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const AdminSettingsPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "Admin User",
    email: "admin@sha8lny.com",
    password: "admin#12345",
    contactNumber: "+1 234 567 890",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>
        <div className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full h-14 px-4 pt-4 pb-2 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder=" "
            />
            <label className="absolute left-4 top-0 -translate-y-1/2 bg-card px-1 text-xs text-muted-foreground">
              Name
            </label>
          </div>

          <div className="relative">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full h-14 px-4 pt-4 pb-2 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder=" "
            />
            <label className="absolute left-4 top-0 -translate-y-1/2 bg-card px-1 text-xs text-muted-foreground">
              Email
            </label>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full h-14 px-4 pt-4 pb-2 pr-12 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder=" "
            />
            <label className="absolute left-4 top-0 -translate-y-1/2 bg-card px-1 text-xs text-muted-foreground">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Eye className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={formData.contactNumber}
              onChange={(e) => handleChange("contactNumber", e.target.value)}
              className="w-full h-14 px-4 pt-4 pb-2 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder=" "
            />
            <label className="absolute left-4 top-0 -translate-y-1/2 bg-card px-1 text-xs text-muted-foreground">
              Contact Number
            </label>
          </div>

          <div className="space-y-3 pt-6">
            <button className="w-full py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors">
              Cancel
            </button>
            <button className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
              Save
            </button>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminSettingsPage;
