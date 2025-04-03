import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import LoginPage from "../pages/Login/LoginPage";
import StudentHomePage from "../pages/Web/HomePage/student";
import TutorHomePage from "../pages/Web/HomePage/tutor";
import StaffDashboard from "../pages/Web/HomePage/staff";
import BlogPage from "../pages/Web/BlogPage";
import ProfilePage from "../pages/Web/ProfilePage/index";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return user ? children : <Navigate to="/login" replace />;
};

export const Router = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/profile" element={<ProfilePage />} />

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

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
