import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { cn } from "@/lib/utils";

interface Applicant {
  id: string;
  name: string;
  stdYear: string;
  date: string;
  department: string;
}

const applicants: Applicant[] = [
  { id: "00001", name: "Christine Brooks", stdYear: "1st year", date: "04 Sep 2019", department: "Electric" },
  { id: "00002", name: "Rosie Pearson", stdYear: "979 Immanuel Ferry Suite 526", date: "28 May 2019", department: "computer" },
  { id: "00003", name: "Darrell Caldwell", stdYear: "8587 Frida Ports", date: "23 Nov 2019", department: "" },
  { id: "00004", name: "Gilbert Johnston", stdYear: "768 Destiny Lake Suite 600", date: "05 Feb 2019", department: "Mobile" },
  { id: "00005", name: "Alan Cain", stdYear: "042 Mylene Throughway", date: "29 Jul 2019", department: "" },
  { id: "00006", name: "Alfred Murray", stdYear: "543 Weinmann Mountain", date: "15 Aug 2019", department: "" },
  { id: "00007", name: "Maggie Sullivan", stdYear: "New Scottieberg", date: "21 Dec 2019", department: "" },
  { id: "00008", name: "Rosie Todd", stdYear: "New Jon", date: "30 Apr 2019", department: "" },
];

const ViewApplicantPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">View Applicant</h1>

        {/* Table */}
        <div className="dashboard-card overflow-hidden p-0">
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
                {applicants.map((applicant, index) => (
                  <tr
                    key={applicant.id}
                    className={cn(
                      "border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                    )}
                  >
                    <td className="py-4 px-6 text-sm text-muted-foreground">{applicant.id}</td>
                    <td className="py-4 px-6 text-sm font-medium text-foreground">{applicant.name}</td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">{applicant.stdYear}</td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">{applicant.date}</td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">{applicant.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewApplicantPage;
