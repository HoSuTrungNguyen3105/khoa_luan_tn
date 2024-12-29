import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
// import "./UserList.css";
import { axiosInstance } from "../../lib/axios";

const UserProfile = () => {
  const { userId } = useParams(); // Lấy userId từ URL
  const navigate = useNavigate(); // Hook điều hướng trang
  const [userData, setUserData] = useState(null); // Lưu trữ thông tin người dùng
  const [loading, setLoading] = useState(true); // Trạng thái đang tải
  const [error, setError] = useState(null); // Lỗi nếu có

  // Fetch thông tin người dùng từ API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/admin/user/${userId}`);
        setUserData(response.data);
      } catch (error) {
        setError("Không thể tải thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  // Xử lý chặn hoặc bỏ chặn người dùng
  const handleBlockUser = async () => {
    try {
      const response = await axiosInstance.put(`/admin/block/${userId}`);
      if (response.status === 200) {
        setUserData((prevData) => ({
          ...prevData,
          isBlocked: !prevData.isBlocked, // Đảo trạng thái chặn
        }));
      }
    } catch (err) {
      console.error("Lỗi khi chặn người dùng:", err);
    }
  };

  // Xử lý nút quay lại
  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) return <p>Đang tải thông tin người dùng...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="user-profile-container max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Nút quay lại */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleGoBack}
          className="btn btn-sm btn-outline text-zinc-600 hover:bg-zinc-100"
        >
          Quay lại
        </button>
      </div>

      {/* Phần hiển thị avatar và thông tin cơ bản */}
      <div className="profile-header flex flex-col items-center gap-4 p-4">
        <div className="relative">
          <img
            src={userData.profilePic || "/avatar.jpg"}
            alt={`${userData.username}'s Avatar`}
            className="w-32 h-32 rounded-full object-cover border-4 border-zinc-300"
          />
          <Camera className="absolute bottom-0 right-0 p-1 bg-white rounded-full border border-gray-300 cursor-pointer" />
        </div>
      </div>

      {/* Thông tin người dùng */}
      <div className="profile-info text-center mb-6">
        <h1 className="username text-2xl font-bold text-blue-600">
          {userData.username}
        </h1>
        <p className="text-lg text-zinc-500">
          {userData.firstname} {userData.lastname}
        </p>
        <strong>Ngày tham gia:</strong>{" "}
        {new Date(userData.createdAt).toLocaleDateString("vi-VN")}
        <p className="text-md text-rose-500">
          {userData.role === "admin" && "Đây là admin"}
        </p>
      </div>

      {/* Thông tin số người theo dõi và đang theo dõi */}
      <div className="follow-status mb-6">
        <hr className="mb-4" />
        <div className="flex justify-around">
          <div className="follow text-center">
            <span className="text-xl font-semibold">
              {userData.followers?.length || 0}
            </span>
            <span className="block text-sm text-zinc-400">Người theo dõi</span>
          </div>
          <div className="follow text-center">
            <span className="text-xl font-semibold">
              {userData.following?.length || 0}
            </span>
            <span className="block text-sm text-zinc-400">Đang theo dõi</span>
          </div>
        </div>
      </div>

      {/* Nút chặn / bỏ chặn người dùng */}
      <div className="block-section mb-6 text-center">
        <button
          className={`btn ${
            userData.isBlocked ? "btn-unblock" : "btn-block"
          } w-full`}
          onClick={handleBlockUser}
        >
          {userData.isBlocked ? "Bỏ chặn" : "Chặn"}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
