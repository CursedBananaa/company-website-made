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

const notifications = [
  {
    id: 1,
    title: "New applicant received",
    description: "John Doe applied for Frontend Developer position",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Project deadline approaching",
    description: "Website Redesign project is due in 2 days",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    title: "Message from Sarah",
    description: "Hey, can we schedule a meeting?",
    time: "3 hours ago",
    unread: false,
  },
  {
    id: 4,
    title: "Student completed course",
    description: "Emily has completed the React course",
    time: "Yesterday",
    unread: false,
  },
];

export function NotificationDropdown() {
  const unreadCount = notifications.filter((n) => n.unread).length;

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
          {notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start gap-1 p-3 cursor-pointer focus:bg-muted"
            >
              <div className="flex items-center gap-2 w-full">
                <span className="font-medium text-sm text-foreground">
                  {notification.title}
                </span>
                {notification.unread && (
                  <span className="h-2 w-2 rounded-full bg-primary ml-auto" />
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {notification.description}
              </p>
              <span className="text-xs text-muted-foreground/70">
                {notification.time}
              </span>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-primary cursor-pointer">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
