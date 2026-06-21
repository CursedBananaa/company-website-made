import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { RequireProfileCompletion } from "@/components/RequireProfileCompletion";
import { RequireAdminAuth } from "@/components/RequireAdminAuth";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Applicants from "./pages/Applicants";
import Students from "./pages/Students";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";

// Admin pages
import AdminIndex from "./pages/admin/AdminIndex";
import AdminTablePage from "./pages/admin/AdminTablePage";
import AdminInboxPage from "./pages/admin/AdminInboxPage";
import AdminOpportunitiesPage from "./pages/admin/AdminOpportunitiesPage";
import AdminViewApplicantPage from "./pages/admin/AdminViewApplicantPage";
import AdminAnnouncementPage from "./pages/admin/AdminAnnouncementPage";
import AdminAddAnnouncementPage from "./pages/admin/AdminAddAnnouncementPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import AdminTrainingSubmissionsPage from "./pages/admin/AdminTrainingSubmissionsPage";

const queryClient = new QueryClient();

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="dashboard-theme">
    <QueryClientProvider client={queryClient}>
      <ProfileProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={basename}>
            <Routes>
              {/* ── Public ─────────────────────────────────── */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<Auth />} />

              {/* ── Company (protected) ────────────────────── */}
              <Route
                path="/home"
                element={
                  <RequireProfileCompletion>
                    <Home />
                  </RequireProfileCompletion>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <RequireProfileCompletion>
                    <Dashboard />
                  </RequireProfileCompletion>
                }
              />
              <Route
                path="/projects"
                element={
                  <RequireProfileCompletion>
                    <Projects />
                  </RequireProfileCompletion>
                }
              />
              <Route
                path="/applicants"
                element={
                  <RequireProfileCompletion>
                    <Applicants />
                  </RequireProfileCompletion>
                }
              />
              <Route
                path="/students"
                element={
                  <RequireProfileCompletion>
                    <Students />
                  </RequireProfileCompletion>
                }
              />
              <Route
                path="/messages"
                element={
                  <RequireProfileCompletion>
                    <Messages />
                  </RequireProfileCompletion>
                }
              />
              <Route
                path="/settings"
                element={
                  <RequireProfileCompletion>
                    <Settings />
                  </RequireProfileCompletion>
                }
              />
              <Route
                path="/payment"
                element={
                  <RequireProfileCompletion>
                    <Payment />
                  </RequireProfileCompletion>
                }
              />
              <Route path="/profile" element={<Profile />} />

              {/* ── Admin (protected by RequireAdminAuth) ──── */}
              <Route
                path="/admin"
                element={
                  <RequireAdminAuth>
                    <AdminIndex />
                  </RequireAdminAuth>
                }
              />
              <Route
                path="/admin/table"
                element={
                  <RequireAdminAuth>
                    <AdminTablePage />
                  </RequireAdminAuth>
                }
              />
              <Route
                path="/admin/inbox"
                element={
                  <RequireAdminAuth>
                    <AdminInboxPage />
                  </RequireAdminAuth>
                }
              />
              <Route
                path="/admin/opportunities"
                element={
                  <RequireAdminAuth>
                    <AdminOpportunitiesPage />
                  </RequireAdminAuth>
                }
              />
              <Route
                path="/admin/opportunities/:id/applicants"
                element={
                  <RequireAdminAuth>
                    <AdminViewApplicantPage />
                  </RequireAdminAuth>
                }
              />
              <Route
                path="/admin/announcement"
                element={
                  <RequireAdminAuth>
                    <AdminAnnouncementPage />
                  </RequireAdminAuth>
                }
              />
              <Route
                path="/admin/announcement/add"
                element={
                  <RequireAdminAuth>
                    <AdminAddAnnouncementPage />
                  </RequireAdminAuth>
                }
              />
              <Route
                path="/admin/announcement/edit/:id"
                element={
                  <RequireAdminAuth>
                    <AdminAddAnnouncementPage />
                  </RequireAdminAuth>
                }
              />
              <Route
                path="/admin/training-submissions"
                element={
                  <RequireAdminAuth>
                    <AdminTrainingSubmissionsPage />
                  </RequireAdminAuth>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <RequireAdminAuth>
                    <AdminSettingsPage />
                  </RequireAdminAuth>
                }
              />
              <Route
                path="/admin/profile"
                element={
                  <RequireAdminAuth>
                    <AdminProfilePage />
                  </RequireAdminAuth>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ProfileProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
