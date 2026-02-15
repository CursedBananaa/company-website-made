import { Home, LayoutDashboard, FolderKanban, Users, MessageSquare, Settings, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "HOME", path: "/home" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FolderKanban, label: "Projects", path: "/projects" },
  { icon: Users, label: "Student Data", path: "/students" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

import { useNavigate } from "react-router-dom";
import { useProfile } from "@/contexts/ProfileContext";

export function Sidebar() {
  const navigate = useNavigate();
  const { signOut } = useProfile();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[180px] bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo Section */}
      <div className="px-3 py-6 border-b border-sidebar-border">
        <button
          onClick={() => navigate("/")}
          className="w-full text-center font-['Pecita'] text-4xl font-bold text-primary hover:opacity-90 transition-all cursor-pointer"
          style={{
            textShadow: '0 0 20px hsl(var(--primary) / 0.6), 0 0 40px hsl(var(--primary) / 0.4), 0 0 60px hsl(var(--primary) / 0.2)'
          }}
        >
          Sha8lny
        </button>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-muted"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-muted w-full transition-all"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
