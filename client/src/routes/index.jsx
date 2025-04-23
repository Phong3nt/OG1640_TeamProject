import { Route, Routes, Navigate } from "react-router-dom";

// Layouts
import Layout from "../components/Layout";
import AdminLayout from "../components/Admin/AdminLayout";

// Public & Auth Pages
import LoginPage from "../pages/Login/LoginPage";

// Role-based HomePages
import StudentHomePage from "../pages/Web/HomePage/student";
import TutorHomePage from "../pages/Web/HomePage/tutor";
import BlogPage from "../pages/Web/BlogPage/blogPage";
import BlogDetail from "../pages/Web/BlogDetail/blogDetails";
import AdminHomePage from "../pages/Web/HomePage/admin";

// Feature Pages
import MeetingPage from "../pages/Web/MeetingPage";
import ProfilePage from "../pages/Web/ProfilePage/index";
import Messenger from "../pages/Messenger/Messenger";
import AllocationPage from "../pages/AllocationPage/AllocationPage";

// staff Feature Pages
import UserManagement from "../components/Admin/UserManagement";

// Protected route wrapper
const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;
  return children;
};

export const Router = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Root redirect based on role */}
      <Route
        path="/"
        element={(() => {
          const user = JSON.parse(localStorage.getItem("user"));
          if (!user) return <Navigate to="/login" replace />;
          if (user.role === "staff")
            return <Navigate to="/dashboard/staff" replace />;
          return <Navigate to={`/${user.role}`} replace />;
        })()}
      />

      {/* Student & Tutor Layout (General Layout) */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutor"
          element={
            <ProtectedRoute role="tutor">
              <TutorHomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/meeting" element={<MeetingPage />} />
        <Route path="/blogs" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
        <Route path="/blog/:id" element={<ProtectedRoute><BlogDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/message" element={<ProtectedRoute><Messenger /></ProtectedRoute>} />
        <Route path="/allocations" element={<ProtectedRoute allowedRoles={['staff']}><AllocationPage /></ProtectedRoute>} />
      </Route>

      {/* staff Layout and routes */}
      <Route
        path="/dashboard/staff"
        element={
          <ProtectedRoute role="staff">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHomePage />} />
        <Route path="users" element={<UserManagement />} />
        {/* Add more staff routes here if needed */}
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
