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
  | "in_review"
  | "completed_by_company";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  active: "bg-success text-success-foreground",
  pending: "bg-pending text-pending-foreground",
  draft: "bg-muted text-muted-foreground",
  complete: "bg-chart-pink text-primary-foreground",
  completed: "bg-chart-pink text-primary-foreground",
  accepted: "bg-success/20 text-success border border-success/30",
  ongoing: "bg-success/20 text-success border border-success/30",
  in_review: "bg-pending text-pending-foreground",
  completed_by_company: "bg-chart-pink/50 text-primary-foreground",
  rejected: "bg-destructive/20 text-destructive border border-destructive/30",
  failed: "bg-destructive text-destructive-foreground",
};

const statusLabels: Record<string, string> = {
  active: "ACTIVE",
  pending: "PENDING",
  draft: "DRAFT",
  complete: "Complete",
  completed: "Completed",
  accepted: "Accepted",
  ongoing: "Ongoing",
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
