import React from "react";
import "./Delete.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const DeleteAccount = () => {
  const { deleteAccount, logout, isDeleting } = useAuthStore();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa tài khoản này không?"
    );

    if (confirmed) {
      try {
        const success = await deleteAccount();
        if (success) {
          navigate("/sign-in");
        } else {
          alert("Có lỗi xảy ra khi xóa tài khoản. Vui lòng thử lại.");
        }
      } catch (error) {
        alert("Đã xảy ra lỗi không mong muốn.");
      }
    }
  };

  return (
    <div className="deleteForm">
      <div>
        <ul>
          <h2 className="text">BẠN CÓ MUỐN XÓA TÀI KHOẢN?</h2>
        </ul>
        <ul className="i-btn">
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="button btn-danger"
          >
            {isDeleting ? "Đang xóa..." : "Có"}
          </button>
          <Link to="/">
            <button className="button btn-danger">Quay về</button>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default DeleteAccount;
