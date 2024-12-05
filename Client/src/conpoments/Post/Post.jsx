import React, { useState, useEffect } from "react";
import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import { useFollowStore } from "../../store/useFollowStore";
import { usePostStore } from "../../store/usePostStore";
import toast from "react-hot-toast";

const Post = ({ data, currentUserId }) => {
  const {
    following,
    fetchFollowingStatus,
    followUser,
    unfollowUser,
    setFollowing,
  } = useFollowStore();

  const [isLoading, setIsLoading] = useState(true);
  const { provinces, fetchProvinces, reportPost } = usePostStore(); // Lấy dữ liệu từ store

  useEffect(() => {
    if (provinces.length === 0) {
      fetchProvinces(); // Lấy danh sách tỉnh thành khi component mount
    }
  }, [provinces, fetchProvinces]);
  const isCurrentUserPost = currentUserId === data.userId;

  useEffect(() => {
    const fetchStatus = async () => {
      setIsLoading(true);
      try {
        const isFollowing = await fetchFollowingStatus(
          currentUserId,
          data.userId
        );
        setFollowing(data.userId, isFollowing);
      } catch (error) {
        setFollowing(data.userId, false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, [currentUserId, data.userId, fetchFollowingStatus, setFollowing]);

  const handleFollow = async () => {
    if (!currentUserId || !data.userId) return;
    setIsLoading(true);
    try {
      await followUser(currentUserId, data.userId);
      setFollowing(data.userId, true);
    } catch (error) {
      console.error("Failed to follow user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!currentUserId || !data.userId) return;
    setIsLoading(true);
    try {
      await unfollowUser(currentUserId, data.userId);
      setFollowing(data.userId, false);
    } catch (error) {
      console.error("Failed to unfollow user:", error);
      // Kiểm tra xem currentUserId có phải là một chuỗi hợp lệ hay không
      console.log(typeof currentUserId, currentUserId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReport = async () => {
    try {
      // Gọi API báo cáo, truyền cả postId và userId
      await reportPost(data._id, currentUserId);
    } catch (error) {
      toast.success("Có lỗi khi báo cáo bài viết .");
      console.error("Report failed:", error);
    }
  };

  const isUserFollowing = following[data.userId] || false;

  const username = isCurrentUserPost
    ? "Bài của bạn"
    : data.userName || "Người dùng ẩn danh";

  const formattedDate = data.createdAt
    ? new Date(data.createdAt).toLocaleString("vi-VN", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "Không rõ ngày";
  const getProvinceNameById = (location) => {
    // Chuyển location thành số nếu nó là chuỗi
    const locationId = Number(location); // chuyển location thành số
    const province = provinces.find((p) => p.id === locationId);
    return province ? province.name : "Không xác định";
  };

  return (
    <div className="post-container">
      <div className="Post">
        {/* Hình ảnh bài đăng */}
        {data.image && (
          <img src={data.image} alt="post" className="post-image" />
        )}

        {/* Nút tương tác */}
        <div className="postReact">
          <img src={Comment} alt="comment" />
          <img src={Share} alt="share" />
          {!isCurrentUserPost && (
            <>
              <button
                className={`button fc-button ${
                  isUserFollowing ? "unfollow" : "follow"
                }`}
                onClick={isUserFollowing ? handleUnfollow : handleFollow}
                disabled={isLoading}
              >
                {isLoading
                  ? "Đang tải..."
                  : isUserFollowing
                  ? "Đã theo dõi"
                  : "Theo dõi"}
              </button>

              {/* Nút báo cáo bài viết */}
              <button
                className="report-btn button btn-danger"
                onClick={handleReport}
              >
                Báo cáo
              </button>
            </>
          )}
        </div>

        {/* Chi tiết bài đăng */}
        <div className="detail">
          <span>
            <b>Người đăng: {username}</b>
          </span>
          <br />
          <span>Mô tả: {data.desc || "Không có mô tả"}</span>
          <br />
          <p>
            Địa điểm:{" "}
            {isLoading
              ? "Đang tải địa điểm..."
              : getProvinceNameById(data.location)}
          </p>

          <br />
          <span>Ngày tạo: {formattedDate}</span>
          <br />
          <span>
            Liên hệ:{" "}
            {data.contact
              ? `${data.contact.substring(0, 3)}***${data.contact.substring(
                  data.contact.length - 3
                )}`
              : "Không có thông tin liên hệ"}
          </span>
          <br />
          <span
            className={`font-bold border rounded px-2 py-1 ${
              data.isLost
                ? "text-red-500 border-red-500"
                : data.isFound
                ? "text-green-500 border-green-500"
                : "text-gray-500 border-gray-500"
            }`}
          >
            Loại:{" "}
            {data.isLost
              ? "Đồ bị mất"
              : data.isFound
              ? "Đã tìm thấy"
              : "Chưa xác định"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Post;
