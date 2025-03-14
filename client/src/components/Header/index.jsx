import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

export const Header = () => {
    const navigate = useNavigate(); 
    
    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <nav className="navbar gradient">
            <div className="navbar-container">
                <div className="logo">
                    <Link to="/">
                        <img src="logo2.webp" alt="Logo" className="logo-img" />
                    </Link>
                </div>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/message">Message</Link></li>
                    <li><Link to="/schedule">Schedule</Link></li>
                    <li><Link to="/blog">Blog</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
                <div>
                    <button className="login" onClick={handleLogin}>
                        Login
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Header;
