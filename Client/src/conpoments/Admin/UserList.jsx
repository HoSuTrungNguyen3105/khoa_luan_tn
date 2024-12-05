import React, { useEffect } from "react";
import "./UserList.css"; // Thêm CSS nếu cần để tăng tính thẩm mỹ
import { useAuthStore } from "../../store/useAuthStore";

const UserList = () => {
  const { users, isLoading, error, fetchUsers, toggleBlockUser } =
    useAuthStore();

  useEffect(() => {
    fetchUsers(); // Lấy danh sách người dùng khi component được mount
  }, [fetchUsers]);

  console.log("Users from store:", users); // Log danh sách người dùng từ store

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-list-container">
      <h2 className="header">User List</h2>

      {users.length === 0 ? (
        <p className="empty-message">No users available</p>
      ) : (
        <div className="user-list">
          {users.map((user) => (
            <div
              key={user._id}
              className={`user-card ${user.isBlocked ? "blocked" : ""}`} // Thêm class 'blocked' nếu người dùng bị block
            >
              <p className="user-name">
                <strong>Username:</strong> {user.username}
              </p>
              <p className="user-email">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="user-followers">
                <strong>Followers:</strong> {user.followers?.length || 0}
              </p>
              <p className="user-following">
                <strong>Following:</strong> {user.following?.length || 0}
              </p>
              <button
                className={`btn ${
                  user.isBlocked ? "btn-unblock" : "btn-block"
                }`}
                onClick={() => toggleBlockUser(user._id)}
              >
                {user.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
