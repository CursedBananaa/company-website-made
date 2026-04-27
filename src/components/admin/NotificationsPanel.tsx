import { Bell, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  time: string;
  avatar?: string;
  type: "notification" | "activity" | "update";
}

const notifications: Notification[] = [
  { id: "1", title: "New Opportunity added", time: "Just now", type: "notification" },
  { id: "2", title: "New user registered.", time: "59 minutes ago", type: "notification" },
  { id: "3", title: "Upcoming Training Deadlines.", time: "12 hours ago", type: "notification" },
  { id: "4", title: "Andi Lane Send Message", time: "Today, 11:59 AM", avatar: "AL", type: "notification" },
];

const activities: Notification[] = [
  { id: "1", title: "You Approved a Opportunity", time: "Just now", type: "activity" },
  { id: "2", title: "Modified A data in Page X.", time: "59 minutes ago", type: "activity" },
  { id: "3", title: "Update on a Opportunity.", time: "12 hours ago", type: "activity" },
  { id: "4", title: "Modified A data in Page X.", time: "Today, 11:59 AM", type: "activity" },
  { id: "5", title: "Deleted a page in Project X.", time: "Feb 2, 2025", type: "activity" },
];

const updates: Notification[] = [
  { id: "1", title: "Total Student have raised 2%", time: "", type: "update" },
  { id: "2", title: "Drew Cano", time: "", avatar: "DC", type: "update" },
  { id: "3", title: "Andi Lane", time: "", avatar: "AL", type: "update" },
  { id: "4", title: "Koray Okumus", time: "", avatar: "KO", type: "update" },
  { id: "5", title: "Kate Morrison", time: "", avatar: "KM", type: "update" },
];

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminNotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed right-0 top-0 h-full w-80 bg-card border-l border-border z-50 transform transition-transform duration-300 overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Notifications</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-3">Notifications</h3>
            <div className="space-y-3">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    {item.avatar ? (
                      <span className="text-xs font-medium text-primary">{item.avatar}</span>
                    ) : (
                      <Bell className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground mb-3">Activities</h3>
            <div className="space-y-3">
              {activities.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground mb-3">Update</h3>
            <div className="space-y-3">
              {updates.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    {item.avatar ? (
                      <span className="text-xs font-medium text-primary">{item.avatar}</span>
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-sm text-foreground">{item.title}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}

interface NotificationBellProps {
  onClick: () => void;
  hasNew?: boolean;
}

export function AdminNotificationBell({ onClick, hasNew = true }: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-lg hover:bg-muted transition-colors"
    >
      <Bell className="h-5 w-5 text-muted-foreground" />
      {hasNew && (
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
      )}
    </button>
  );
}
