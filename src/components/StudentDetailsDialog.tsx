import { useState, useEffect } from "react";
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
  GraduationCap,
  Github,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/contexts/ProfileContext";
import { supabaseAdmin } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
  const { profile } = useProfile();
  const isAdmin = profile?.role === 'admin';
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editing form states
  const [editData, setEditData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    university: "",
    major: "",
    gradYear: "",
    trainingDays: "",
    cvUrl: "",
    githubUrl: "",
  });

  // Sync editData when student changes or editing starts
  useEffect(() => {
    if (student) {
      const u = student.user || {};
      setEditData({
        fullName: u.full_name || "",
        email: u.email || "",
        phoneNumber: u.phone_number || "",
        bio: u.bio || "",
        university: student.university || "",
        major: student.major || "",
        gradYear: student.grad_year || "",
        trainingDays: student.training_days?.toString() || "0",
        cvUrl: student.cv_url || "",
        githubUrl: student.github_url || "",
      });
    }
    setIsEditing(false);
  }, [student, open]);

  if (!student) return null;

  const user = student.user || {};
  const initials =
    user.full_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "ST";

  const handleSave = async () => {
    if (!student || !student.user) return;
    setIsSaving(true);
    try {
      // 1. Update user table
      const { error: userError } = await supabaseAdmin
        .from('user')
        .update({
          full_name: editData.fullName,
          email: editData.email,
          phone_number: editData.phoneNumber,
          bio: editData.bio,
        })
        .eq('id', student.user.id);

      if (userError) throw userError;

      // 2. Update student_profile table
      const { error: profileError } = await supabaseAdmin
        .from('student_profile')
        .update({
          university: editData.university,
          major: editData.major,
          grad_year: editData.gradYear,
          training_days: Number(editData.trainingDays) || 0,
          cv_url: editData.cvUrl,
          github_url: editData.githubUrl,
        })
        .eq('id', student.id);

      if (profileError) throw profileError;

      toast.success("Student data updated successfully!");
      
      // Invalidate queries to refresh parent list
      await queryClient.invalidateQueries({ queryKey: ['admin_students'] });
      await queryClient.invalidateQueries({ queryKey: ['students'] });
      
      setIsEditing(false);
      onOpenChange(false); // Close the dialog after successful edit so parent table can show fresh data
    } catch (error: any) {
      console.error("Error saving student data:", error);
      toast.error(error.message || "Failed to save student data");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pr-8">
          <DialogTitle>Student Profile</DialogTitle>
          {isAdmin && (
            <Button
              variant={isEditing ? "ghost" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              disabled={isSaving}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          )}
        </DialogHeader>

        {isEditing ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editData.fullName}
                onChange={(e) => setEditData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Full Name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editData.phoneNumber}
                  onChange={(e) => setEditData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="Phone Number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-university">University</Label>
                <Input
                  id="edit-university"
                  value={editData.university}
                  onChange={(e) => setEditData(prev => ({ ...prev, university: e.target.value }))}
                  placeholder="University"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-major">Major</Label>
                <Input
                  id="edit-major"
                  value={editData.major}
                  onChange={(e) => setEditData(prev => ({ ...prev, major: e.target.value }))}
                  placeholder="Major"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-grad-year">Graduation Year</Label>
                <Input
                  id="edit-grad-year"
                  value={editData.gradYear}
                  onChange={(e) => setEditData(prev => ({ ...prev, gradYear: e.target.value }))}
                  placeholder="e.g. 2026"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-training-days">Training Days</Label>
                <Input
                  id="edit-training-days"
                  type="number"
                  value={editData.trainingDays}
                  onChange={(e) => setEditData(prev => ({ ...prev, trainingDays: e.target.value }))}
                  placeholder="Training Days"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-cv-url">CV URL</Label>
              <Input
                id="edit-cv-url"
                value={editData.cvUrl}
                onChange={(e) => setEditData(prev => ({ ...prev, cvUrl: e.target.value }))}
                placeholder="CV link"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-github-url">GitHub URL</Label>
              <Input
                id="edit-github-url"
                value={editData.githubUrl}
                onChange={(e) => setEditData(prev => ({ ...prev, githubUrl: e.target.value }))}
                placeholder="GitHub link"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-bio">About / Bio</Label>
              <Textarea
                id="edit-bio"
                value={editData.bio}
                onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                className="min-h-[100px]"
                placeholder="Tell us about the student..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        ) : (
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
        )}
      </DialogContent>
    </Dialog>
  );
}
