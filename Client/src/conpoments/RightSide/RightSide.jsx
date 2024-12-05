import React, { useState } from "react";
import "./RightSide.css";
import Home from "../../img/home.png";
import Noti from "../../img/noti.png";
import Comment from "../../img/comment.png";
import AdvCard from "../AdvCard/AdvCard";
import ShareModal from "../ShareModal/ShareModal";
import { usePostStore } from "../../store/usePostStore";
import { Link } from "react-router-dom";

const RightSide = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const { createPost, isCreatingPost, createPostError, createPostSuccess } =
    usePostStore();

  // Hàm handleSubmit gửi form dữ liệu đến store
  const handleSubmit = async (formData) => {
    const success = await createPost(formData);
    if (success) {
      // Đóng modal nếu tạo bài thành công
      setModalOpened(false);
    }
  };

  return (
    <div className="RightSide">
      <div className="navIcons">
        <img src={Home} alt="" />
        <img src={Noti} alt="" />
        <Link to="/chatbox">
          <img src={Comment} alt="" />
        </Link>
      </div>

      <AdvCard />

      <button className="button r-button" onClick={() => setModalOpened(true)}>
        <h2>Thêm Bài Đăng</h2>
      </button>

      {/* Modal */}
      <ShareModal
        modalOpened={modalOpened}
        setModalOpened={setModalOpened}
        onSubmit={handleSubmit}
      />

      {/* Hiển thị trạng thái khi đang tạo bài đăng */}
      {isCreatingPost && <p>Đang tạo bài đăng...</p>}

      {/* Hiển thị thông báo khi có lỗi */}
      {createPostError && (
        <p style={{ color: "red" }}>Lỗi: {createPostError}</p>
      )}

      {/* Hiển thị thông báo khi tạo bài đăng thành công */}
      {createPostSuccess && (
        <p style={{ color: "green" }}>Tạo bài đăng thành công!</p>
      )}
    </div>
  );
};

export default RightSide;
