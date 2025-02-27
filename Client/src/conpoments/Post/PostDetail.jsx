import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { usePostStore } from "../../store/usePostStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useFollowStore } from "../../store/useFollowStore";
import "./PostDetail.css";
import FacebookShareButton from "./FacebookShareButton";
import { Share2, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment"; // Thư viện để xử lý thời gian

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
  const fileInputRef = useRef();

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

  useEffect(() => {
    if (id) {
      fetchComments(id);
    }
  }, [id, fetchComments]);

  const breadcrumbs = useMemo(() => {
    return [
      {
        name: isAdminPage ? "Admin" : "Home",
        path: isAdminPage ? "/admin-dashboard" : "/",
      },
      { name: "Bài viết", path: "/" },
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
  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      })
    ).then((image) => {
      setEditedPost((prev) => ({
        ...prev,
        image: [...prev.image, ...image],
      }));
    });
  }, []);

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
  const handleRemoveImage = (indexToRemove) => {
    setEditedPost((prevState) => ({
      ...prevState,
      image: prevState.image.filter((_, index) => index !== indexToRemove),
    }));
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
  const handleSubmit = async () => {
    try {
      await addComment(post._id, authUser._id, newComment);

      setNewComment(""); // Reset input
    } catch (error) {
      console.error("Không thể gửi bình luận:", error);
    }
  };
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
            <b>Người đăng:</b> {post.userId.username}
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
          <input
            type="file"
            name="image"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="w-full p-4 bg-white bg-opacity-20  rounded-lg shadow-inner focus:ring-2 focus:ring-purple-300 focus:bg-opacity-30 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            multiple
          />
          <div className="mt-4 flex flex-wrap gap-4">
            {editedPost.image.map((images, index) => (
              <div key={index} className="relative group">
                <img
                  src={images}
                  alt={`selected-${index}`}
                  className="w-24 h-24 object-cover rounded-lg shadow-md border-2 border-white"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
          <div className="edit-actions">
            <button onClick={handleSave}>Lưu</button>
            <button onClick={handleCancel}>Hủy</button>
          </div>
        </div>
      ) : (
        <div className="post-info">
          <p className="post-description">{post.desc}</p>
          {/* <div className="relative w-full h-screen"> */}
          <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-lg aspect-[4/4]">
            {/* <div className="relative aspect-square"> */}
            <div
              className="absolute inset-0 bg-cover bg-center blur-xl scale-125 opacity-40"
              style={{ backgroundImage: `url(${post.image[0]})` }}
            ></div>
            <img
              src={
                post.image[currentImageIndex] ||
                "https://cdn-icons-png.freepik.com/256/15058/15058095.png?semt=ais_hybrid"
              }
              alt="Product"
              // className="relative w-full h-full object-contain z-10"
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
          {/* Thumbnails */}
          <div className="flex gap-2 mt-4">
            {post?.image?.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-none w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  currentImageIndex === index
                    ? "border-primary"
                    : "border-transparent"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          {/* <div className="flex gap-2 mt-4">
            {post &&
              post.image &&
              post.image.length > 0 &&
              post.image.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-none w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    currentImageIndex === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
          </div> */}
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
          <Link to={`/user/profile/${post.userId._id}`}>
            {post.userId.username}
          </Link>
        </div>
      )}

      {/* Edit Button */}
      {authUser && authUser._id === post.userId._id && !isEditing && (
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
        {authUser && authUser._id !== post.userId._id && (
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
      <h3 className="text-lg font-semibold border-b pb-2 mb-4">Bình luận</h3>

      {authUser && (
        <div className="comment-form mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận..."
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            rows="3"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {loading ? "Đang gửi..." : "Gửi"}
          </button>
        </div>
      )}
      <div className="comments space-y-3">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="comment flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              {/* Avatar */}
              <Link to={`/user/profile/${post.userId._id}`}>
                <img
                  src={comment.userId?.profilePic || "/avatar.jpg"} // Avatar mặc định nếu không có
                  alt={comment.userId?.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </Link>

              {/* Nội dung bình luận */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">
                    {comment.userId?.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {moment(comment.createdAt).fromNow()}{" "}
                    {/* Hiển thị thời gian */}
                  </span>
                </div>
                <h1>{comment.content}</h1>

                {/* Nút Like và Phản hồi */}
                <div className="flex items-center gap-4 mt-2">
                  <button className="text-sm text-gray-600 hover:text-blue-500 transition">
                    Thích
                  </button>
                  <button className="text-sm text-gray-600 hover:text-blue-500 transition">
                    Phản hồi
                  </button>
                </div>
              </div>

              {/* Nút xóa (chỉ hiển thị cho người dùng đã đăng bình luận) */}
              {authUser._id === comment.userId._id && (
                <button
                  onClick={() => deleteComment(comment._id)}
                  className="text-gray-500 hover:text-red-500 transition"
                >
                  🗑
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            Chưa có bình luận nào.
          </p>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
