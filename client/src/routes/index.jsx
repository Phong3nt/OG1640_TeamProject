import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout"; // Import Layout
import HomePage from "../pages/Web/HomePage/tutor";
import ProfilePage from "../pages/Web/ProfilePage/index"; // Đường dẫn đến ProfilePage
import LoginPage from "../pages/Login/LoginPage";
import BlogPage from "../pages/Web/BlogPage"

export const Router = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
<<<<<<< HEAD
        <Route path="/blog" element={<BlogPage />} />
=======
        <Route path="/profile" element={<ProfilePage />} /> 

>>>>>>> main
      </Route>
    </Routes>
  );
};
