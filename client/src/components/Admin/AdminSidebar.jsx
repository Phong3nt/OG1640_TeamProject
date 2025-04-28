import {
  FaBoxOpen,
  FaClipboardList,
  FaSignOutAlt,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./admin-sidebar.css";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="staff-sidebar">
      <div>
        <Link to="/dashboard/staff" className="sidebar-title">
          SP Team
        </Link>
        <div className="sidebar-subtitle">Staff Dashboard</div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard/staff/analysis" className="sidebar-link">
          <FaUser />
          <span>Analysis</span>
        </NavLink>
        <NavLink to="/dashboard/staff/users" className="sidebar-link">
          <FaUser />
          <span>Users</span>
        </NavLink>
        <NavLink to="/dashboard/staff/allocations" className="sidebar-link">
          <FaUser />
          <span>Allocations</span>
        </NavLink>
        <NavLink to="/dashboard/staff/blogs" className="sidebar-link">
          <FaBoxOpen />
          <span>Blogs</span>
        </NavLink>
        <NavLink to="/dashboard/staff/meetings" className="sidebar-link">
          <FaClipboardList />
          <span>Meetings</span>
        </NavLink>
      </nav>

      <button onClick={handleLogout} className="logout-btn">
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default AdminSidebar;
