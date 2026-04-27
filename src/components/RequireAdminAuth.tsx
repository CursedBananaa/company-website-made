import { Navigate } from "react-router-dom";

export function RequireAdminAuth({ children }: { children: React.ReactNode }) {
  const isAdmin = localStorage.getItem("isAdminLoggedIn") === "true";
  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}
