import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Applicants() {
  const { data: applicants, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('application')
        .select(`
          *,
          opportunity (
            title
          ),
          student_profile (
            major,
            user (
              full_name
            )
          )
        `);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Applicant</h1>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Applicant
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    skills
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    project Applayed For
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                   <tr><td colSpan={4} className="p-4 text-center">Loading applications...</td></tr>
                ) : applicants?.map((applicant: any, index: number) => (
                  <tr key={index} className="border-b border-border last:border-0">
                    <td className="p-4 text-sm">
                      {applicant.student_profile?.user?.full_name || "Unknown"}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {applicant.student_profile?.major || "N/A"}
                    </td>
                    <td className="p-4 text-sm">
                      {applicant.opportunity?.title || "Unknown"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={applicant.status || 'pending'} />
                        {/* Logic for showPay based on status could go here */}
                        {applicant.status === 'accepted' && (
                          <Button
                            size="sm"
                            className="bg-chart-green hover:bg-chart-green/90 text-success-foreground"
                          >
                            <Gift className="h-3 w-3 mr-1" />
                            PAY
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
