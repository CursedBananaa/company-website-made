import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/admin/DashboardLayout";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "@/contexts/ProfileContext";

const AdminSettingsPage = () => {
  const { profile, updateProfile, loading } = useProfile();
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
  });

  useEffect(() => {
    if (profile && !loading) {
      setFormData({
        name: (profile.firstName || "") + (profile.lastName ? " " + profile.lastName : ""),
        email: profile.email || "",
        password: "",
        contactNumber: profile.phone || "",
      });
    }
  }, [profile, loading]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Update Auth Email or Password if changed
      const updates: { email?: string; password?: string } = {};
      if (formData.email !== profile.email) updates.email = formData.email;
      if (formData.password) updates.password = formData.password;

      if (Object.keys(updates).length > 0) {
        const { error: authError } = await supabase.auth.updateUser(updates);
        if (authError) throw authError;
      }

      // Update name and phone in profile
      const nameParts = formData.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      await updateProfile({
        firstName,
        lastName,
        phone: formData.contactNumber,
      });

      toast.success("Settings updated successfully!");
      if (updates.email) {
        toast.info("Please check your new email for a confirmation link.");
      }
      if (updates.password) {
        setFormData(prev => ({ ...prev, password: "" }));
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to update settings.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>
        
        {loading ? (
          <div className="text-center py-8">Loading settings...</div>
        ) : (
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
                placeholder="Leave blank to keep current password"
              />
              <label className="absolute left-4 top-0 -translate-y-1/2 bg-card px-1 text-xs text-muted-foreground">
                New Password
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
              <button 
                type="button"
                onClick={() => window.location.reload()}
                className="w-full py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminSettingsPage;
