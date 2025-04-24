import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";
import "./LoginPage.css";
import { FaExclamationCircle } from "react-icons/fa";

const ChangePassword = () => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!current || !next) return setError("Vui lòng nhập đủ thông tin");
    try {
      await axios.put(
        "http://localhost:5000/api/users/change-password",
        { currentPassword: current, newPassword: next },
        { headers: { Authorization: token } }
      );
      alert("Đổi mật khẩu thành công, hãy đăng nhập lại.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Đổi mật khẩu thất bại!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Đổi mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Mật khẩu hiện tại</label>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Mật khẩu mới</label>
            <input
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
            />
          </div>
          {error && (
            <p className="error-message">
              <FaExclamationCircle /> {error}
            </p>
          )}
          <button type="submit">Đổi mật khẩu</button>
        </form>
      </div>
    </div>
  );
};
export default ChangePassword;
