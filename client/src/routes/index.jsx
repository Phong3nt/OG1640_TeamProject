import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import LoginPage from "../pages/Login/LoginPage";
import MeetingPage from "../pages/Web/MeetingPage";
import StudentHomePage from "../pages/Web/HomePage/student";
import TutorHomePage from "../pages/Web/HomePage/tutor";
import StaffDashboard from "../pages/Web/HomePage/staff";
import BlogPage from "../pages/Web/BlogPage";
import ProfilePage from "../pages/Web/ProfilePage/index";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Messenger from "../pages/Messenger/Messenger";

// ProtectedRoute component to guard access to protected routes
const ProtectedRoute = ({ children }) => {
  const user = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

export const Router = () => {
  const {user} = useAuth();

  return (
    <Routes>
      {/* Unprotected routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Default redirect if no route matches */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Protected routes wrapped with Layout */}
      <Route element={<Layout />}>
        {/* Routes that require authentication */}
        <Route path="/meeting" element={<MeetingPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/message" element={<Messenger />} />

        {/* Dashboard route that redirects based on the user's role */}
        <Route
          path="/dashboard"
          element={
            user? (
              <Navigate to={`/dashboard/${user.role}`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Role-based protected routes */}
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute>
              {user?.role === "student" ? (
                <StudentHomePage />
              ) : (
                <Navigate to="/login" replace />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/tutor"
          element={
            <ProtectedRoute>
              {user?.role === "tutor" ? (
                <TutorHomePage />
              ) : (
                <Navigate to="/login" replace />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/staff"
          element={
            <ProtectedRoute>
              {user?.role === "staff" ? (
                <StaffDashboard />
              ) : (
                <Navigate to="/login" replace />
              )}
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback for all other undefined routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};