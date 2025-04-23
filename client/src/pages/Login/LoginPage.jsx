import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";
import { FaSun, FaMoon, FaExclamationCircle } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
const API_URL = "http://localhost:5000/api/users";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "", server: "" });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate(); // Điều hướng
  const {login}=useAuth(); // Lấy hàm login từ AuthContext

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "";
  }, [isDarkMode]);

  const validateForm = () => {
    const newError = { email: "", password: "", server: "" };
    let valid = true;

    if (!email) {
      newError.email = "Vui lòng nhập email";
      valid = false;
    }
    if (!password) {
      newError.password = "Vui lòng nhập mật khẩu";
      valid = false;
    }

    setError(newError);
    return valid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

login(user); // Lưu thông tin người dùng vào AuthContext
      // Lưu token và thông tin người dùng
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Lấy role từ user
      const role = user.role;

      // Điều hướng theo role
      if (role === "student") {
        navigate("/student");
      } else if (role === "tutor") {
        navigate("/tutor");
      } else if (role === "staff") {
        navigate("/dashboard/staff");
      } else {
        navigate("/login"); // fallback nếu role không xác định
      }
    } catch (err) {
      setError({
        email: "",
        password: "",
        server: err.response?.data?.message || "Đăng nhập thất bại!",
      });
    }
  };

  return (
    <div className="login-container">
      <div
        className="dark-mode-toggle"
        onClick={() => setIsDarkMode(!isDarkMode)}
      >
        {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
      </div>

      <div className="login-box">
        <h2>Đăng nhập vào eTutoring</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={error.email ? "input-error" : ""}
            />
            {error.email && (
              <p className="error-message">
                <FaExclamationCircle /> {error.email}
              </p>
            )}
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={error.password ? "input-error" : ""}
            />
            {error.password && (
              <p className="error-message">
                <FaExclamationCircle /> {error.password}
              </p>
            )}
          </div>

          {error.server && (
            <p className="error-message server-error">
              <FaExclamationCircle /> {error.server}
            </p>
          )}

          <button type="submit">Đăng nhập</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
