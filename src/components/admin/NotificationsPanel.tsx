import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  title: string;
  time: string;
  body?: string;
  isRead?: boolean;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminNotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserAndNotifications = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: userData } = await supabase
        .from('user')
        .select('id')
        .eq('auth_id', authUser.id)
        .single();

      if (userData) {
        setCurrentUserId(userData.id);
        
        const { data: notifs } = await supabase
          .from("notifications")
          .select("*")
          .eq("u_id", userData.id)
          .order("created_at", { ascending: false });

        if (notifs) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formatted = notifs.map((n: any) => ({
            id: n.id.toString(),
            title: n.title || "New Notification",
            body: n.body,
            time: new Date(n.created_at).toLocaleString(),
            isRead: n.is_read || false,
          }));
          setNotifications(formatted);
        }
      }
    };

    if (isOpen) {
      fetchUserAndNotifications();
    }
  }, [isOpen]);

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", parseInt(id));
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

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
            <h3 className="text-sm font-semibold text-foreground mb-3">Recent Alerts</h3>
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No notifications yet.</p>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => markAsRead(item.id)}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer",
                      !item.isRead ? "bg-primary/5" : ""
                    )}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Bell className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm text-foreground truncate", !item.isRead && "font-semibold")}>
                        {item.title}
                      </p>
                      {item.body && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.body}</p>}
                      <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                    </div>
                    {!item.isRead && (
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                    )}
                  </div>
                ))
              )}
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
