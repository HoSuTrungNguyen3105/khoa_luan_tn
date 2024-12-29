import React, { useEffect, useRef, useState } from "react";
import "./PostShare.css";
import { usePostStore } from "../../store/usePostStore";
import { useAuthStore } from "../../store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa"; // Thêm icon

const PostShare = ({ onPostCreateSuccess }) => {
  const { authUser } = useAuthStore();
  const { createPost, isCreating } = usePostStore();
  const fileInputRef = useRef();
  const [hovered, setHovered] = useState(null); // Để theo dõi nút đang hover

  const [setError] = useState("");
  const [formData, setFormData] = useState({
    userId: authUser?._id || "",
    username: authUser?.username || "",
    desc: "",
    contact: "",
    location: "",
    image: null,
  });

  const [postType, setPostType] = useState(""); // State để lưu loại bài đăng
  const [provinces, setProvinces] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/post/provinces")
      .then((response) => {
        setProvinces(response.data);
        setLoadingProvinces(false);
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
        setLoadingProvinces(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (e) => {
    setFormData({ ...formData, location: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const success = await createPost({ ...formData, postType });
      if (success) {
        setFormData({
          userId: authUser?._id || "",
          username: authUser?.username || "",
          desc: "",
          contact: "",
          location: "",
          image: null,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        if (onPostCreateSuccess) {
          onPostCreateSuccess();
        }
      }
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
      toast.error("Đã xảy ra lỗi khi đăng bài.");
    }
  };

  return (
    <div className="post-share-container">
      {!postType && (
        <div className="space-y-8 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-800">
            Bạn muốn đăng bài về?
          </h2>
          <div className="flex justify-center space-x-6">
            <button
              onClick={() => setPostType("isLost")}
              onMouseEnter={() => setHovered("isLost")} // Khi chuột di vào nút
              onMouseLeave={() => setHovered(null)} // Khi chuột rời khỏi nút
              className={`btn w-48 p-5 rounded-lg text-lg font-semibold transition-all duration-300 ${
                postType === "isLost"
                  ? "bg-blue-600 text-white scale-110"
                  : "bg-white text-blue-600 border-2 border-blue-600"
              } shadow-lg flex items-center justify-center space-x-2 transform ${
                hovered === "isLost" ? "scale-110" : ""
              }`}
            >
              {(hovered === "isLost" || postType === "isLost") && (
                <FaCheckCircle className="text-blue-600" />
              )}
              <span>Mất đồ</span>
            </button>
            <button
              onClick={() => setPostType("isFound")}
              onMouseEnter={() => setHovered("isFound")}
              onMouseLeave={() => setHovered(null)}
              className={`btn w-48 p-5 rounded-lg text-lg font-semibold transition-all duration-300 ${
                postType === "isFound"
                  ? "bg-blue-600 text-white scale-110"
                  : "bg-white text-blue-600 border-2 border-blue-600"
              } shadow-lg flex items-center justify-center space-x-2 transform ${
                hovered === "isFound" ? "scale-110" : ""
              }`}
            >
              {(hovered === "isFound" || postType === "isFound") && (
                <FaCheckCircle className="text-blue-600" />
              )}
              <span>Đã tìm thấy</span>
            </button>
          </div>
        </div>
      )}

      {postType && (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
          <p className="text-md font-semibold text-gray-700">
            Bài đăng: {postType === "isLost" ? "Mất đồ" : "Đã tìm thấy"}
          </p>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Mô tả *
            </label>
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              className="textarea textarea-bordered w-full p-3 rounded-md"
              placeholder="Viết mô tả..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Liên lạc *
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="input input-bordered w-full p-3 rounded-md"
              placeholder="Số điện thoại"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Địa điểm *
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleLocationChange}
              className="input input-bordered w-full p-3 rounded-md"
              required
            >
              <option value="">Chọn địa điểm</option>
              {loadingProvinces ? (
                <option disabled>Loading provinces...</option>
              ) : (
                provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Chọn ảnh *
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="input input-bordered w-full p-3 rounded-md"
            />
          </div>

          <button
            type="submit"
            className={`btn w-full p-3 rounded-md ${
              isCreating
                ? "btn-disabled loading"
                : "btn-primary hover:bg-blue-600"
            }`}
            disabled={isCreating}
          >
            {isCreating ? "Đang tạo bài..." : "Đăng bài"}
          </button>
        </form>
      )}
    </div>
  );
};

export default PostShare;
