import { AdminDashboardLayout } from "@/components/admin/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown, ChevronUp, Eye, Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef, useEffect } from "react";
import { StudentDetailsDialog } from "@/components/StudentDetailsDialog";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";

type SortField = "name" | "id" | "grad_year" | "major" | null;
type SortDir = "asc" | "desc";

export default function AdminTablePage() {
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [filterMajor, setFilterMajor] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilterPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: students, isLoading } = useQuery({
    queryKey: ["admin_students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_profile")
        .select(`
          *,
          user (
            id,
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
              is_paid,
              company_profile (
                industry
              )
            )
          )
        `);
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (highlightId && students && students.length > 0) {
      setTimeout(() => {
        const element = document.getElementById(`student-${highlightId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    }
  }, [highlightId, students]);

  const handleViewDetails = (student: any) => {
    setSelectedStudent(student);
    setIsDetailsOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDetailsOpen(open);
    if (!open) setSelectedStudent(null);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc"
      ? <ChevronUp className="h-3 w-3 text-primary" />
      : <ChevronDown className="h-3 w-3 text-primary" />;
  };

  const allMajors = [...new Set(students?.map((s: any) => s.major).filter(Boolean))].sort() as string[];
  const allYears = [...new Set(students?.map((s: any) => s.grad_year).filter(Boolean))].sort() as string[];

  const activeFilterCount = [filterMajor, filterYear].filter(Boolean).length;

  const processedStudents = students
    ?.filter((student: any) => {
      const name = student.user?.full_name?.toLowerCase() || "";
      const major = student.major?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();
      const matchesSearch = name.includes(query) || major.includes(query);
      const matchesMajor = filterMajor ? student.major === filterMajor : true;
      const matchesYear = filterYear ? String(student.grad_year) === filterYear : true;
      return matchesSearch && matchesMajor && matchesYear;
    })
    .sort((a: any, b: any) => {
      if (!sortField) return 0;
      let aVal = "";
      let bVal = "";
      if (sortField === "name") { aVal = a.user?.full_name || ""; bVal = b.user?.full_name || ""; }
      else if (sortField === "id") { aVal = String(a.id); bVal = String(b.id); }
      else if (sortField === "grad_year") { aVal = String(a.grad_year || ""); bVal = String(b.grad_year || ""); }
      else if (sortField === "major") { aVal = a.major || ""; bVal = b.major || ""; }
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Student Data</h1>

        <Card>
          <CardContent className="p-0">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-border bg-muted/50">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, major..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background"
                />
              </div>
              <div className="flex items-center gap-2 relative" ref={filterRef}>
                <Button
                  variant={activeFilterCount > 0 ? "default" : "ghost"}
                  size="sm"
                  className={activeFilterCount > 0 ? "gap-2" : "text-muted-foreground gap-2"}
                  onClick={() => setShowFilterPanel((v) => !v)}
                >
                  <Filter className="h-4 w-4" />
                  Filter By
                  {activeFilterCount > 0 && (
                    <span className="bg-white text-primary rounded-full w-4 h-4 text-xs flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>

                {showFilterPanel && (
                  <div className="absolute top-10 right-0 z-50 bg-popover border border-border rounded-xl shadow-xl p-4 w-64 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Filters</span>
                      {activeFilterCount > 0 && (
                        <button
                          className="text-xs text-destructive hover:underline flex items-center gap-1"
                          onClick={() => { setFilterMajor(""); setFilterYear(""); }}
                        >
                          <X className="h-3 w-3" /> Clear all
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Department / Major</label>
                      <select
                        className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        value={filterMajor}
                        onChange={(e) => setFilterMajor(e.target.value)}
                      >
                        <option value="">All Majors</option>
                        {allMajors.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Graduation Year</label>
                      <select
                        className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                      >
                        <option value="">All Years</option>
                        {allYears.map((y) => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <Button size="sm" className="w-full" onClick={() => setShowFilterPanel(false)}>Apply</Button>
                  </div>
                )}

                <Button
                  variant={sortField === "name" ? "secondary" : "ghost"}
                  size="sm"
                  className="text-muted-foreground gap-1"
                  onClick={() => handleSort("name")}
                >
                  Name <SortIcon field="name" />
                </Button>
                <Button
                  variant={sortField === "id" ? "secondary" : "ghost"}
                  size="sm"
                  className="text-muted-foreground gap-1"
                  onClick={() => handleSort("id")}
                >
                  ID <SortIcon field="id" />
                </Button>
                <Button
                  variant={sortField === "grad_year" ? "secondary" : "ghost"}
                  size="sm"
                  className="text-muted-foreground gap-1"
                  onClick={() => handleSort("grad_year")}
                >
                  Year <SortIcon field="grad_year" />
                </Button>
                <Button
                  variant={sortField === "major" ? "secondary" : "ghost"}
                  size="sm"
                  className="text-muted-foreground gap-1"
                  onClick={() => handleSort("major")}
                >
                  Major <SortIcon field="major" />
                </Button>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/20 flex-wrap">
                <span className="text-xs text-muted-foreground">Active filters:</span>
                {filterMajor && (
                  <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    Major: {filterMajor}
                    <button onClick={() => setFilterMajor("")}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {filterYear && (
                  <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    Year: {filterYear}
                    <button onClick={() => setFilterYear("")}><X className="h-3 w-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Table */}
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
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading students...</td></tr>
                  ) : processedStudents?.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No students found.</td></tr>
                  ) : (
                    processedStudents?.map((student: any) => (
                      <tr
                        key={student.id}
                        id={`student-${student.id}`}
                        className={`border-b border-border last:border-0 hover:bg-muted/20 transition-all duration-1000 ${
                          highlightId === student.id.toString()
                            ? "bg-amber-500/10 border-l-4 border-l-amber-500 shadow-sm"
                            : ""
                        }`}
                      >
                        <td className="p-4 text-sm text-muted-foreground">#{student.id}</td>
                        <td className="p-4 text-sm font-medium">{student.user?.full_name || "Unknown"}</td>
                        <td className="p-4 text-sm text-muted-foreground">{student.grad_year || "N/A"}</td>
                        <td className="p-4 text-sm text-muted-foreground">{new Date(student.created_at).toLocaleDateString()}</td>
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
                    ))
                  )}
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
    </AdminDashboardLayout>
  );
}
