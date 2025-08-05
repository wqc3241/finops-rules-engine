
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useSupabaseAuth";
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
import FinancingDataTablePage from "./pages/FinancingDataTablePage";
import FeeTaxPage from "./pages/FeeTaxPage";
import ProfileSettings from "./pages/ProfileSettings";
import UserPermissions from "./pages/UserPermissions";
import AdminSettings from "./pages/AdminSettings";
import AuthPage from "./pages/AuthPage";
import AIAgentButton from "./components/ai-agent/AIAgentButton";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CountryProvider>
      <DynamicTableSchemasProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
              <Route path="/applications/:id" element={<ProtectedRoute><ApplicationDetail /></ProtectedRoute>} />
              <Route path="/applications/:id/:tab" element={<ProtectedRoute><ApplicationDetail /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/financial-pricing" element={<ProtectedRoute><FinancialPricingPage /></ProtectedRoute>} />
              <Route path="/financing-data-table" element={<ProtectedRoute><FinancingDataTablePage /></ProtectedRoute>} />
              <Route path="/lfs-setup" element={<ProtectedRoute><LFSSetupPage /></ProtectedRoute>} />
              <Route path="/fee-tax" element={<ProtectedRoute><FeeTaxPage /></ProtectedRoute>} />
              <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
              <Route path="/user-permissions" element={<ProtectedRoute><UserPermissions /></ProtectedRoute>} />
              <Route path="/admin-settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <AIAgentButton />
          </BrowserRouter>
        </TooltipProvider>
      </DynamicTableSchemasProvider>
    </CountryProvider>
  </QueryClientProvider>
);

export default App;
