import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import "./admin-layout.css"; // đảm bảo đã import CSS

const AdminLayout = () => {
  return (
    <div className="staff-layout">
      <div className="staff-sidebar">
        <AdminSidebar />
      </div>
      <div className="staff-main">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
