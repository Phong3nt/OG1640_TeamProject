import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import LoginPage from "../pages/Login/LoginPage";
import MeetingPage from "../pages/Web/MeetingPage";
import StudentHomePage from "../pages/Web/HomePage/student";
import TutorHomePage from "../pages/Web/HomePage/tutor";
import StaffDashboard from "../pages/Web/HomePage/staff";
import BlogPage from "../pages/Web/BlogPage/blogPage";
import BlogDetail from "../pages/Web/BlogDetail/blogDetails";
import ProfilePage from "../pages/Web/ProfilePage/index";
import Messenger from "../pages/Messenger/Messenger";
import AllocationPage from "../pages/AllocationPage/AllocationPage";
import { useAuth } from "../contexts/AuthContext";

// ProtectedRoute component to guard access to protected routes
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const Router = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Protected Routes with Layout */}
      <Route element={<Layout />}>
        <Route path="/meeting" element={<ProtectedRoute><MeetingPage /></ProtectedRoute>} />
        <Route path="/blogs" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
        <Route path="/blog/:id" element={<ProtectedRoute><BlogDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/message" element={<ProtectedRoute><Messenger /></ProtectedRoute>} />
        <Route path="/allocations" element={<ProtectedRoute allowedRoles={['staff']}><AllocationPage /></ProtectedRoute>} />

        {/* Dashboard Redirect by Role */}
        <Route
          path="/dashboard"
          element={
            user?.role ? (
              <Navigate to={`/dashboard/${user.role}`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Role-Based Dashboards */}
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/tutor"
          element={
            <ProtectedRoute allowedRoles={['tutor']}>
              <TutorHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/staff"
          element={
            <ProtectedRoute allowedRoles={['staff']}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
