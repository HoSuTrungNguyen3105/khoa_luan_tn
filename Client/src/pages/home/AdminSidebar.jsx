import React from "react";
import { Link, Outlet } from "react-router-dom"; // Để tạo các liên kết điều hướng

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin Dashboard</h2>
      </div>
      <ul className="sidebar-nav">
        <li className="sidebar-item">
          <Link to="/admin-dashboard/admin-post" className="sidebar-link">
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/admin-dashboard/admin-user" className="sidebar-link">
            <i className="fas fa-users"></i> Users
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/admin-dashboard/admin-adv" className="sidebar-link">
            <i className="fas fa-newspaper"></i> Adv
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/admin/settings" className="sidebar-link">
            <i className="fas fa-cogs"></i> Settings
          </Link>
        </li>
        <Outlet />
      </ul>
    </div>
  );
};

export default AdminSidebar;
