import React, { useState, useEffect } from "react";
import { useNavigate,Link  } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

import { FaSun, FaMoon, FaExclamationCircle } from "react-icons/fa";

const RegisterPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "tutor",
  });
  const [error, setError] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "";
  }, [isDarkMode]);

  /* -------------- helpers -------------- */
  const validators = {
    fullName: (v) => v.trim() !== "",
    email: (v) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
    phone: (v) => /^\d{9,11}$/.test(v),
    password: (v) => v.length >= 6,
    role: (v) => ["tutor", "student"].includes(v),
  };

  const messages = {
    fullName: "Họ tên không được để trống!",
    email: "Email không hợp lệ!",
    phone: "Số điện thoại 9–11 chữ số!",
    password: "Mật khẩu tối thiểu 6 ký tự!",
    role: "Vai trò phải là tutor hoặc student",
  };

  const validate = () => {
    const errs = {};
    Object.keys(validators).forEach((k) => {
      if (!validators[k](form[k])) errs[k] = messages[k];
    });
    setError(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await axios.post("http://localhost:5000/api/users/register", form);
      navigate("/login");
    } catch (err) {
      setError({ server: err.response?.data?.message || "Đăng ký thất bại!" });
    }
  };

  /* -------------- UI -------------- */
  return (
    <div className="login-container">
      <div
        className="dark-mode-toggle"
        onClick={() => setIsDarkMode(!isDarkMode)}
      >
        {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
      </div>

      <div className="login-box">
        <h2>Đăng ký tài khoản eTutoring</h2>
        <form onSubmit={handleSubmit}>
          {[
            {
              label: "Họ tên",
              name: "fullName",
              type: "text",
              placeholder: "Nhập họ tên",
            },
            {
              label: "Email",
              name: "email",
              type: "email",
              placeholder: "Nhập email",
            },
            {
              label: "Số điện thoại",
              name: "phone",
              type: "text",
              placeholder: "Nhập số điện thoại",
            },
            {
              label: "Mật khẩu",
              name: "password",
              type: "password",
              placeholder: "Nhập mật khẩu",
            },
          ].map(({ label, name, ...rest }) => (
            <div className="input-group" key={name}>
              <label>{label}</label>
              <input
                {...rest}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className={error[name] ? "input-error" : ""}
              />
              {error[name] && (
                <p className="error-message">
                  <FaExclamationCircle /> {error[name]}
                </p>
              )}
            </div>
          ))}

          {/* role select */}
          <div className="input-group">
            <label>Vai trò</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="tutor">Tutor</option>
              <option value="student">Student</option>
            </select>
          </div>
          {error.role && (
            <p className="error-message">
              <FaExclamationCircle /> {error.role}
            </p>
          )}

          {error.server && (
            <p className="error-message server-error">
              <FaExclamationCircle /> {error.server}
            </p>
          )}

          <button type="submit">Đăng ký</button>
          <Link to="/login\">Đã có tài khoản? Đăng nhập</Link>

        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
