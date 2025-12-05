import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift } from "lucide-react";

const applicants = [
  {
    name: "Christine Brooks",
    skills: "ui&ux",
    project: "project B",
    status: "pending" as const,
    showPay: false,
  },
  {
    name: "Christine Brooks",
    skills: "Backend",
    project: "project A",
    status: "accepted" as const,
    showPay: true,
  },
  {
    name: "Rosie Pearson",
    skills: "Frontend",
    project: "project C",
    status: "rejected" as const,
    showPay: false,
  },
  {
    name: "Darrell Caldwell",
    skills: "Mobile App",
    project: "project III",
    status: "accepted" as const,
    showPay: true,
  },
  {
    name: "Gilbert Johnston",
    skills: "Web Devlopment",
    project: "project F",
    status: "accepted" as const,
    showPay: true,
  },
  {
    name: "Alan Cain",
    skills: "Web Devlopment",
    project: "project D",
    status: "rejected" as const,
    showPay: false,
  },
  {
    name: "Alfred Murray",
    skills: "ui&ux",
    project: "project Z",
    status: "accepted" as const,
    showPay: true,
  },
  {
    name: "Maggie Sullivan",
    skills: "Backend",
    project: "project W",
    status: "accepted" as const,
    showPay: true,
  },
  {
    name: "Rosie Todd",
    skills: "Web Devlopment",
    project: "project J",
    status: "pending" as const,
    showPay: false,
  },
];

export default function Applicants() {
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
                {applicants.map((applicant, index) => (
                  <tr key={index} className="border-b border-border last:border-0">
                    <td className="p-4 text-sm">{applicant.name}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {applicant.skills}
                    </td>
                    <td className="p-4 text-sm">{applicant.project}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={applicant.status} />
                        {applicant.showPay && (
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
