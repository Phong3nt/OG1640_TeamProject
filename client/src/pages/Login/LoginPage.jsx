import React, { useState, useEffect } from "react";
import { useNavigate, Link  } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";
import { FaSun, FaMoon, FaExclamationCircle } from "react-icons/fa"; // Icon Dark Mode & Lỗi

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "", server: "" });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate(); // Điều hướng

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "";
  }, [isDarkMode]);

  const validateForm = () => {
    let errors = {};
    if (!email) errors.email = "Email không được để trống!";
    if (!password) errors.password = "Mật khẩu không được để trống!";
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Kiểm tra hợp lệ trước khi gửi request

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, password }
      );
      const { token, user } = response.data;

      localStorage.setItem("token", token); // Lưu token
      localStorage.setItem("user", JSON.stringify(user)); // Lưu thông tin user

      console.log("User Role:", user);
      navigate("/dashboard"); // Điều hướng thay vì window.location.href
    } catch (error) {
      console.error("Login error:", error.response?.data);
      setError({
        ...error,
        server: error.response?.data?.message || "Đăng nhập thất bại!",
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
          <p className="link-row\">
            <Link to="/register\">Chưa có tài khoản?</Link>
            <Link to="/forgot-password\">Quên mật khẩu?</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
