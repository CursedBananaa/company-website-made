import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/components/admin/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  ClipboardCheck,
  Search,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function AdminTrainingSubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("training_submissions")
        .select(
          `
          *,
          student_profile: student_id (
            university,
            major,
            user: user_id (
              full_name
            )
          )
        `,
        )
        .eq("status", "pending");

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load training submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submission: any) => {
    try {
      setIsUpdating(true);

      // 1. Update training submission status to approved
      const { error } = await supabase
        .from("training_submissions")
        .update({ status: "approved" })
        .eq("id", submission.id);

      if (error) throw error;

      // 2. Check if the application is waiting for Admin review (Company already completed it)
      const { data: appData } = await supabase
        .from("application")
        .select("status, student_id, opportunity_id")
        .eq("student_id", submission.student_id)
        .eq("opportunity_id", submission.training_id)
        .single();

      if (appData && appData.status === "completed_by_company") {
        // Fetch opportunity duration to update training days
        const { data: oppData } = await supabase
          .from("opportunity")
          .select("duration")
          .eq("id", submission.training_id)
          .single();

        // Finalize the project
        await supabase
          .from("application")
          .update({ status: "completed" })
          .eq("student_id", submission.student_id)
          .eq("opportunity_id", submission.training_id);

        await supabase.from("completed_opportunity").insert({
          student_id: submission.student_id,
          opportunity_id: submission.training_id,
          confirmed_by_company: true,
          confirmed_by_student: true,
          confirmed_by_payment: false,
        });

        // Update student training days if opportunity exists
        if (oppData?.duration) {
          const { data: studentData } = await supabase
            .from("student_profile")
            .select("training_days")
            .eq("id", submission.student_id)
            .single();

          if (studentData) {
            const currentDays = Number(studentData.training_days || 0);
            const additionalDays = Number(oppData.duration);

            await supabase
              .from("student_profile")
              .update({ training_days: currentDays + additionalDays })
              .eq("id", submission.student_id);
          }
        }

        await supabase
          .from("assignment")
          .delete()
          .eq("student_id", submission.student_id)
          .eq("opportunity_id", submission.training_id);

        toast.success("Submission approved and Project Finalized!");
      } else {
        toast.success("Submission approved successfully");
      }

      fetchSubmissions();
    } catch (error) {
      console.error("Error approving submission:", error);
      toast.error("Failed to approve submission");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!rejectingId) return;
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from("training_submissions")
        .update({
          status: "rejected",
          admin_notes: rejectNotes,
        })
        .eq("id", rejectingId);

      if (error) throw error;

      toast.success("Submission rejected");
      setRejectingId(null);
      setRejectNotes("");
      fetchSubmissions();
    } catch (error) {
      console.error("Error rejecting submission:", error);
      toast.error("Failed to reject submission");
    } finally {
      setIsUpdating(false);
    }
  };

  const FileLink = ({
    url,
    icon: Icon,
    label,
  }: {
    url: string;
    icon: any;
    label: string;
  }) => {
    if (!url) return <span className="text-muted-foreground">-</span>;
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:text-primary/80 transition-colors inline-block p-1"
        title={label}
      >
        <Icon className="h-5 w-5" />
      </a>
    );
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Training Submissions</h1>
          <p className="text-muted-foreground">
            Review and approve student training documents
          </p>
        </div>

        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Major</TableHead>
                <TableHead>Training Details</TableHead>
                <TableHead className="text-center">Documents</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    Loading submissions...
                  </TableCell>
                </TableRow>
              ) : submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    No pending submissions found.
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">
                      {sub.student_profile?.user?.full_name || "N/A"}
                    </TableCell>
                    <TableCell>{sub.student_profile?.major || "N/A"}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>ID: {sub.training_id || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted:{" "}
                          {new Date(sub.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <FileLink
                          url={sub.certificate_url}
                          icon={FileText}
                          label="Certificate"
                        />
                        <FileLink
                          url={sub.report_url}
                          icon={FileSpreadsheet}
                          label="Report"
                        />
                        <FileLink
                          url={sub.presentation_url}
                          icon={Presentation}
                          label="Presentation"
                        />
                        <FileLink
                          url={sub.company_evaluation_url}
                          icon={ClipboardCheck}
                          label="Company Evaluation"
                        />
                        <FileLink
                          url={sub.student_survey_url}
                          icon={Search}
                          label="Student Survey"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => setRejectingId(sub.id)}
                          disabled={isUpdating}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(sub)}
                          disabled={isUpdating}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog
        open={!!rejectingId}
        onOpenChange={(open) => !open && setRejectingId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this training submission.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason or notes..."
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectingId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectNotes.trim() || isUpdating}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminDashboardLayout>
  );
}
