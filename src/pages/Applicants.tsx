import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Eye } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/contexts/ProfileContext";
import { useState } from "react";
import { ApplicationDetailsDialog } from "@/components/ApplicationDetailsDialog";
import { StudentDetailsDialog } from "@/components/StudentDetailsDialog";

export default function Applicants() {
  const { profile } = useProfile();
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isAppDetailsOpen, setIsAppDetailsOpen] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isStudentProfileOpen, setIsStudentProfileOpen] = useState(false);

  const { data: applicants, isLoading } = useQuery({
    queryKey: ['applications', profile.companyId],
    queryFn: async () => {
      // First get opportunities for this company
      const { data: opportunities, error: oppError } = await supabase
        .from('opportunity')
        .select('id')
        .eq('company_id', profile.companyId);
      
      if (oppError) throw oppError;
      
      const opportunityIds = (opportunities as any[]).map(o => o.id);

      if (opportunityIds.length === 0) return [];

      const { data, error } = await supabase
        .from('application')
        .select(`
          *,
          opportunity (
            title,
            company_id
          ),
          student_profile (
            id,
            major,
            university,
            grad_year,
            cv_url,
            github_url,
            user (
              full_name,
              email,
              phone_number,
              profile_picture,
              bio
            ),
            student_skills (
              skill_name
            ),
            application (
              status,
              created_at,
              opportunity (
                title,
                company_profile (
                  industry
                )
              )
            )
          )
        `)
        .in('opportunity_id', opportunityIds);
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile.companyId,
  });

  const handleViewApplication = (application: any) => {
    setSelectedApplication(application);
    setIsAppDetailsOpen(true);
  };

  const handleViewStudentProfile = (student: any) => {
    setSelectedStudent(student);
    setIsStudentProfileOpen(true);
    // Optionally close application details if you want only one dialog
    // setIsAppDetailsOpen(false); 
  };

  const handleAppDetailsOpenChange = (open: boolean) => {
    setIsAppDetailsOpen(open);
    if (!open) setSelectedApplication(null);
  };

  const handleStatusUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['applications'] });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Applicants</h1>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-medium text-muted-foreground">Applicant</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Major</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Project Applied For</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Applied Date</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                     <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading applications...</td></tr>
                  ) : applicants?.length === 0 ? (
                     <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No applicants found.</td></tr>
                  ) : applicants?.map((applicant: any) => (
                    <tr key={applicant.id} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                      <td className="p-4 text-sm font-medium">
                        {applicant.student_profile?.user?.full_name || "Unknown"}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {applicant.student_profile?.major || "N/A"}
                      </td>
                      <td className="p-4 text-sm">
                        {applicant.opportunity?.title || "Unknown"}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(applicant.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={applicant.status || 'pending'} />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                           <Button 
                             variant="ghost" 
                             size="sm"
                             className="hover:bg-primary/10 hover:text-primary"
                             onClick={() => handleViewApplication(applicant)}
                           >
                             <Eye className="h-4 w-4 mr-1" />
                             View
                           </Button>
                           {/* Add Status Update / Pay Buttons directly here if requested later */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <ApplicationDetailsDialog 
          open={isAppDetailsOpen} 
          onOpenChange={handleAppDetailsOpenChange} 
          application={selectedApplication}
          onStatusUpdate={handleStatusUpdate}
          onViewProfile={handleViewStudentProfile}
        />

        <StudentDetailsDialog 
          open={isStudentProfileOpen} 
          onOpenChange={setIsStudentProfileOpen} 
          student={selectedStudent} 
        />
      </div>
    </DashboardLayout>
  );
}
