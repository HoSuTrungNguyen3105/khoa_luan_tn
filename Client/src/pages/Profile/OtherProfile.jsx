import React, { useEffect } from "react";
import { useUserStore } from "../../store/useUserStore";

const OtherProfile = ({ userId }) => {
  const {
    fetchUserProfile,
    userProfile,
    followUser,
    unfollowUser,
    loggedInUserId,
    followersCount,
  } = useUserStore();

  useEffect(() => {
    fetchUserProfile(userId); // Lấy thông tin người dùng
  }, [userId, fetchUserProfile]);

  const handleFollow = () => {
    followUser(loggedInUserId, userId);
  };

  const handleUnfollow = () => {
    unfollowUser(loggedInUserId, userId);
  };

  return (
    <div>
      <h1>{userProfile?.username}</h1>
      <p>Followers: {followersCount}</p>
      <button onClick={handleFollow}>Follow</button>
      <button onClick={handleUnfollow}>Unfollow</button>
    </div>
  );
};

export default OtherProfile;
