import "./navbar.css";

export const Header = () => {
    return (
        <nav className="navbar gradient">
            <div className="navbar-container">
                <div className="logo">
                    <img src="logo2.webp" alt="Logo" className="logo-img" />
                </div>
                <ul className="nav-links">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Message</a></li>
                    <li><a href="#">Schedule</a></li>
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
                <div>
                    <button className="login">Login</button>
                </div>
            </div>
        </nav>
    )
}

export default Header;
