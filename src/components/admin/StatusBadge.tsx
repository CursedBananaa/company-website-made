import { cn } from "@/lib/utils";

type StatusType = "progress" | "complete" | "pending" | "approved" | string;

interface StatusBadgeProps {
  status: StatusType;
  children: React.ReactNode;
}

export function AdminStatusBadge({ status, children }: StatusBadgeProps) {
  const normalizedStatus = (status || "").toLowerCase();
  
  const isProgress = ["progress", "ongoing", "on going", "on_going"].includes(normalizedStatus);
  const isComplete = ["complete", "completed"].includes(normalizedStatus);
  const isPending = ["pending", "in_review"].includes(normalizedStatus);
  const isApproved = ["approved", "accepted", "completed_by_company"].includes(normalizedStatus);
  const isRejected = ["rejected", "failed"].includes(normalizedStatus);

  return (
    <span
      className={cn(
        "admin-status-badge border",
        isProgress && "admin-status-progress border-blue-200/50 dark:border-blue-800/30",
        isComplete && "admin-status-complete border-green-200/50 dark:border-green-800/30",
        isPending && "admin-status-pending border-amber-200/50 dark:border-amber-800/30",
        isApproved && "admin-status-approved border-purple-200/50 dark:border-purple-800/30",
        isRejected && "bg-destructive/10 text-destructive border-destructive/20",
      )}
    >
      {children}
    </span>
  );
}
