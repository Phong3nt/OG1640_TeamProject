import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LoginPage.css";
import { FaSun, FaMoon, FaExclamationCircle } from "react-icons/fa"; // Icon Dark Mode & Lỗi

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ email: "", password: "" });
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        document.body.className = isDarkMode ? "dark-mode" : "";
    }, [isDarkMode]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError({ email: "", password: "" }); // Reset lỗi

        // Kiểm tra Email hợp lệ
        if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            setError((prev) => ({ ...prev, email: "Email không hợp lệ!" }));
            return;
        }

        // Kiểm tra mật khẩu phải có ít nhất 6 ký tự
        if (password.length < 6) {
            setError((prev) => ({ ...prev, password: "Mật khẩu phải có ít nhất 6 ký tự!" }));
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/api/users/login", { email, password });
            alert(response.data.message); // Hiển thị thông báo thành công
        } catch (error) {
            setError({ email: "", password: error.response?.data?.message || "Đăng nhập thất bại!" });
        }
    };

    return (
        <div className="login-container">
            {/* Toggle Dark Mode */}
            <div className="dark-mode-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
                {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
            </div>

            {/* Form Đăng nhập */}
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
                            <p className="error-message"><FaExclamationCircle /> {error.email}</p>
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
                            <p className="error-message"><FaExclamationCircle /> {error.password}</p>
                        )}
                    </div>

                    <button type="submit">Đăng nhập</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
