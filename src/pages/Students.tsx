import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown } from "lucide-react";

const students = [
  { id: "00001", name: "Christine Brooks", year: "1_St Year", date: "04 Sep 2019", dep: "Electric" },
  { id: "00002", name: "Rosie Pearson", year: "3_St Year", date: "28 May 2019", dep: "computer" },
  { id: "00003", name: "Darrell Caldwell", year: "4_St Year", date: "23 Nov 2019", dep: "Electric" },
  { id: "00004", name: "Gilbert Johnston", year: "3St Year", date: "05 Feb 2019", dep: "Mobile" },
  { id: "00005", name: "Alan Cain", year: "2_St Year", date: "29 Jul 2019", dep: "Watch" },
  { id: "00006", name: "Alfred Murray", year: "4_St Year", date: "15 Aug 2019", dep: "Medicine" },
  { id: "00007", name: "Maggie Sullivan", year: "1_St Year", date: "21 Dec 2019", dep: "Watch" },
  { id: "00008", name: "Rosie Todd", year: "New Jon", date: "30 Apr 2019", dep: "Medicine" },
];

export default function Students() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Student Data</h1>

        <Card>
          <CardContent className="p-0">
            {/* Filter Bar */}
            <div className="flex items-center gap-4 p-4 border-b border-border bg-muted/50">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Filter className="h-4 w-4 mr-2" />
                Filter By
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Name
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                ID
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Status
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                student Member
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Table */}
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 font-medium text-muted-foreground">ID</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">NAME</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Std-Year</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">DATE</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Dep</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm text-muted-foreground">{student.id}</td>
                    <td className="p-4 text-sm">{student.name}</td>
                    <td className="p-4 text-sm text-muted-foreground">{student.year}</td>
                    <td className="p-4 text-sm text-muted-foreground">{student.date}</td>
                    <td className="p-4 text-sm text-muted-foreground">{student.dep}</td>
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
