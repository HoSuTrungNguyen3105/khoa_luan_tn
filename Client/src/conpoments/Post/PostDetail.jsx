import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePostStore } from "../../store/usePostStore"; // Import zustand store
import "./PostDetail.css"; // Thêm file CSS vào

const PostDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate(); // Dùng để điều hướng
  const {
    getPostById,
    post,
    isLoading,
    error,
    followUser,
    unfollowUser,
    isFollowing,
  } = usePostStore(); // Lấy các trạng thái và hành động từ zustand store

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (id) {
      getPostById(id); // Gọi hàm từ store để lấy dữ liệu bài viết theo id
    }
  }, [id, getPostById]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Post not found!</div>;
  }

  const handleGoBack = () => {
    navigate("/");
  };

  const handleFollow = () => {
    followUser(currentUserId, post.userId);
  };

  const handleUnfollow = () => {
    unfollowUser(currentUserId, post.userId);
  };

  return (
    <div className="post-detail">
      <div className="post-header">
        <h1>{post.userName || "Người dùng ẩn danh"}</h1>
        <button className="go-back-btn" onClick={handleGoBack}>
          Quay lại
        </button>
      </div>
      <p className="post-description">{post.desc}</p>
      {post.image && <img src={post.image} alt="Post" className="post-image" />}
      <p className="post-contact">Liên hệ: {post.contact}</p>
      <p className="post-location">Địa điểm: {post.location}</p>

      <div className="post-actions">
        {isFollowing ? (
          <button className="follow-btn unfollow" onClick={handleUnfollow}>
            Hủy theo dõi
          </button>
        ) : (
          <button className="follow-btn follow" onClick={handleFollow}>
            Theo dõi
          </button>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
