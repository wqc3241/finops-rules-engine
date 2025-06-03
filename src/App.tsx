
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CountryProvider } from "@/hooks/useCountry";
import { DynamicTableSchemasProvider } from "@/hooks/useDynamicTableSchemas";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail";
import DashboardPage from "./pages/DashboardPage";
import Report from "./pages/Report";
import Tasks from "./pages/Tasks";
import FinancialPricingPage from "./pages/FinancialPricingPage";
import LFSSetupPage from "./pages/LFSSetupPage";
import FeeTaxPage from "./pages/FeeTaxPage";
import ProfileSettings from "./pages/ProfileSettings";
import UserPermissions from "./pages/UserPermissions";
import AdminSettings from "./pages/AdminSettings";
import AIAgentButton from "./components/ai-agent/AIAgentButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CountryProvider>
        <DynamicTableSchemasProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/applications/:id" element={<ApplicationDetail />} />
                <Route path="/applications/:id/:tab" element={<ApplicationDetail />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/report" element={<Report />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/financial-pricing" element={<FinancialPricingPage />} />
                <Route path="/lfs-setup" element={<LFSSetupPage />} />
                <Route path="/fee-tax" element={<FeeTaxPage />} />
                <Route path="/profile-settings" element={<ProfileSettings />} />
                <Route path="/user-permissions" element={<UserPermissions />} />
                <Route path="/admin-settings" element={<AdminSettings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <AIAgentButton />
            </BrowserRouter>
          </TooltipProvider>
        </DynamicTableSchemasProvider>
      </CountryProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
