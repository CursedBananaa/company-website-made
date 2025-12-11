import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProfileProvider } from "@/contexts/ProfileContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Applicants from "./pages/Applicants";
import Students from "./pages/Students";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/applicants" element={<Applicants />} />
              <Route path="/students" element={<Students />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/settings" element={<Settings />} />
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
