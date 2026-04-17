import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationsPanel, NotificationBell } from "./NotificationsPanel";

interface SidebarProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Table", href: "/admin/table", icon: Table },
  { name: "Inbox", href: "/admin/inbox", icon: MessageSquare },
];

const pages = [
  { name: "Opportunities", href: "/admin/opportunities", icon: Users },
  { name: "Announcement", href: "/admin/announcement", icon: Megaphone },
];

const bottomNav = [
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Logout", href: "/auth", icon: LogOut },
];

export function DashboardLayout({ children }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(href);
  };

  const NavItem = ({ item }: { item: any }) => {
    const isExternal = item.href.startsWith("http");

    if (isExternal) {
      return (
        <a
          href={item.href}
          className={cn(
            "nav-item",
            isActive(item.href) && "nav-item-active"
          )}
        >
          <item.icon className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="font-medium">{item.name}</span>}
        </a>
      );
    }

    return (
      <Link
        to={item.href}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "nav-item",
          isActive(item.href) && "nav-item-active"
        )}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        {!collapsed && <span className="font-medium">{item.name}</span>}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <a 
        href="/"
        className="flex h-16 items-center gap-2 px-4 border-b border-sidebar-border hover:opacity-80 transition-opacity cursor-pointer"
        title="Return to Landing Page"
      >
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">D</span>
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold text-primary">Dashboard</span>
        )}
      </a>

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
      </div>

      {/* Collapse Button (Desktop) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-muted transition-colors"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            collapsed && "rotate-180"
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
          mobileOpen ? "translate-x-0" : "-translate-x-full"
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
          collapsed ? "w-[72px]" : "w-64"
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
            <button className="text-sm text-muted-foreground hover:text-foreground">
              English
            </button>
            <NotificationBell 
              onClick={() => setNotificationsOpen(true)} 
              hasNew={true}
            />
            <Link to="/admin/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">MR</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Moni Roy</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel 
        isOpen={notificationsOpen} 
        onClose={() => setNotificationsOpen(false)} 
      />
    </div>
  );
}
