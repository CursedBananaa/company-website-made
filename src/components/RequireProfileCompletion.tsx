import { useProfile } from "@/contexts/ProfileContext";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export const RequireProfileCompletion = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useProfile();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // If role is not company, no need to check
  const isCompany = profile.role === 'company';
  
  // Check for required fields
  const isProfileComplete = 
    profile.website && 
    profile.industry && 
    profile.description;

  useEffect(() => {
    if (isCompany && !isProfileComplete && location.pathname !== '/profile') {
      toast.error("Please complete your company profile to continue", {
        id: "profile-completion-toast" // Prevent duplicate toasts
      });
      setShouldRedirect(true);
    }
  }, [isCompany, isProfileComplete, location.pathname]);

  if (shouldRedirect) {
    return <Navigate to="/profile" replace />;
  }

  // If we are on profile page, allow rendering regardless of completion status
  // If not company, allow rendering
  // If complete, allow rendering
  return <>{children}</>;
};
