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
import Projects from "./pages/Projects";
import Applicants from "./pages/Applicants";
import Students from "./pages/Students";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";

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
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected Routes that require profile completion */}
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ProfileProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
