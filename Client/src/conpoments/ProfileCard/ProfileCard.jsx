import "./ProfileCard.css";
import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";
import XPProgressBar from "./XPProgressBar";

const ProfileCard = () => {
  const {
    authUser,
    isUpdatingProfile,
    updateProfile,
    fetchBadges,
    badge,
    setUser,
  } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [claimedRewards, setClaimedRewards] = useState(new Set());

  const calculateLevel = (xp) => Math.floor(xp / 500) + 1;

  useEffect(() => {
    if (!badge || badge.length === 0) {
      fetchBadges();
    }
  }, [badge]);

  useEffect(() => {
    if (authUser?.xp !== undefined) {
      const newLevel = calculateLevel(authUser.xp);
      if (newLevel > authUser.level) {
        updateUserLevel(newLevel);
      }
    }
  }, [authUser?.xp]);

  const updateUserLevel = async (newLevel) => {
    try {
      await axiosInstance.put(`/user/update-level`, { level: newLevel });
      setUser({ ...authUser, level: newLevel });
    } catch (error) {
      console.error("Lỗi cập nhật level:", error);
    }
  };

  const handleClaimReward = async () => {
    try {
      await axiosInstance.post(`/user/rewards/${authUser._id}`);
      setUser({ ...authUser, claimedLevel: authUser.level }); // Cập nhật đã nhận thưởng
    } catch (error) {
      console.error("Lỗi khi nhận thưởng:", error);
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
      <div className="ProfileImg flex flex-col items-center gap-4 p-4">
        <div className="relative">
          <img
            src={selectedImg || authUser.profilePic || "avatar.jpg"}
            alt="Profile"
            className="size-32 rounded-full object-cover border-4"
          />
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 bg-base-content p-2 rounded-full cursor-pointer transition-all duration-200 hover:scale-105"
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
      </div>
      <div className="ProfileName text-center">
        <span>@{authUser?.username}</span>
        <span className="block text-lg font-semibold">
          {authUser.firstname} {authUser.lastname}
        </span>
        {authUser?.level > authUser?.claimedLevel && (
          <button
            onClick={handleClaimReward}
            className="px-4 py-2 mt-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Nhận thưởng Level {authUser?.level}
          </button>
        )}

        <Link
          to={`/contracts/finder/${authUser._id}`}
          className="block text-blue-500 hover:underline"
        >
          Xem hợp đồng
        </Link>
        <XPProgressBar
          xp={authUser?.xp ?? 0}
          level={authUser?.level ?? 1}
          userId={authUser._id}
        />
      </div>
    </div>
  );
};

export default ProfileCard;
