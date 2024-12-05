import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const DeleteAccount = () => {
  const { deleteAccount, logout, isDeleting } = useAuthStore();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa tài khoản này ?");

    if (confirmed) {
      const success = await deleteAccount();
      if (success) {
        navigate("/sign-in"); // Redirect to login page
      }
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded shadow">
      <h2 className="text-xl font-bold text-red-600 mb-4">DELETE !!!</h2>
      <button
        onClick={handleDeleteAccount}
        disabled={isDeleting}
        className="btn btn-danger"
      >
        {isDeleting ? "Đang xóa..." : "Xóa Tài Khoản"}
      </button>
    </div>
  );
};

export default DeleteAccount;
