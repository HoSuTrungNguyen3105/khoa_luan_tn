import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import { Helmet } from "react-helmet"; // Import React Helmet
import { usePostStore } from "../../store/usePostStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useFollowStore } from "../../store/useFollowStore";
import "./PostDetail.css";
import FacebookShareButton from "./FacebookShareButton";
import config from "../../lib/config";
import toast from "react-hot-toast";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Lấy query string từ URL
  const { getPostById, post, isLoading, error, updatePost, deletePost } =
    usePostStore(); // Add deletePost
  const { authUser } = useAuthStore();
  const { followUser, unfollowUser, fetchFollowingStatus } = useFollowStore();
  const [user, setUserId] = useState(null);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const fetchedUserId = queryParams.get("userId");
    setUserId(fetchedUserId);
  }, [location]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({
    desc: "",
    contact: "",
    location: "",
    image: "",
  });
  const { provinces, fetchProvinces, reportPost } = usePostStore();

  const [isUserFollowing, setIsUserFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  // Lấy danh sách tỉnh thành nếu chưa tải
  useEffect(() => {
    if (provinces.length === 0) fetchProvinces();
  }, [provinces, fetchProvinces]);

  useEffect(() => {
    if (id) {
      getPostById(id);
    }
  }, [id, getPostById]);

  useEffect(() => {
    if (post) {
      setEditedPost({
        desc: post.desc,
        contact: post.contact,
        location: post.location,
        image: post.image,
      });
    }
  }, [post]);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (authUser && post && post.userId) {
        const status = await fetchFollowingStatus(authUser._id, post.userId);
        setIsUserFollowing(status);
      }
    };
    checkFollowStatus();
  }, [authUser, post, fetchFollowingStatus]);

  const handleGoBack = () => navigate(-1);

  const handleEditClick = () => {
    setIsEditing(true);
  };
  // Lấy tên tỉnh thành dựa vào ID
  const getProvinceNameById = (location) => {
    const locationId = Number(location);
    const province = provinces.find((p) => p.id === locationId);
    return province ? province.name : "Không xác định";
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    updatePost({ ...post, ...editedPost });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPost({
      desc: post.desc,
      contact: post.contact,
      location: post.location,
      image: post.image,
    });
    setIsEditing(false);
  };

  const handleFollowToggle = async () => {
    if (!authUser || !post.userId) return;
    setIsFollowLoading(true);
    try {
      if (isUserFollowing) {
        await unfollowUser(authUser._id, post.userId);
        setIsUserFollowing(false);
      } else {
        await followUser(authUser._id, post.userId);
        setIsUserFollowing(true);
      }
    } catch (error) {
      console.error("Failed to toggle follow status:", error);
    } finally {
      setIsFollowLoading(false);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedPost((prevState) => ({
          ...prevState,
          image: reader.result, // Lưu base64 vào state
        }));
      };
      reader.readAsDataURL(file); // Chuyển file sang base64
    }
  };

  const handleMessage = () => {
    if (!isUserFollowing) {
      alert("Bạn cần theo dõi trước khi nhắn tin!");
    } else {
      navigate("/chatbox");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn chắc chắn muốn xóa bài đăng này?")) {
      try {
        await deletePost(post._id); // Call deletePost to remove the post
        toast.success("Xóa thành công !");
        navigate("/"); // Navigate to the homepage or any other page
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v21.0";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>Post not found!</div>;
  const postUrl = `${config.baseUrl}/post/${id}`;

  return (
    <div className="post-detail">
      {/* Thêm thẻ meta Open Graph */}
      <Helmet>
        {/* Remove title meta tag to prevent displaying "React App" */}
        <meta property="og:type" content="website" />
        <meta property="og:image" content={post.image || "/avatar.jpg"} />
        <meta property="og:url" content={postUrl} />
        {/* Add noindex to prevent search engines from indexing the ngrok URL */}
        <meta name="robots" content="noindex" />
        {/* Force Facebook to use a blank title */}
        <meta property="og:title" content=" " />
        <meta property="og:description" content=" " />
      </Helmet>

      <div className="post-header">
        {user && (
          <p>
            <b>Người đăng:</b> {user}
          </p>
        )}
        {authUser && (
          <button className="button btn-back" onClick={handleGoBack}>
            Quay lại
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="edit-form">
          <textarea
            name="desc"
            value={editedPost.desc}
            onChange={handleInputChange}
            placeholder="Mô tả"
          />
          <input
            type="text"
            name="contact"
            value={editedPost.contact}
            onChange={handleInputChange}
            placeholder="Liên hệ"
          />
          <select
            name="location"
            value={editedPost.location}
            onChange={handleInputChange}
          >
            <option value="">Chọn địa điểm</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          <div className="edit-actions">
            <button onClick={handleSave}>Lưu</button>
            <button onClick={handleCancel}>Hủy</button>
          </div>
        </div>
      ) : (
        <div className="post-info">
          <p className="post-description">{post.desc}</p>
          {post.image && (
            <img src={post.image} alt="Post" className="post-image" />
          )}
          <p className="post-contact">
            <button className="contact-button">
              Liên lạc qua số : {post.contact}
            </button>
          </p>
          <p className="post-location">
            Địa điểm: {getProvinceNameById(post.location)}
          </p>
        </div>
      )}

      {/* Edit Button */}
      {authUser && authUser._id === post.userId && !isEditing && (
        <div className="postReact">
          <button className="button fc-button" onClick={handleEditClick}>
            Sửa
          </button>
          <button className="button fc-button" onClick={handleDelete}>
            Xóa
          </button>
        </div>
      )}

      <div className="postReact">
        {authUser && authUser._id !== post.userId && (
          <>
            <button
              className={`button fc-button ${
                isUserFollowing ? "unfollow" : "follow"
              }`}
              onClick={handleFollowToggle}
              disabled={isFollowLoading}
            >
              {isFollowLoading
                ? "Loading..."
                : isUserFollowing
                ? "Đã theo dõi"
                : "Theo dõi"}
            </button>
            <button className="button fc-button" onClick={handleMessage}>
              Nhắn Tin
            </button>
          </>
        )}
      </div>

      <div id="fb-root"></div>
      <script
        async
        defer
        crossorigin="anonymous"
        src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v16.0"
        nonce="ABC123"
      ></script>

      <FacebookShareButton postId={post._id} />
    </div>
  );
};

export default PostDetail;
