import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Mentorship from "./pages/Mentorship";
import Events from "./pages/Events";
import SkillAssessment from "./pages/SkillAssessment";
import WalletPage from "./pages/Wallet";
import CredentialsPage from "./pages/Credentials";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/Profile";
import CredentialViewer from "./pages/CredentialViewer";
import MintNFT from "./pages/MintNFT";
import VerifyCredentials from "./pages/VerifyCredentials";
import Application from "./pages/Application";
import EquivalencyFinder from "./pages/EquivalencyFinder";
import AppReview from "./pages/AppReview";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const queryClient = new QueryClient();

function PrivateRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
              <AppSidebar />
              <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-6 overflow-auto">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route element={<PrivateRoute />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/courses" element={<Courses />} />
                      <Route path="/mentorship" element={<Mentorship />} />
                      <Route path="/events" element={<Events />} />
                      <Route path="/assessment" element={<SkillAssessment />} />
                      <Route path="/wallet" element={<WalletPage />} />
                      <Route path="/credentials" element={<CredentialsPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/credential-viewer" element={<CredentialViewer />} />
                      <Route path="/mint-nft" element={<MintNFT />} />
                      <Route path="/verify-credentials" element={<VerifyCredentials />} />
                      <Route path="/application" element={<Application />} />
                      <Route path="/equivalency-finder" element={<EquivalencyFinder />} />
                      <Route path="/app-review" element={<AppReview />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
