import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout"; // Import Layout
import HomePage from "../pages/Web/HomePage/tutor";
import LoginPage from "../pages/Login/LoginPage";

export const Router = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
};
