import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Table,
  MessageSquare,
  Users,
  Megaphone,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AdminNotificationsPanel,
  AdminNotificationBell,
} from "./NotificationsPanel";
import { useProfile } from "@/contexts/ProfileContext";
import { ThemeToggle } from "@/components/ThemeToggle";

interface SidebarProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Student Data", href: "/admin/table", icon: Table },
  {
    name: "Training",
    href: "/admin/training-submissions",
    icon: GraduationCap,
  },
  { name: "Inbox", href: "/admin/inbox", icon: MessageSquare },
];

const pages = [
  { name: "Opportunities", href: "/admin/opportunities", icon: Users },
  { name: "Announcement", href: "/admin/announcement", icon: Megaphone },
];

const bottomNav = [
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminDashboardLayout({ children }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useProfile();

  const isActive = (href: string) => {
    if (href === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const NavItem = ({ item }: { item: any }) => (
    <Link
      to={item.href}
      onClick={() => setMobileOpen(false)}
      className={cn(
        "admin-nav-item",
        isActive(item.href) && "admin-nav-item-active",
      )}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span className="font-medium">{item.name}</span>}
    </Link>
  );

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="px-3 py-6 border-b border-sidebar-border">
        <Link
          to="/"
          className={cn(
            "block w-full text-center font-['Pecita'] font-bold text-primary hover:opacity-90 transition-all cursor-pointer",
            collapsed ? "text-2xl" : "text-4xl",
          )}
          style={{
            textShadow:
              "0 0 20px hsl(var(--primary) / 0.6), 0 0 40px hsl(var(--primary) / 0.4), 0 0 60px hsl(var(--primary) / 0.2)",
          }}
          title="Return to Landing Page"
        >
          {collapsed ? "S" : "Sha8lny"}
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navigation.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}

        {/* Pages Section */}
        {!collapsed && (
          <div className="pt-6 pb-2">
            <span className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pages
            </span>
          </div>
        )}
        {collapsed && <div className="py-3" />}
        {pages.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-sidebar-border py-4 px-3 space-y-1">
        {bottomNav.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
        <button
          onClick={handleLogout}
          className="admin-nav-item w-full text-left text-destructive hover:text-destructive"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>

      {/* Collapse Button (Desktop) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-muted transition-colors"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            collapsed && "rotate-180",
          )}
        />
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent />
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex relative flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-muted"
            >
              <Menu className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-48 md:w-80 h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <AdminNotificationBell
              onClick={() => setNotificationsOpen(true)}
              hasNew={true}
            />
            <Link
              to="/admin/profile"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              {profile.avatarUrl &&
              profile.avatarUrl !==
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" ? (
                <div className="h-9 w-9 rounded-full overflow-hidden">
                  <img
                    src={profile.avatarUrl}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {(profile.firstName?.[0] || "A") +
                      (profile.lastName?.[0] || "D")}
                  </span>
                </div>
              )}
              <div className="hidden md:block">
                <p className="text-sm font-medium">
                  {profile.firstName || "Admin"} {profile.lastName || ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  {profile.role || "Administrator"}
                </p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="ml-2 p-2 text-muted-foreground hover:text-destructive transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>

      {/* Notifications Panel */}
      <AdminNotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
}
