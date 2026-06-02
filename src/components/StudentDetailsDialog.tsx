import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Github,
  FileText,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: any; // We'll type this properly if possible, or use any for now given the join complexity
}

export function StudentDetailsDialog({
  open,
  onOpenChange,
  student,
}: StudentDetailsDialogProps) {
  if (!student) return null;

  const user = student.user || {};
  const initials =
    user.full_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "ST";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col items-center space-y-4 pt-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.profile_picture} alt={user.full_name} />
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold">{user.full_name}</h2>
              <p className="text-muted-foreground">{student.major} Student</p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span>{student.university}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Contact Info */}
            <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
              <h3 className="font-semibold flex items-center gap-2">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-muted-foreground text-xs">Email</p>
                    <p className="font-medium truncate" title={user.email}>
                      {user.email}
                    </p>
                  </div>
                </div>
                {user.phone_number && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Phone</p>
                      <p className="font-medium">{user.phone_number}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Academic Info */}
            <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
              <h3 className="font-semibold flex items-center gap-2">
                Academic Details
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Major</p>
                    <p className="text-sm font-medium">
                      {student.major || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Graduation Year
                    </p>
                    <p className="text-sm font-medium">
                      {student.grad_year || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Training Days
                    </p>
                    <p className="text-sm font-medium">
                      {student.training_days || 0} Days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          {student.student_skills && student.student_skills.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {student.student_skills.map((skill: any, index: number) => (
                  <Badge key={index} variant="secondary">
                    {skill.skill_name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Work History / Applications */}
          {student.application && student.application.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center justify-between">
                <span>Work History</span>
                <Badge
                  variant={
                    student.application.some((app: any) =>
                      [
                        "accepted",
                        "ongoing",
                        "in_review",
                        "completed",
                      ].includes(app.status),
                    )
                      ? "default"
                      : "outline"
                  }
                >
                  {student.application.some((app: any) =>
                    ["accepted", "ongoing", "in_review"].includes(app.status),
                  )
                    ? "Currently Working"
                    : "Available"}
                </Badge>
              </h3>
              <div className="space-y-2 border rounded-md p-2 max-h-[200px] overflow-y-auto">
                {student.application.map((app: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm p-2 hover:bg-muted/50 rounded-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {app.opportunity?.title || "Unknown Project"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {app.opportunity?.company_profile?.industry ||
                          "Unknown Industry"}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          ["accepted", "ongoing", "completed"].includes(
                            app.status,
                          )
                            ? "default"
                            : ["rejected", "failed"].includes(app.status)
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {app.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bio Section */}
          {user.bio && (
            <div className="space-y-2">
              <h3 className="font-semibold">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {user.bio}
              </p>
            </div>
          )}

          {/* Links Section */}
          {(student.cv_url || student.github_url) && (
            <div className="flex gap-4 pt-2">
              {student.cv_url && (
                <Button variant="outline" className="flex-1 gap-2" asChild>
                  <a
                    href={student.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-4 w-4" />
                    View CV
                  </a>
                </Button>
              )}
              {student.github_url && (
                <Button variant="outline" className="flex-1 gap-2" asChild>
                  <a
                    href={student.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4" />
                    GitHub Profile
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
