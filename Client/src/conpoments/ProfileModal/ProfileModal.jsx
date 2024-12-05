import React, { useState } from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import { useAuthStore } from "../../store/useAuthStore"; // Import useAuthStore
import "./ProfileModal.css";

function ProfileModal({ modalOpened, setModalOpened, userData }) {
  const theme = useMantineTheme();
  const { updateProfileInfo, isUpdatingProfile, errorMessage } = useAuthStore(); // Lấy hàm updateProfile và trạng thái từ store zustand

  // State để lưu dữ liệu từ form, bắt đầu từ thông tin người dùng hiện tại
  const [formData, setFormData] = useState({
    username: userData?.username || "",
    email: userData?.email || "",
    firstname: userData?.firstname || "",
    lastname: userData?.lastname || "",
  });

  // Hàm xử lý thay đổi dữ liệu từ các trường input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gọi updateProfile từ zustand để gửi dữ liệu lên server
      await updateProfileInfo(formData);
      setModalOpened(false); // Đóng modal sau khi cập nhật thành công
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
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
      <form className="infoForm" onSubmit={handleSubmit}>
        <h3>Thông tin cá nhân</h3>

        <div>
          <input
            type="text"
            className="infoInput"
            name="username"
            placeholder="Họ tên"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="text"
            className="infoInput"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            className="infoInput"
            name="firstname"
            placeholder="Tên đệm"
            value={formData.firstname}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            className="infoInput"
            name="lastname"
            placeholder="Tên lót"
            value={formData.lastname}
            onChange={handleChange}
          />
        </div>

        <button
          className="button infoButton"
          type="submit"
          disabled={isUpdatingProfile}
        >
          {isUpdatingProfile ? "Đang cập nhật..." : "Cập nhật"}
        </button>

        {/* Hiển thị lỗi nếu có */}
        {errorMessage && <div className="errorMessage">{errorMessage}</div>}
      </form>
    </Modal>
  );
}

export default ProfileModal;
