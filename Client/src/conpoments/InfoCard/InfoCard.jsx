import React, { useState } from "react";
import "./InfoCard.css";
import { UilPen } from "@iconscout/react-unicons";
import ProfileModal from "../ProfileModal/ProfileModal";
import { useAuthStore } from "../../store/useAuthStore";
import { LogOut } from "lucide-react";

const InfoCard = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const { authUser } = useAuthStore((state) => state);
  const { logout } = useAuthStore();

  return (
    <div className="InfoCard">
      <div className="infoHead">
        <h4>Thông tin cá nhân</h4>
        <div>
          <UilPen
            width="2rem"
            height="1.2rem"
            onClick={() => setModalOpened(true)}
          />
          <ProfileModal
            modalOpened={modalOpened}
            setModalOpened={setModalOpened}
            userData={authUser} // Truyền authUser mới nhất vào
          />
        </div>
      </div>
      <div className="info">
        <span>
          <b>Email: </b>
        </span>
        <span>{authUser?.email || "Chưa cập nhật"}</span>
      </div>

      <div className="info">
        <span>
          <b>Tên user: </b>
        </span>
        <span>{authUser?.firstname || "Chưa cập nhật"}</span>
      </div>

      {authUser && (
        <>
          <button className="button logout-button" onClick={logout}>
            <LogOut className="size-5" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </>
      )}
    </div>
  );
};

export default InfoCard;
