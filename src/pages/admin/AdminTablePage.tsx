import { useState } from "react";
import { AdminDashboardLayout } from "@/components/admin/DashboardLayout";
import { Filter, ChevronDown, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Student {
  id: string;
  name: string;
  stdYear: string;
  date: string;
  department: string;
  appliedInternship: string;
}

const students: Student[] = [
  { id: "00001", name: "Christine Brooks", stdYear: "1st year", date: "04 Sep 2019", department: "Electric", appliedInternship: "We (big data)" },
  { id: "00002", name: "Rosie Pearson", stdYear: "979 Immanuel Ferry Suite 526", date: "28 May 2019", department: "computer", appliedInternship: "We (big data)" },
  { id: "00003", name: "Darrell Caldwell", stdYear: "8587 Frida Ports", date: "23 Nov 2019", department: "", appliedInternship: "Nothing" },
  { id: "00004", name: "Gilbert Johnston", stdYear: "768 Destiny Lake Suite 600", date: "05 Feb 2019", department: "Mobile", appliedInternship: "We (big data)" },
  { id: "00005", name: "Alan Cain", stdYear: "042 Mylene Throughway", date: "29 Jul 2019", department: "", appliedInternship: "Watch" },
  { id: "00006", name: "Alfred Murray", stdYear: "543 Weinmann Mountain", date: "15 Aug 2019", department: "", appliedInternship: "Medicine" },
  { id: "00007", name: "Maggie Sullivan", stdYear: "New Scottieberg", date: "21 Dec 2019", department: "", appliedInternship: "Watch" },
  { id: "00008", name: "Rosie Todd", stdYear: "New Jon", date: "30 Apr 2019", department: "", appliedInternship: "Medicine" },
];

const AdminTablePage = () => {
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
                {students.map((student, index) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminTablePage;
