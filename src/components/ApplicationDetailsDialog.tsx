import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, User, Check, X, Download } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface ApplicationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: any;
  onStatusUpdate: () => void;
  onViewProfile: (student: any) => void;
}

export function ApplicationDetailsDialog({
  open,
  onOpenChange,
  application,
  onStatusUpdate,
  onViewProfile
}: ApplicationDetailsDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!application) return null;

  const student = application.student_profile;
  const user = student?.user;
  const opportunity = application.opportunity;

  const handleStatusUpdate = async (newStatus: 'accepted' | 'rejected') => {
    try {
      setIsUpdating(true);
      // TODO: replace with .NET endpoint when available
      toast.info("Status update endpoint not yet connected.");
      onStatusUpdate();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update application status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4">
            <span className="truncate">Application for {opportunity?.title}</span>
            <Badge variant={
              application.status === 'accepted' ? 'default' :
              application.status === 'rejected' ? 'destructive' : 'secondary'
            }>
              {application.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-semibold">{user?.full_name || 'Unknown Applicant'}</h3>
                  <p className="text-sm text-muted-foreground">{student?.major || 'No Major'}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => onViewProfile(student)}>
                <User className="h-4 w-4 mr-2" />
                View Profile
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Proposal
              </h4>
              <div className="p-4 rounded-lg border bg-card text-sm leading-relaxed whitespace-pre-wrap">
                {application.proposal || "No proposal submitted."}
              </div>
            </div>

            {(application.cv || student?.cv_url) && (
              <div className="space-y-2">
                <h4 className="font-semibold">Documents</h4>
                <div className="flex gap-2">
                  {application.cv && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={application.cv} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Application CV
                      </a>
                    </Button>
                  )}
                  {student?.cv_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={student.cv_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Student CV
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground pt-4 border-t">
              Applied on {new Date(application.created_at).toLocaleDateString()}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <div className="flex w-full justify-end gap-2">
            {application.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={isUpdating}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleStatusUpdate('accepted')}
                  disabled={isUpdating}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Accept
                </Button>
              </>
            )}
            {application.status !== 'pending' && (
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
