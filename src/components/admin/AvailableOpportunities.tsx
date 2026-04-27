import { AdminStatusBadge } from "./StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface AdminOpportunityApp {
  name: string;
  status: "progress" | "complete" | "pending" | "approved" | string;
  statusLabel: string;
}

interface AvailableOpportunitiesProps {
  opportunities?: AdminOpportunityApp[];
  isLoading?: boolean;
}

export function AvailableOpportunities({ opportunities = [], isLoading = false }: AvailableOpportunitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : opportunities.length > 0 ? (
          opportunities.map((opp, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span className="text-sm">{opp.name}</span>
              </div>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <AdminStatusBadge status={opp.status as any}>
                {opp.statusLabel}
              </AdminStatusBadge>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">No applications found.</div>
        )}
      </CardContent>
    </Card>
  );
}
