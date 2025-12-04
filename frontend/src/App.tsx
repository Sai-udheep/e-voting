import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ElectionProvider } from "@/contexts/ElectionContext";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Voter Pages
import VoterDashboard from "./pages/voter/VoterDashboard";
import CastVote from "./pages/voter/CastVote";
import ViewResults from "./pages/voter/ViewResults";
import SubmitNomination from "./pages/voter/SubmitNomination";

// Candidate Pages
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateCastVote from "./pages/candidate/CastVote";
import CandidateViewResults from "./pages/candidate/ViewResults";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageCandidates from "./pages/admin/ManageCandidates";
import ValidateVoters from "./pages/admin/ValidateVoters";
import AdminResults from "./pages/admin/AdminResults";
import ManageElections from "./pages/admin/ManageElections";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: string }) {
  const { user, isLoading } = useAuth();
  
  // Wait for auth to initialize before checking
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={`/${user.role}`} replace /> : <Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Voter Routes */}
      <Route path="/voter" element={<ProtectedRoute allowedRole="voter"><VoterDashboard /></ProtectedRoute>} />
      <Route path="/voter/cast-vote" element={<ProtectedRoute allowedRole="voter"><CastVote /></ProtectedRoute>} />
      <Route path="/voter/results" element={<ProtectedRoute allowedRole="voter"><ViewResults /></ProtectedRoute>} />
      <Route path="/voter/nominate" element={<ProtectedRoute allowedRole="voter"><SubmitNomination /></ProtectedRoute>} />
      
      {/* Candidate Routes */}
      <Route path="/candidate" element={<ProtectedRoute allowedRole="candidate"><CandidateDashboard /></ProtectedRoute>} />
      <Route path="/candidate/cast-vote" element={<ProtectedRoute allowedRole="candidate"><CandidateCastVote /></ProtectedRoute>} />
      <Route path="/candidate/nominate" element={<ProtectedRoute allowedRole="candidate"><SubmitNomination /></ProtectedRoute>} />
      <Route path="/candidate/results" element={<ProtectedRoute allowedRole="candidate"><CandidateViewResults /></ProtectedRoute>} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><ManageUsers /></ProtectedRoute>} />
      <Route path="/admin/elections" element={<ProtectedRoute allowedRole="admin"><ManageElections /></ProtectedRoute>} />
      <Route path="/admin/candidates" element={<ProtectedRoute allowedRole="admin"><ManageCandidates /></ProtectedRoute>} />
      <Route path="/admin/validate" element={<ProtectedRoute allowedRole="admin"><ValidateVoters /></ProtectedRoute>} />
      <Route path="/admin/results" element={<ProtectedRoute allowedRole="admin"><AdminResults /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ElectionProvider>
            <AppRoutes />
          </ElectionProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
