import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: number;
  title: string;
  description?: string;
  time: string;
  unread: boolean;
}

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('user')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (userData) {
        const { data: notifs } = await supabase
          .from("notifications")
          .select("*")
          .eq("u_id", userData.id)
          .order("created_at", { ascending: false });

        if (notifs) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formatted = notifs.map((n: any) => ({
            id: n.id,
            title: n.title || "New Alert",
            description: n.body,
            time: new Date(n.created_at).toLocaleString(),
            unread: !n.is_read,
          }));
          setNotifications(formatted);
          setUnreadCount(formatted.filter((n: Notification) => n.unread).length);
        }
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-popover border-border">
        <DropdownMenuLabel className="font-semibold">
          Notifications
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications yet.
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className="flex flex-col items-start gap-1 p-3 cursor-pointer focus:bg-muted"
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="font-medium text-sm text-foreground">
                    {notification.title}
                  </span>
                  {notification.unread && (
                    <span className="h-2 w-2 rounded-full bg-primary ml-auto shrink-0" />
                  )}
                </div>
                {notification.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {notification.description}
                  </p>
                )}
                <span className="text-xs text-muted-foreground/70">
                  {notification.time}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-primary cursor-pointer">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
