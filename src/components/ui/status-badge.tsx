import { cn } from "@/lib/utils";

type StatusType =
  | "active"
  | "pending"
  | "draft"
  | "complete"
  | "completed"
  | "accepted"
  | "rejected"
  | "failed"
  | "ongoing"
  | "on going"
  | "on_going"
  | "in_review"
  | "completed_by_company";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  active: "admin-status-complete border border-green-200/50 dark:border-green-800/30",
  pending: "admin-status-pending border border-amber-200/50 dark:border-amber-800/30",
  draft: "bg-muted text-muted-foreground border border-muted-foreground/10",
  complete: "admin-status-complete border border-green-200/50 dark:border-green-800/30",
  completed: "admin-status-complete border border-green-200/50 dark:border-green-800/30",
  accepted: "admin-status-approved border border-purple-200/50 dark:border-purple-800/30",
  ongoing: "admin-status-progress border border-blue-200/50 dark:border-blue-800/30",
  "on going": "admin-status-progress border border-blue-200/50 dark:border-blue-800/30",
  on_going: "admin-status-progress border border-blue-200/50 dark:border-blue-800/30",
  in_review: "admin-status-pending border border-amber-200/50 dark:border-amber-800/30",
  completed_by_company: "admin-status-approved border border-purple-200/50 dark:border-purple-800/30",
  rejected: "bg-destructive/10 text-destructive border border-destructive/20",
  failed: "bg-destructive/10 text-destructive border border-destructive/20",
};

const statusLabels: Record<string, string> = {
  active: "ACTIVE",
  pending: "PENDING",
  draft: "DRAFT",
  complete: "Complete",
  completed: "Completed",
  accepted: "Accepted",
  ongoing: "Ongoing",
  "on going": "Ongoing",
  on_going: "Ongoing",
  in_review: "In Review",
  completed_by_company: "Pending Admin",
  rejected: "Rejected",
  failed: "Failed",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // Fallback if status is completely unknown
  const validStatus = statusStyles[status] ? status : "pending";

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        statusStyles[validStatus],
        className,
      )}
    >
      {statusLabels[validStatus]}
    </span>
  );
}
