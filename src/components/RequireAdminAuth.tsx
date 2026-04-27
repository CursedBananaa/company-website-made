import { Navigate } from "react-router-dom";
import { useProfile } from "@/contexts/ProfileContext";

export function RequireAdminAuth({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useProfile();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (profile.role !== "admin") {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
