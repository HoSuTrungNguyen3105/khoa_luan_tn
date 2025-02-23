import React, { useState } from "react";
import "./RightSide.css";
import Home from "../../img/home.png"; // Sử dụng hình ảnh Home
import Noti from "../../img/noti.png"; // Icon thông báo
import Comment from "../../img/comment.png";
import AdvCard from "../AdvCard/AdvCard";
import ShareModal from "../ShareModal/ShareModal";
import { usePostStore } from "../../store/usePostStore";
import { MdOutlinePostAdd } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom"; // Thay useHistory thành useNavigate
import { useAuthStore } from "../../store/useAuthStore";
import NotificationList from "./NotificationList"; // Import component NotificationList
import HomeModal from "./HomeModal";
import { PlusCircleIcon } from "lucide-react";

const RightSide = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const [notificationModalOpened, setNotificationModalOpened] = useState(false); // Quản lý modal thông báo
  const [isModalOpen, setIsModalOpen] = useState(false); // Quản lý modal chọn trang
  const { createPost } = usePostStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate(); // Sử dụng useNavigate thay cho useHistory

  const handleSubmit = async (formData) => {
    const newPost = await createPost(formData);
    if (newPost) {
      setModalOpened(false);
    }
  };

  const handleSelect = (route) => {
    navigate(route); // Điều hướng đến route tương ứng
    setIsModalOpen(false); // Đóng modal sau khi chọn
  };

  const handleOpenModal = () => {
    setIsModalOpen(true); // Mở modal khi nhấp vào icon home
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Đóng modal
  };

  return (
    <div className="RightSide">
      {/* Navigation Icons */}
      <div className="navIcons">
        <div>
          <img
            src={Home}
            alt="Home"
            className="w-8 h-8 hover:scale-110 transition-transform"
            onClick={handleOpenModal} // Mở modal khi nhấp vào hình ảnh
          />
        </div>

        {/* Modal sẽ hiển thị khi isModalOpen là true */}
        <HomeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSelect={handleSelect}
        />

        <div>
          <Link to="/chatbox">
            <img
              src={Comment}
              alt="Chatbox"
              className="w-8 h-8 hover:scale-110 transition-transform"
            />
          </Link>
        </div>
        <div>
          <img
            src={Noti}
            alt="Notifications"
            className="w-8 h-8 hover:scale-110 transition-transform"
            onClick={() => setNotificationModalOpened(!notificationModalOpened)} // Toggle cửa sổ thông báo
          />
        </div>
      </div>

      {/* Cửa sổ thông báo */}
      {notificationModalOpened && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h3>Thông báo của bạn</h3>
            <button onClick={() => setNotificationModalOpened(false)}>X</button>
          </div>
          <div className="dropdown-body">
            {authUser && <NotificationList userId={authUser._id} />}
          </div>
        </div>
      )}

      {/* Advertisement Card */}
      <AdvCard />

      <div className="a-bottom">
        {/* Chỉ hiển thị nút "Thêm Bài Đăng mới" nếu không phải admin */}
        <button
          className="button r-button"
          onClick={() => setModalOpened(true)}
        >
          <PlusCircleIcon />
          Đăng Tin Mới
        </button>

        <ShareModal
          modalOpened={modalOpened}
          setModalOpened={setModalOpened}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default RightSide;
