import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

export const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar gradient">
      <div className="navbar-container">
        <div className="logo">
          <Link
            to={
              user?.role === "student"
                ? "/dashboard/student"
                : user?.role === "tutor"
                ? "/dashboard/tutor"
                : user?.role === "staff"
                ? "/dashboard/staff"
                : "/"
            }
          >
            <img src="logo2.webp" alt="Logo" className="logo-img" />
          </Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link
              to={
                user?.role === "student"
                  ? "/dashboard/student"
                  : user?.role === "tutor"
                  ? "/dashboard/tutor"
                  : user?.role === "staff"
                  ? "/dashboard/staff"
                  : "/"
              }
            >
              Home
            </Link>
          </li>
          <li>
            <Link to="/message">Message</Link>
          </li>
          <li>
            <Link to="/meeting">Schedule</Link>
          </li>
          <li>
            <Link to="/blog">Blog</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>

        <div className="auth-section">
          {user ? (
            <div className="user-info">
              <span className="username">Hello, {user.name}</span>
              <button className="logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="login" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
