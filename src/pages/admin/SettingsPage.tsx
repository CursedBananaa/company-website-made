import { useState } from "react";
import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/admin/ThemeProvider";

interface FormData {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  city: string;
  state: string;
}

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: "Micro Soft",
    email: "Mehrabbozorgi.business@gmail.com",
    password: "password123456",
    contactNumber: "58077.79",
    city: "United States",
    state: "Washington",
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const FloatingInput = ({
    label,
    value,
    onChange,
    type = "text",
    rightElement,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    rightElement?: React.ReactNode;
  }) => (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-14 px-4 pt-4 pb-2 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring peer"
        placeholder=" "
      />
      <label className="absolute left-4 top-0 -translate-y-1/2 bg-card px-1 text-xs text-muted-foreground">
        {label}
      </label>
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
  );

  const FloatingSelect = ({
    label,
    value,
    onChange,
    options,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
  }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-14 px-4 pt-4 pb-2 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <label className="absolute left-4 top-0 -translate-y-1/2 bg-card px-1 text-xs text-muted-foreground">
        {label}
      </label>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex gap-8">
          {/* Form */}
          <div className="flex-1 space-y-6">
            <FloatingInput
              label="Name"
              value={formData.name}
              onChange={(v) => handleChange("name", v)}
            />

            <FloatingInput
              label="Email"
              value={formData.email}
              onChange={(v) => handleChange("email", v)}
              type="email"
            />

            <FloatingInput
              label="Password"
              value={formData.password}
              onChange={(v) => handleChange("password", v)}
              type={showPassword ? "text" : "password"}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              }
            />

            <FloatingInput
              label="Contact Number"
              value={formData.contactNumber}
              onChange={(v) => handleChange("contactNumber", v)}
            />

            <div className="grid grid-cols-2 gap-4">
              <FloatingSelect
                label="city"
                value={formData.city}
                onChange={(v) => handleChange("city", v)}
                options={["United States", "Canada", "United Kingdom", "Germany", "France"]}
              />
              <FloatingSelect
                label="State"
                value={formData.state}
                onChange={(v) => handleChange("state", v)}
                options={["Washington", "California", "New York", "Texas", "Florida"]}
              />
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-foreground">Dark mode</span>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
            </div>

            {/* Action Buttons */}
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
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
