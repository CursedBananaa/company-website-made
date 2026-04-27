import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/admin/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";

interface Applicant {
  id: string;
  name: string;
  stdYear: string;
  date: string;
  department: string;
}

const AdminViewApplicantPage = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        // Fetch all applications
        const { data: apps, error: appsError } = await supabase
          .from("application")
          .select("id, created_at, student_id")
          .order("created_at", { ascending: false });

        if (appsError) throw appsError;
        if (!apps || apps.length === 0) {
          setApplicants([]);
          return;
        }

        // Fetch related student profiles
        const studentIds = [...new Set(apps.map(a => a.student_id).filter(Boolean))];
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let profilesData: any[] = [];
        if (studentIds.length > 0) {
          const { data } = await supabase
            .from("student_profile")
            .select("id, u_id, graduation_year, major")
            .in("id", studentIds);
          profilesData = data || [];
        }

        // Fetch related users
        const userIds = [...new Set(profilesData.map(p => p.u_id).filter(Boolean))];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let usersData: any[] = [];
        if (userIds.length > 0) {
          const { data } = await supabase
            .from("user")
            .select("id, full_name")
            .in("id", userIds);
          usersData = data || [];
        }

        // Combine the data
        const formattedApplicants: Applicant[] = apps.map(app => {
          const profile = profilesData.find(p => p.id === app.student_id);
          const user = profile ? usersData.find(u => u.id === profile.u_id) : null;
          
          return {
            id: app.id.toString(),
            name: user?.full_name || "Unknown Applicant",
            stdYear: profile?.graduation_year?.toString() || "-",
            date: new Date(app.created_at).toLocaleDateString(),
            department: profile?.major || "-",
          };
        });

        setApplicants(formattedApplicants);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

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
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      Loading applicants...
                    </td>
                  </tr>
                ) : applicants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminViewApplicantPage;
