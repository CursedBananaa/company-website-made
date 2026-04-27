import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/admin/DashboardLayout";
import { Filter, ChevronDown, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

import { supabase } from "@/integrations/supabase/client";

interface Student {
  id: string;
  name: string;
  stdYear: string;
  date: string;
  department: string;
  appliedInternship: string;
}

const AdminTablePage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        // Fetch users with role student
        const { data: users } = await supabase
          .from("user")
          .select("*, student_profile(*)")
          .eq("role", "student");

        // Fetch applications to see internships
        const { data: applications } = await supabase
          .from("application")
          .select("student_id, opportunity_id, opportunity(title)");

        if (users) {
          const formattedStudents = users.map(user => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const profiles = (user as any).student_profile || [];
            const profile = Array.isArray(profiles) ? profiles[0] : profiles;
            
            // Find applications for this student
            const studentApps = applications?.filter(app => app.student_id === user.id) || [];
            let appliedText = "None";
            if (studentApps.length === 1) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              appliedText = (studentApps[0] as any).opportunity?.title || "Unknown";
            } else if (studentApps.length > 1) {
              appliedText = `${studentApps.length} Applications`;
            }

            return {
              id: user.id.toString().padStart(5, '0'),
              name: user.full_name || "Unknown",
              stdYear: profile?.grad_year || "Unknown",
              date: new Date(user.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              department: profile?.major || "Unknown",
              appliedInternship: appliedText,
            };
          });
          setStudents(formattedStudents);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Student Table</h1>

        <div className="flex flex-wrap items-center gap-3">
          <button className="admin-filter-button flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter By
          </button>
          <button className="admin-filter-button flex items-center gap-2">
            Name
            <ChevronDown className="h-4 w-4" />
          </button>
          <button className="admin-filter-button flex items-center gap-2">
            ID Number
            <ChevronDown className="h-4 w-4" />
          </button>
          <button className="admin-filter-button flex items-center gap-2">
            Status
            <ChevronDown className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors">
            <RotateCcw className="h-4 w-4" />
            Reset Filter
          </button>
        </div>

        <div className="admin-dashboard-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">ID</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">NAME</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Std-Year</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">DATE</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Dep</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Applied Internship</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">No students found</td>
                  </tr>
                ) : (
                  students.map((student, index) => (
                    <tr
                      key={student.id}
                      className={cn(
                        "border-b border-border last:border-0 hover:bg-muted/50 transition-colors",
                        index % 2 === 0 ? "bg-card" : "bg-muted/20"
                      )}
                    >
                      <td className="py-4 px-6 text-sm text-muted-foreground">{student.id}</td>
                      <td className="py-4 px-6 text-sm font-medium text-foreground">{student.name}</td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">{student.stdYear}</td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">{student.date}</td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">{student.department}</td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">{student.appliedInternship}</td>
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

export default AdminTablePage;
