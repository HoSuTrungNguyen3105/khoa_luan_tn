import React, { useState } from "react";
import "./InfoCard.css";
import { UilPen } from "@iconscout/react-unicons";
import { FiLogOut, FiTrash2, FiKey } from "react-icons/fi";
import { MoreVertical } from "lucide-react";
import ProfileModal from "../ProfileModal/ProfileModal";
import { useAuthStore } from "../../store/useAuthStore";
import { Link } from "react-router-dom";

const InfoCard = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { authUser, logout } = useAuthStore();

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
      logout();
    }
  };

  return (
    <div className="InfoCard">
      <div className="infoHead">
        <h4 style={{ fontSize: "20px", fontWeight: "700" }}>
          Thông tin cá nhân
        </h4>
        <div className="actions">
          <UilPen
            width="2rem"
            height="1.2rem"
            onClick={() => setModalOpened(true)}
          />
          <MoreVertical
            className="menu-icon"
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>
        <ProfileModal
          modalOpened={modalOpened}
          setModalOpened={setModalOpened}
          userData={authUser}
        />
      </div>

      <div className="info">
        <span>
          <b>Email: </b>
        </span>
        <span>{authUser.email}</span>
      </div>
      <div className="info">
        <span>
          <b>Tên người dùng: </b>
        </span>
        <span>
          {authUser.firstname} {authUser.lastname}
        </span>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="profile-menu-open">
          <ul>
            <li>
              <button className="menu-item logout" onClick={handleLogout}>
                <FiLogOut className="icon" /> Đăng xuất
              </button>
            </li>
            <li>
              <Link to="/delete-account" className="menu-item delete">
                <FiTrash2 className="icon" /> Xóa tài khoản
              </Link>
            </li>
            <li>
              <Link to="/change-password" className="menu-item change-password">
                <FiKey className="icon" /> Đổi mật khẩu
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default InfoCard;
