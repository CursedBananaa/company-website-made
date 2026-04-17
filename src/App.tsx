import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { RequireProfileCompletion } from "@/components/RequireProfileCompletion";
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

// Admin pages
import AdminIndex from "./pages/admin/Index";
import AdminTablePage from "./pages/admin/TablePage";
import AdminInboxPage from "./pages/admin/InboxPage";
import AdminOpportunitiesPage from "./pages/admin/OpportunitiesPage";
import AdminAddOpportunityPage from "./pages/admin/AddOpportunityPage";
import AdminViewApplicantPage from "./pages/admin/ViewApplicantPage";
import AdminSettingsPage from "./pages/admin/SettingsPage";
import AdminProfilePage from "./pages/admin/ProfilePage";
import AdminAnnouncementPage from "./pages/admin/AnnouncementPage";
import AdminAddAnnouncementPage from "./pages/admin/AddAnnouncementPage";

import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="dashboard-theme">
    <QueryClientProvider client={queryClient}>
      <ProfileProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<Auth />} />

              {/* Protected Routes that require profile completion */}
              <Route path="/home" element={
                <RequireProfileCompletion>
                  <Home />
                </RequireProfileCompletion>
              } />
              <Route path="/dashboard" element={
                <RequireProfileCompletion>
                  <Dashboard />
                </RequireProfileCompletion>
              } />
              <Route path="/projects" element={
                <RequireProfileCompletion>
                  <Projects />
                </RequireProfileCompletion>
              } />
              <Route path="/applicants" element={
                <RequireProfileCompletion>
                  <Applicants />
                </RequireProfileCompletion>
              } />
              <Route path="/students" element={
                <RequireProfileCompletion>
                  <Students />
                </RequireProfileCompletion>
              } />
              <Route path="/messages" element={
                <RequireProfileCompletion>
                  <Messages />
                </RequireProfileCompletion>
              } />
              <Route path="/settings" element={
                <RequireProfileCompletion>
                  <Settings />
                </RequireProfileCompletion>
              } />
              <Route path="/payment" element={
                <RequireProfileCompletion>
                  <Payment />
                </RequireProfileCompletion>
              } />

              <Route path="/profile" element={<Profile />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminIndex />} />
              <Route path="/admin/table" element={<AdminTablePage />} />
              <Route path="/admin/inbox" element={<AdminInboxPage />} />
              <Route path="/admin/opportunities" element={<AdminOpportunitiesPage />} />
              <Route path="/admin/opportunities/add" element={<AdminAddOpportunityPage />} />
              <Route path="/admin/opportunities/edit/:id" element={<AdminAddOpportunityPage />} />
              <Route path="/admin/opportunities/:id/applicants" element={<AdminViewApplicantPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
              <Route path="/admin/profile" element={<AdminProfilePage />} />
              <Route path="/admin/announcement" element={<AdminAnnouncementPage />} />
              <Route path="/admin/announcement/add" element={<AdminAddAnnouncementPage />} />
              <Route path="/admin/announcement/edit/:id" element={<AdminAddAnnouncementPage />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ProfileProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
