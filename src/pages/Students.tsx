import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { StudentDetailsDialog } from "@/components/StudentDetailsDialog";

export default function Students() {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async (): Promise<any[]> => {
      // TODO: replace with .NET endpoint when available
      return [];
    },
  });

  const handleViewDetails = (student: any) => {
    setSelectedStudent(student);
    setIsDetailsOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDetailsOpen(open);
    if (!open) setSelectedStudent(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Student Data</h1>

        <Card>
          <CardContent className="p-0">
            <div className="flex items-center gap-4 p-4 border-b border-border bg-muted/50">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Filter className="h-4 w-4 mr-2" />
                Filter By
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Name <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                ID <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Status <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-medium text-muted-foreground">ID</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">NAME</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Std-Year</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Joined Date</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Major</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">Loading students...</td>
                    </tr>
                  ) : students?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">No students found.</td>
                    </tr>
                  ) : students?.map((student: any) => (
                    <tr key={student.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="p-4 text-sm text-muted-foreground">#{student.id}</td>
                      <td className="p-4 text-sm font-medium">{student.user?.full_name || "Unknown"}</td>
                      <td className="p-4 text-sm text-muted-foreground">{student.grad_year || "N/A"}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(student.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{student.major || "N/A"}</td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleViewDetails(student)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <StudentDetailsDialog
          open={isDetailsOpen}
          onOpenChange={handleOpenChange}
          student={selectedStudent}
        />
      </div>
    </DashboardLayout>
  );
}
