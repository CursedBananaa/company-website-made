import { cn } from "@/lib/utils";

type StatusType = "progress" | "complete" | "pending" | "approved";

interface StatusBadgeProps {
  status: StatusType;
  children: React.ReactNode;
}

const statusLabels: Record<StatusType, string> = {
  progress: "In Progress",
  complete: "Complete",
  pending: "Pending",
  approved: "Approved",
};

export function StatusBadge({ status, children }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "status-badge",
        status === "progress" && "status-progress",
        status === "complete" && "status-complete",
        status === "pending" && "status-pending",
        status === "approved" && "status-approved"
      )}
    >
      {children || statusLabels[status]}
    </span>
  );
}
