import React, { useEffect } from "react";
import "./FollowerCard.css";
import { useUserStore } from "../../store/useUserStore";

const FollowerCard = () => {
  const {
    users,
    fetchUsers,
    followUser,
    unfollowUser,
    loggedInUserId,
    setLoggedInUserId,
    isLoading,
    error,
  } = useUserStore();

  // Giả lập người dùng đăng nhập (thay bằng logic thực tế của bạn)
  useEffect(() => {
    const loggedInId = "currentUserId"; // Thay bằng ID thực tế
    setLoggedInUserId(loggedInId);
    fetchUsers();
  }, [setLoggedInUserId, fetchUsers]);

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="FollowerCard">
      <div className="user-list">
        {users.map((user) => (
          <div
            key={user.username}
            className="user-item flex justify-between items-center"
          >
            <div>
              <p>{user.userId}</p>
              <small>Followers: {user.followers.length}</small>
            </div>

            {user._id !== loggedInUserId && (
              <button
                onClick={() =>
                  user.followers.includes(loggedInUserId)
                    ? unfollowUser(user._id)
                    : followUser(user._id)
                }
                className="btn btn-primary"
              >
                {user.followers.includes(loggedInUserId)
                  ? "Unfollow"
                  : "Follow"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowerCard;
