import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/authcontext";
import { Toaster } from "react-hot-toast";

// Pages
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
            borderRadius: '16px',
            background: '#0f172a',
            color: '#f8fafc',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
            border: '1px solid #1e293b',
            padding: '16px',
            fontWeight: 'bold',
            fontSize: '14px'
          },
        }}
      />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            {/* Root redirects to Dashboard which now has a default mock user for preview */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Teacher Specific */}
            <Route path="/upload" element={<ProtectedRoute allowedRoles={['teacher']}><UploadAssignment /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute allowedRoles={['teacher']}><SimilarityReports /></ProtectedRoute>} />
            <Route path="/grading" element={<ProtectedRoute allowedRoles={['teacher']}><GradingRules /></ProtectedRoute>} />
            <Route path="/settings" element={<div className="flex flex-col items-center justify-center p-20 bg-slate-900/50 rounded-[3rem] border border-slate-800"><h1 className="text-2xl font-bold text-white mb-2 underline decoration-indigo-500">Institution Portal</h1><p className="text-slate-500 font-medium">Administration settings for Gurukul Kangri (Deemed to be University) arriving soon.</p></div>} />

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