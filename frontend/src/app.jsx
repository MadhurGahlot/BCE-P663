import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/authcontext";
import { Toaster } from "react-hot-toast";
import { Box } from "lucide-react";

// Pages
import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import UploadAssignment from "./pages/upload";
import SimilarityReports from "./pages/reports";
import SubmissionHistory from "./pages/submissions";
import GradingRules from "./pages/grading";

// Components & Layouts
import MainLayout from "./layouts/mainlayout";
import ProtectedRoute from "./components/protectedroute";

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '20px',
            background: '#020617',
            color: '#f8fafc',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255,255,255,0.05)',
            padding: '18px 24px',
            fontWeight: '900',
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          },
        }}
      />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Teacher Specific */}
            <Route path="/upload" element={<ProtectedRoute allowedRoles={['teacher']}><UploadAssignment /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute allowedRoles={['teacher']}><SimilarityReports /></ProtectedRoute>} />
            <Route path="/grading" element={<ProtectedRoute allowedRoles={['teacher']}><GradingRules /></ProtectedRoute>} />
            <Route path="/settings" element={<div className="flex flex-col items-center justify-center p-24 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden"><div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full"></div><div className="w-16 h-16 gradebook-gradient rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-orange-500/20 neon-border"><Box className="w-8 h-8 text-white" /></div><h1 className="text-3xl font-black text-white mb-2 tracking-tight">Institutional Portal</h1><p className="text-slate-500 font-medium text-sm">Administration settings for Gurukul Kangri Academic Centre coming soon.</p></div>} />

            {/* Student Specific */}
            <Route path="/submit" element={<ProtectedRoute allowedRoles={['student']}><UploadAssignment /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute allowedRoles={['student']}><SubmissionHistory /></ProtectedRoute>} />
          </Route>

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
