import { cn } from "@/lib/utils";

type StatusType = "progress" | "complete" | "pending" | "approved";

interface StatusBadgeProps {
  status: StatusType;
  children: React.ReactNode;
}

export function AdminStatusBadge({ status, children }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "admin-status-badge",
        status === "progress" && "admin-status-progress",
        status === "complete" && "admin-status-complete",
        status === "pending" && "admin-status-pending",
        status === "approved" && "admin-status-approved"
      )}
    >
      {children}
    </span>
  );
}
