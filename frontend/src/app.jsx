import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import CreateAssignment from "./pages/createassignment";

import Navbar from "./components/navbar";
import ProtectedRoute from "./routes/protectedroute";

function App() {
  return (
    <Router>
      <Routes>

        {/* ✅ DEFAULT ROUTE FIX */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Dashboard />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <CreateAssignment />
              </>
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;