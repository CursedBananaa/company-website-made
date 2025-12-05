import { cn } from "@/lib/utils";

type StatusType = "active" | "pending" | "draft" | "complete" | "accepted" | "rejected";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  active: "bg-success text-success-foreground",
  pending: "bg-pending text-pending-foreground",
  draft: "bg-muted text-muted-foreground",
  complete: "bg-chart-pink text-primary-foreground",
  accepted: "bg-success/20 text-success border border-success/30",
  rejected: "bg-destructive/20 text-destructive border border-destructive/30",
};

const statusLabels: Record<StatusType, string> = {
  active: "ACTIVE",
  pending: "PENDING",
  draft: "DRAFT",
  complete: "Complete",
  accepted: "Accepted",
  rejected: "Rejected",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
