import { AdminStatusBadge } from "./StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Opportunity {
  id: string;
  name: string;
  status: "progress" | "complete" | "pending" | "approved";
  statusLabel: string;
}

const opportunities: Opportunity[] = [
  { id: "1", name: "Christine Brooks", status: "progress", statusLabel: "ACTIVE" },
  { id: "2", name: "Rosie Todd", status: "pending", statusLabel: "PENDING" },
  { id: "3", name: "Rosie Pearson", status: "complete", statusLabel: "Complete" },
  { id: "4", name: ".........................", status: "approved", statusLabel: "DRAFT" },
];

export function AvailableOpportunities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Opportunities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className="flex items-center justify-between py-2 border-b border-border last:border-0"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              <span className="text-sm">{opp.name}</span>
            </div>
            <AdminStatusBadge status={opp.status}>
              {opp.statusLabel}
            </AdminStatusBadge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
