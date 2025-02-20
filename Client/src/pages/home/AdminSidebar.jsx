import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./AdminSidebar.css";
import { FaUsers, FaNewspaper, FaCogs } from "react-icons/fa";
import { MessageCircleCode, MessageCircleMore, Settings } from "lucide-react";
import { MdAttachEmail, MdPostAdd, MdReportProblem } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";

const AdminSidebar = () => {
  const sidebarItems = [
    {
      to: "/admin-dashboard/admin-post",
      icon: <MdPostAdd />,
      label: "Quản lý Bài đăng",
    },
    {
      to: "/admin-dashboard/admin-user",
      icon: <FaUsers />,
      label: "Quản lý Người dùng",
    },
    {
      to: "/admin-dashboard/admin-list",
      icon: <RiAdminFill />,
      label: "Admin List",
    },
    {
      to: "/admin-dashboard/admin-adv",
      icon: <FaNewspaper />,
      label: "Quản lý Quảng cáo",
    },
    {
      to: "/admin-dashboard/admin-report",
      icon: <FaCogs />,
      label: "Thống kê",
    },
    {
      to: "/admin-dashboard/admin-message",
      icon: <MessageCircleCode />,
      label: "Tin nhắn",
    },
    {
      to: "/admin-dashboard/admin-report-post",
      icon: <MdReportProblem />,
      label: "Quản lý Báo cáo",
    },
    {
      to: "/admin-dashboard/admin-all-chat",
      icon: <MessageCircleMore />,
      label: "Quản lý tin nhắn",
    },
    {
      to: "/admin-dashboard/admin-setting",
      icon: <Settings />,
      label: "Cài đặt",
    },
    {
      to: "/admin-dashboard/send-email",
      icon: <MdAttachEmail />,
      label: "Gửi Email",
    },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar bên cạnh */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <span>Admin Dashboard</span>
        </div>
        <ul className="sidebar-nav">
          {sidebarItems.map((item) => (
            <li key={item.to} className="sidebar-item">
              <Link to={item.to} className="sidebar-link">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: "1.5rem", marginRight: "10px" }}>
                    {item.icon}
                  </span>
                  <span style={{ marginLeft: "10px" }}>{item.label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Nội dung chính */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminSidebar;
