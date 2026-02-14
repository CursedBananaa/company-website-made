import { useProfile } from "@/contexts/ProfileContext";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export const RequireProfileCompletion = ({ children }: { children: React.ReactNode }) => {
  const { profile, loading } = useProfile();
  const location = useLocation();
  const [shouldRedirectToProfile, setShouldRedirectToProfile] = useState(false);
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    if (!loading && profile.userId && profile.role === 'company') {
        const isProfileComplete = profile.website && profile.industry && profile.description;
        if (!isProfileComplete && location.pathname !== '/profile') {
            if (!hasShownToast) {
                toast.error("Please complete your company profile to continue");
                setHasShownToast(true);
            }
            setShouldRedirectToProfile(true);
        }
    }
  }, [loading, profile, location.pathname, hasShownToast]);

  if (loading) {
      return <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>;
  }

  if (!profile.userId) {
      return <Navigate to="/auth" replace />;
  }

  if (shouldRedirectToProfile) {
      return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};
