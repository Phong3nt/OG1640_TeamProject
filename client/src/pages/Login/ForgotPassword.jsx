import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";
import { FaExclamationCircle } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) return setError("Email không được để trống");
    try {
      await axios.post("http://localhost:5000/api/users/forgot-password", {
        email,
      });
      setSent(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi gửi email!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Quên mật khẩu</h2>
        {sent ? (
          <p>
            Email chứa mật khẩu mới đã được gửi, hãy kiểm tra hộp thư và đăng
            nhập.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && (
              <p className="error-message">
                <FaExclamationCircle /> {error}
              </p>
            )}
            <button type="submit">Gửi mật khẩu mới</button>
          </form>
        )}
        <Link to="/login">Quay lại đăng nhập</Link>
      </div>
    </div>
  );
};
export default ForgotPassword;
