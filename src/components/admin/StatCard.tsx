import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean; // Keep for backward compatibility or map it
  changeType?: "positive" | "negative";
  variant?: "default" | "pink";
  showArrow?: boolean;
  onClick?: () => void;
  className?: string;
  colorVariant?: string; // Keep interface backwards compatible if needed
}

export function StatCard({
  label,
  value,
  change,
  isPositive,
  changeType = "positive",
  variant = "default",
  showArrow = false,
  onClick,
  className,
}: StatCardProps) {
  // Determine if it's positive based on both props to help backward compatibility
  const positive = isPositive !== undefined ? isPositive : changeType === "positive";

  return (
    <div
      className={cn(
        "rounded-lg p-4 transition-all",
        variant === "pink" ? "bg-secondary" : "bg-card border border-border",
        onClick && "cursor-pointer hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              {positive ? (
                <TrendingUp className="h-3 w-3 text-success" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span
                className={cn(
                  "text-xs",
                  positive ? "text-success" : "text-destructive"
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

