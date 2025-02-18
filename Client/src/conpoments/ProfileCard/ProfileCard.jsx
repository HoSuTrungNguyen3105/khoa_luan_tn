import "./ProfileCard.css";
import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { axiosInstance } from "../../lib/axios"; // Giả sử bạn đã có axiosInstance để gọi API

const ProfileCard = () => {
  const { authUser, isUpdatingProfile, updateProfile, fetchBadges, badge } =
    useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  // const updateUserLevel = async () => {
  //   try {
  //     const response = await axiosInstance.get(
  //       `/user/${authUser._id}/update-level`
  //     );
  //     const newLevel = response.data.level;
  //     setLevel(newLevel);
  //   } catch (error) {
  //     console.error("Lỗi cập nhật cấp độ:", error);
  //   }
  // };

  useEffect(() => {
    if (!badge || badge.length === 0) {
      console.log("Fetching badges..." + fetchBadges);
      fetchBadges();
    }
  }, [badge, fetchBadges]);

  // useEffect(() => {
  //   console.log("authUser:", authUser); // Log authUser để kiểm tra dữ liệu
  //   if (authUser && authUser._id) {
  //     updateUserLevel();
  //   }
  // }, [authUser?._id]);

  const getBadgeNameById = (badges) => {
    try {
      const locationId = Number(badges);
      const badgesList = badge.find((p) => p.id === locationId);
      return badgesList ? badgesList.name : "Không xác định";
    } catch (error) {
      console.error("Lỗi khi lấy tên badge:", error);
      return "Không xác định";
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="ProfileCard">
      <div className="ProfileImg">
        <div className="flex flex-col items-center gap-4 p-4">
          <div className="relative">
            <img
              src={selectedImg || authUser.profilePic || "avatar.jpg"}
              alt="Profile"
              className="size-32 rounded-full object-cover border-4 "
            />
            <label
              htmlFor="avatar-upload"
              className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
            >
              <Camera className="w-5 h-5 text-base-200" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-sm text-zinc-400">
            {isUpdatingProfile ? "Uploading..." : ""}
          </p>
        </div>
      </div>
      <div className="ProfileName">
        <span>@{authUser?.username}</span>
        <span style={{ fontSize: "23px" }}>
          {authUser.firstname} {authUser.lastname}
        </span>
        <p>
          <span className="text-blue-500 font-semibold">
            {/* Điểm thưởng : {authUser?.points} */}
            <span>XP: {authUser?.xp ?? 0}</span>
            Cấp độ: {getBadgeNameById(authUser.badges)}
          </span>
        </p>

        {/* <span>{authUser.favoritesCount} Yêu thích</span> */}

        {/* Hiển thị "Tôi là admin" nếu role là admin */}
        {authUser?.role === "admin" && (
          <p className="text-red-900 font-extrabold mt-2">Admin</p>
        )}
      </div>
      <div className="FollowStatus">
        <hr />
        <div>
          {/* Cột Followers */}
          <div className="Follow">
            <span>{authUser.followers?.length || 0}</span>{" "}
            <span>Người theo dõi</span>
          </div>
          <div className="I"></div>
          <div className="Follow">
            <span>{authUser.following?.length || 0}</span>{" "}
            <span>Đang theo dõi</span>
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default ProfileCard;
