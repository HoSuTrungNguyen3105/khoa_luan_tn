import React, { useState } from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import { useAuthStore } from "../../store/useAuthStore"; // Import useAuthStore
import "./ProfileModal.css";

function ProfileModal({ modalOpened, setModalOpened, userData }) {
  const theme = useMantineTheme();
  const { updateProfileInfo, isUpdatingProfileInfo } = useAuthStore(); // Lấy hàm updateProfile và trạng thái từ store zustand
  const [error, setError] = useState(""); // State để lưu lỗi

  // State để lưu dữ liệu từ form, bắt đầu từ thông tin người dùng hiện tại
  const [formData, setFormData] = useState({
    username: userData?.username || "",
    email: userData?.email || "",
    firstname: userData?.firstname || "",
    lastname: userData?.lastname || "",
    contact: userData?.contact || "",
  });

  // Hàm xử lý thay đổi dữ liệu từ các trường input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset lỗi trước khi gửi

    try {
      // Gọi hàm cập nhật và kiểm tra kết quả
      const result = await updateProfileInfo(formData);

      if (result.success) {
        setModalOpened(false); // Chỉ đóng modal nếu cập nhật thành công
      } else {
        setError(result.message || "Cập nhật thất bại! Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      setError(
        error.response?.data?.message || "Cập nhật thất bại! Vui lòng thử lại."
      );
    }
  };

  return (
    <Modal
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="55%"
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
    >
      <form className="ProfileForm" onSubmit={handleSubmit}>
        <h3 style={{ fontSize: "20px", fontWeight: "500" }}>
          Thông tin cá nhân
        </h3>
        <div>
          <ul>
            <li style={{ fontSize: "15px", fontWeight: "500" }}>
              Tên người dùng
            </li>
            <p>
              <input
                type="text"
                className="ProfileInput"
                name="username"
                placeholder="Biệt danh"
                value={formData.username}
                onChange={handleChange}
              />
            </p>
          </ul>
          <ul>
            <li style={{ fontSize: "15px", fontWeight: "500" }}>Email</li>
            <p>
              <input
                type="text"
                className="ProfileInput"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </p>
          </ul>
        </div>
        <div>
          <ul>
            <li style={{ fontSize: "15px", fontWeight: "500" }}>
              Họ & Tên đệm
            </li>
            <p>
              <input
                type="text"
                className="ProfileInput"
                name="firstname"
                placeholder="Họ & Tên đệm"
                value={formData.firstname}
                onChange={handleChange}
              />
            </p>
          </ul>
        </div>
        <div>
          <ul>
            <li style={{ fontSize: "15px", fontWeight: "500" }}>
              Số điện thoại
            </li>
            <p>
              <input
                type="number"
                className="ProfileInput"
                name="contact"
                placeholder="Số điện thoại
"
                value={formData.contact}
                onChange={handleChange}
              />
            </p>
          </ul>
        </div>
        <div>
          <ul>
            <li style={{ fontSize: "15px", fontWeight: "500" }}>Tên</li>
            <p>
              <input
                type="text"
                className="ProfileInput"
                name="lastname"
                placeholder="Tên"
                value={formData.lastname}
                onChange={handleChange}
              />
            </p>
          </ul>
        </div>
        <button
          className="button infoButton"
          type="submit"
          disabled={isUpdatingProfileInfo}
        >
          {isUpdatingProfileInfo ? "Đang cập nhật..." : "Cập nhật"}
        </button>
        {/* Hiển thị lỗi nếu có */}
        {error && <div className="errorMessage">{error}</div>}
      </form>
    </Modal>
  );
}

export default ProfileModal;
