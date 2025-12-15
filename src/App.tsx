import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DocumentProvider } from "./contexts/DocumentContext";
import Login from "./pages/Login";
import JudgeDashboard from "./pages/JudgeDashboard";
import ClerkDashboard from "./pages/ClerkDashboard";
import { Layout } from "./components/Layout";

import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route element={<Layout />}>
              <Route
                path="/judge/*"
                element={
                  <ProtectedRoute allowedRole="judge">
                    <DocumentProvider>
                      <JudgeDashboard />
                    </DocumentProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clerk/*"
                element={
                  <ProtectedRoute allowedRole="clerk">
                    <DocumentProvider>
                      <ClerkDashboard />
                    </DocumentProvider>
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
