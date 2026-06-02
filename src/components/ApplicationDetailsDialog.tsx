import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, User, Check, X, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface ApplicationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: any;
  onStatusUpdate: () => void; // Callback to refresh the list
  onViewProfile: (student: any) => void; // Callback to open student profile
  readOnly?: boolean;
}

export function ApplicationDetailsDialog({
  open,
  onOpenChange,
  application,
  onStatusUpdate,
  onViewProfile,
  readOnly,
}: ApplicationDetailsDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [trainingStatus, setTrainingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (open && application) {
      fetchTrainingStatus();
    }
  }, [open, application]);

  const fetchTrainingStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("training_submissions")
        .select("status")
        .eq("student_id", application.student_id)
        .eq("training_id", application.opportunity_id)
        .maybeSingle();

      if (data) setTrainingStatus(data.status);
    } catch (err) {
      console.error("Error fetching training status:", err);
    }
  };

  if (!application) return null;

  const student = application.student_profile;
  const user = student?.user;
  const opportunity = application.opportunity;

  const handleStatusUpdate = async (
    newStatus:
      | "accepted"
      | "rejected"
      | "completed"
      | "failed"
      | "ongoing"
      | "in_review"
      | "completed_by_company",
  ) => {
    try {
      setIsUpdating(true);

      let statusToUpdate = newStatus;

      // Special handling for completion:
      // Only move to completed_opportunity if training papers are already approved
      if (newStatus === "completed" && trainingStatus !== "approved") {
        statusToUpdate = "completed_by_company";
        toast.info(
          "Company review recorded. Waiting for Admin to approve training papers.",
        );
      }

      // First update the application status
      const { error } = await supabase
        .from("application")
        // @ts-ignore
        .update({ status: statusToUpdate })
        .eq("id", application.id);

      if (error) throw error;

      // If accepted/ongoing, also create an assignment record
      if (newStatus === "ongoing") {
        const { error: assignmentError } = await supabase
          .from("assignment")
          .insert({
            student_id: application.student_id,
            opportunity_id: application.opportunity_id,
          });

        if (assignmentError) {
          console.error("Error creating assignment record:", assignmentError);
          // We don't throw here to avoid failing the whole flow if the assignment insertion fails
          // (e.g. if one somehow already exists), but we log it.
        }
      }

      // If completed, move to completed_opportunity table
      if (statusToUpdate === "completed") {
        const { error: completedError } = await supabase
          .from("completed_opportunity")
          .insert({
            student_id: application.student_id,
            opportunity_id: application.opportunity_id,
            confirmed_by_company: true,
            confirmed_by_student: true, // Assuming student already sent request
            confirmed_by_payment: false,
          });

        if (completedError) {
          console.error(
            "Error creating completed opportunity record:",
            completedError,
          );
        }

        // Update student training days
        if (opportunity?.duration) {
          const currentDays = Number(student?.training_days || 0);
          const additionalDays = Number(opportunity.duration);

          const { error: updateDaysError } = await supabase
            .from("student_profile")
            .update({ training_days: currentDays + additionalDays })
            .eq("id", application.student_id);

          if (updateDaysError) {
            console.error(
              "Error updating student training days:",
              updateDaysError,
            );
          }
        }

        // remove from assignments (as the job is now fully done)
        const { error: deleteError } = await supabase
          .from("assignment")
          .delete()
          .eq("student_id", application.student_id)
          .eq("opportunity_id", application.opportunity_id);

        if (deleteError) {
          console.error("Error removing from assignment table:", deleteError);
        }
      }

      // If failed, remove from assignments
      if (statusToUpdate === "failed") {
        const { error: deleteError } = await supabase
          .from("assignment")
          .delete()
          .eq("student_id", application.student_id)
          .eq("opportunity_id", application.opportunity_id);

        if (deleteError) {
          console.error("Error removing from assignment table:", deleteError);
        }
      }

      toast.success(`Application status updated successfully`);
      onStatusUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update application status");
    } finally {
      setIsUpdating(false);
    }
  };

  const isProposalUrl =
    application.proposal &&
    (application.proposal.startsWith("http://") ||
      application.proposal.startsWith("https://") ||
      application.proposal.includes("www."));

  const getProposalUrl = (url: string) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4">
            <span className="truncate">
              Application for {opportunity?.title}
            </span>
            <Badge
              variant={
                application.status === "accepted" ||
                application.status === "completed" ||
                application.status === "ongoing"
                  ? "default"
                  : application.status === "rejected" ||
                      application.status === "failed"
                    ? "destructive"
                    : application.status === "in_review"
                      ? "secondary"
                      : "secondary"
              }
            >
              {application.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            {/* Applicant Header */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center gap-3">
                {/* Fallback avatar if no image */}
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {user?.full_name?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {user?.full_name || "Unknown Applicant"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {student?.major || "No Major"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewProfile(student)}
              >
                <User className="h-4 w-4 mr-2" />
                View Profile
              </Button>
            </div>

            {/* Proposal */}
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Proposal
              </h4>
              {application.proposal ? (
                isProposalUrl ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start py-3 px-4"
                    onClick={() =>
                      window.open(
                        getProposalUrl(application.proposal),
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                  >
                    <ExternalLink className="h-4 w-4 mr-2 shrink-0" />
                    <span>View Proposal</span>
                  </Button>
                ) : (
                  <div className="p-4 rounded-lg border bg-card text-sm leading-relaxed whitespace-pre-wrap">
                    {application.proposal}
                  </div>
                )
              ) : (
                <div className="p-4 rounded-lg border bg-card text-sm leading-relaxed text-muted-foreground">
                  No proposal submitted.
                </div>
              )}
            </div>

            {/* CV / Documents */}
            {(application.cv || student?.cv_url) && (
              <div className="space-y-2">
                <h4 className="font-semibold">Documents</h4>
                <div className="flex gap-2">
                  {application.cv && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={application.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Application CV
                      </a>
                    </Button>
                  )}
                  {student?.cv_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={student.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Student CV
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {application.notes && (
              <div className="space-y-2">
                <h4 className="font-semibold">Notes</h4>
                <p className="text-sm text-muted-foreground">
                  {application.notes}
                </p>
              </div>
            )}

            <div className="text-xs text-muted-foreground pt-4 border-t flex justify-between items-center">
              <span>
                Applied on{" "}
                {new Date(application.created_at).toLocaleDateString()}
              </span>
              {trainingStatus && (
                <span className="flex items-center gap-1">
                  Training Papers:
                  <Badge
                    variant={
                      trainingStatus === "approved"
                        ? "default"
                        : trainingStatus === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                    className="text-[10px] py-0 h-4"
                  >
                    {trainingStatus}
                  </Badge>
                </span>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <div className="flex w-full justify-between items-center gap-2">
            <div className="flex gap-2">
              {!readOnly && (
                <>
                  {application.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleStatusUpdate("rejected")}
                        disabled={isUpdating}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate("ongoing")}
                        disabled={isUpdating}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                    </>
                  )}

                  {application.status === "ongoing" && (
                    <div className="text-sm text-muted-foreground italic flex items-center mr-4">
                      In Progress...
                    </div>
                  )}

                  {application.status === "completed_by_company" && (
                    <div className="text-sm font-medium text-primary italic flex items-center mr-4">
                      Company work finished. Awaiting Admin Approval...
                    </div>
                  )}

                  {(application.status === "ongoing" ||
                    application.status === "in_review") && (
                    <>
                      <Button
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleStatusUpdate("failed")}
                        disabled={isUpdating}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Failed
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate("completed")}
                        disabled={isUpdating}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Complete
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
