import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AdminDashboardLayout } from "@/components/admin/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ApplicationDetailsDialog } from "@/components/ApplicationDetailsDialog";
import { StudentDetailsDialog } from "@/components/StudentDetailsDialog";
import { useProfile } from "@/contexts/ProfileContext";
import { StatusBadge } from "@/components/ui/status-badge";

interface Applicant {
  id: string;
  name: string;
  stdYear: string;
  date: string;
  department: string;
  status: string;
  type: string;
  raw: any;
}

const AdminViewApplicantPage = () => {
  const { id } = useParams<{ id: string }>();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useProfile();

  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isAppDetailsOpen, setIsAppDetailsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isStudentProfileOpen, setIsStudentProfileOpen] = useState(false);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("application")
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
        .order("created_at", { ascending: false });

      if (id && id !== "all") {
        query = query.eq("opportunity_id", parseInt(id, 10));
      }

      const { data: apps, error: appsError } = await query;

      if (appsError) throw appsError;
      if (!apps || apps.length === 0) {
        setApplicants([]);
        return;
      }

      const formattedApplicants: Applicant[] = apps.map((app: any) => {
        const studentProfile = app.student_profile;
        const user = studentProfile?.user;
        const isAdminProject = !app.opportunity?.company_id || app.opportunity?.company_id === profile.companyId;
        
        return {
          id: app.id.toString(),
          name: user?.full_name || "Unknown Applicant",
          stdYear: studentProfile?.grad_year?.toString() || "-",
          date: new Date(app.created_at).toLocaleDateString(),
          department: studentProfile?.major || "-",
          status: app.status || "pending",
          type: isAdminProject ? "Admin" : "Company",
          raw: app
        };
      });

      setApplicants(formattedApplicants);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const handleViewApplication = (applicantData: any) => {
    setSelectedApplication(applicantData.raw);
    setIsAppDetailsOpen(true);
  };

  const handleViewStudentProfile = (student: any) => {
    setSelectedStudent(student);
    setIsStudentProfileOpen(true);
  };

  const handleAppDetailsOpenChange = (open: boolean) => {
    setIsAppDetailsOpen(open);
    if (!open) setSelectedApplication(null);
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">View Applicants</h1>

        <div className="admin-dashboard-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">ID</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">NAME</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Std-Year</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">DATE</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Dep</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">TYPE</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">STATUS</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                      Loading applicants...
                    </td>
                  </tr>
                ) : applicants.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  applicants.map((applicant) => (
                    <tr
                      key={applicant.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-muted-foreground">{applicant.id}</td>
                      <td className="py-4 px-6 text-sm font-medium text-foreground">{applicant.name}</td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">{applicant.stdYear}</td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">{applicant.date}</td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">{applicant.department}</td>
                      <td className="py-4 px-6 text-sm font-medium">
                        <span className={`px-2 py-1 rounded text-xs ${applicant.type === 'Admin' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                          {applicant.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <StatusBadge status={applicant.status} />
                      </td>
                      <td className="py-4 px-6">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleViewApplication(applicant)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <ApplicationDetailsDialog 
          open={isAppDetailsOpen} 
          onOpenChange={handleAppDetailsOpenChange} 
          application={selectedApplication}
          onStatusUpdate={fetchApplicants}
          onViewProfile={handleViewStudentProfile}
          readOnly={selectedApplication?.opportunity?.company_id !== profile.companyId}
        />

        <StudentDetailsDialog 
          open={isStudentProfileOpen} 
          onOpenChange={setIsStudentProfileOpen} 
          student={selectedStudent} 
        />
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminViewApplicantPage;
