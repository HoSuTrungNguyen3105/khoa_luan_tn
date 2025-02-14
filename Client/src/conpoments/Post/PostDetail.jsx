import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { usePostStore } from "../../store/usePostStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useFollowStore } from "../../store/useFollowStore";
import "./PostDetail.css";
import FacebookShareButton from "./FacebookShareButton";
import { Share2, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Lấy query string từ URL
  const {
    getPostById,
    post,
    isLoading,
    error,
    updatePost,
    deletePost,
    fetchComments,
    addComment,
    comments,
    deleteComment,
  } = usePostStore(); // Add deletePost
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
    image: [],
  });
  const isAdminPage = location.pathname.startsWith("/admin");

  const { provinces, fetchProvinces } = usePostStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUserFollowing, setIsUserFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [newComment, setNewComment] = useState(""); // Nội dung comment mới
  const [loading, setLoading] = useState(false);

  // Lấy danh sách bình luận khi component được mount
  // useEffect(() => {
  //   const fetchComments = async () => {
  //     try {
  //       const response = await axiosInstance.get(`/post/comments/${id}`);
  //       setComments(response.data);
  //     } catch (error) {
  //       console.error("Lỗi khi tải bình luận:", error);
  //     }
  //   };
  //   fetchComments();
  // }, [id]);
  useEffect(() => {
    if (id) {
      console.log("Fetching comments for post:", id);
      fetchComments(id);
    }
  }, [id]);
  useEffect(() => {
    console.log("Current comments state:", comments);
  }, [comments]);

  // Xử lý gửi bình luận
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return; // Không gửi comment rỗng
    setLoading(true);

    try {
      const response = await axiosInstance.post("/post/comments", {
        postId: post._id,
        userId: authUser._id,
        content: newComment,
      });

      // setComments((prevComments) => [...prevComments, response.data.comment]);
      setNewComment(""); // Reset input
    } catch (error) {
      console.error(
        "Lỗi khi gửi bình luận:",
        error.response?.data || error.message
      );
    }
    setLoading(false);
  };
  const breadcrumbs = useMemo(() => {
    return [
      {
        name: isAdminPage ? "Admin" : "Home",
        path: isAdminPage ? "/admin-dashboard" : "/",
      },
      { name: "Bài viết", path: "/post" },
      { name: post?.title || "Post", path: `/post/${id}` },
    ];
  }, [post, id]);
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
      if (authUser && post && post.userId._id) {
        const status = await fetchFollowingStatus(
          authUser._id,
          post.userId._id
        );
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

  // useEffect(() => {
  //   const fetchComments = async () => {
  //     try {
  //       const response = await axiosInstance.get(`/post/comments/${id}`);
  //       setComments(response.data.comments);
  //     } catch (error) {
  //       console.error("Lỗi khi tải bình luận:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (id) {
  //     fetchComments();
  //   }
  // }, [id]);
  const handleFollowToggle = async () => {
    if (!authUser || !post.userId._id) return;
    setIsFollowLoading(true);
    try {
      if (isUserFollowing) {
        await unfollowUser(authUser._id, post.userId._id);
        setIsUserFollowing(false);
      } else {
        await followUser(authUser._id, post.userId._id);
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

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : post?.image?.length - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < post?.image?.length - 1 ? prevIndex + 1 : 0
    );
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
  // const postUrl = `${config.baseUrl}/post/${id}`;
  return (
    <div className="post-detail">
      {/* Breadcrumb */}
      <nav>
        {breadcrumbs.map((crumb, index) => (
          <span key={index}>
            <Link to={crumb.path}>{crumb.name}</Link>
            {index < breadcrumbs.length - 1 && " › "}
          </span>
        ))}
      </nav>

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
            type="contact"
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
          <div className="relative aspect-square">
            <img
              src={
                post.image[currentImageIndex] ||
                "https://cdn-icons-png.freepik.com/256/15058/15058095.png?semt=ais_hybrid"
              }
              alt="Product"
              className="w-full h-full object-contain rounded-lg"
            />

            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="bg-white/80 p-2 rounded-full">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {post.image.length}
            </div>
          </div>
          <p className="post-contact">
            <button className="contact-button">
              Liên lạc qua số : {post.contact}
            </button>
          </p>
          <Link to={`/contract?postId=${post._id}&userId=${authUser._id}`}>
            Giao dịch
          </Link>
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
        crossOrigin="anonymous"
        src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v16.0"
        nonce="ABC123"
      ></script>

      <FacebookShareButton postId={post._id} />

      {/* Phần bình luận */}
      <div className="comments-section">
        <h3>Bình luận</h3>
        {authUser && (
          <div className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận..."
            />
            <button onClick={handleCommentSubmit} disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi"}
            </button>
          </div>
        )}

        <div className="comments-list">
          {console.log("Rendering comments:", comments)}

          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="comment">
                <p>
                  <b>{comment.userId?.username}</b>: {comment.content}
                </p>
              </div>
            ))
          ) : (
            <p>Chưa có bình luận nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
