import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative";
  variant?: "default" | "pink";
  showArrow?: boolean;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "positive",
  variant = "default",
  showArrow = false,
  onClick,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-4 transition-all",
        variant === "pink" ? "bg-secondary" : "bg-card border border-border",
        onClick && "cursor-pointer hover:shadow-md"
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              {changeType === "positive" ? (
                <TrendingUp className="h-3 w-3 text-success" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span
                className={cn(
                  "text-xs",
                  changeType === "positive" ? "text-success" : "text-destructive"
                )}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        {showArrow && (
          <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
