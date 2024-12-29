import React from "react";
import "./RightSide.css"; // Để style cho modal (tùy chỉnh CSS)

const HomeModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Chọn trang bạn muốn quay về</h3>
        <button onClick={() => onSelect("/")} className="modal-button">
          Quay về trang chủ
        </button>
        <button onClick={() => onSelect("/profile")} className="modal-button">
          Trang cá nhân
        </button>
        <button onClick={onClose} className="modal-button close-button">
          Đóng
        </button>
      </div>
    </div>
  );
};

export default HomeModal;
