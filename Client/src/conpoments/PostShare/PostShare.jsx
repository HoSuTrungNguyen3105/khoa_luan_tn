import React, { useEffect, useRef, useState } from "react";
import "./PostShare.css";
import { usePostStore } from "../../store/usePostStore";
import { useAuthStore } from "../../store/useAuthStore";
import axios from "axios";

const PostShare = () => {
  const { authUser } = useAuthStore(); // Lấy thông tin người dùng đăng nhập từ Zustand
  const { createPost, isCreating, createPostSuccess, createPostError } =
    usePostStore(); // Lấy store từ Zustand
  const fileInputRef = useRef(); // Ref để reset input file

  // State quản lý form data
  const [formData, setFormData] = useState({
    userId: authUser?._id || "", // Lấy ID người dùng từ Zustand
    desc: "",
    contact: "",
    location: "", // Sẽ lưu ID của tỉnh thành
    image: null,
    isLost: false,
    isFound: false,
  });

  // State lưu danh sách tỉnh thành
  const [provinces, setProvinces] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);

  // Lấy danh sách tỉnh thành từ API khi component được render
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/post/provinces") // URL API tỉnh thành của bạn
      .then((response) => {
        setProvinces(response.data); // Cập nhật danh sách tỉnh thành
        setLoadingProvinces(false); // Dừng loading
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
        setLoadingProvinces(false);
      });
  }, []);

  // Cập nhật formData khi người dùng chọn tỉnh thành
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (e) => {
    setFormData({ ...formData, location: e.target.value }); // Lưu ID vào formData
  };

  // Cập nhật giá trị cho các trường boolean
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
      // Đảm bảo chỉ một checkbox được chọn
      isLost: name === "isLost" ? checked : false,
      isFound: name === "isFound" ? checked : false,
    }));
  };

  // Cập nhật trường ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result }); // Convert image to base64
      };
      reader.readAsDataURL(file);
    }
  };

  // Gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await createPost(formData); // Gọi hành động createPost từ store
    if (success) {
      setFormData({
        userId: authUser?._id || "",
        desc: "",
        contact: "",
        location: "",
        image: null, // Reset ảnh
        isLost: false,
        isFound: false,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset input file
      }
    }
  };

  useEffect(() => {
    if (authUser) {
      setFormData((prev) => ({ ...prev, userId: authUser._id })); // Cập nhật userId nếu authUser thay đổi
    }
  }, [authUser]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="desc"
          value={formData.desc}
          onChange={handleChange}
          className="textarea textarea-bordered w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Contact</label>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Location</label>
        <select
          name="location"
          value={formData.location}
          onChange={handleLocationChange}
          className="input input-bordered w-full"
          required
        >
          <option value="">Chọn tỉnh thành</option>
          {loadingProvinces ? (
            <option disabled>Đang tải tỉnh thành...</option>
          ) : (
            provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))
          )}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Select Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="input input-bordered w-full"
        />
      </div>
      <div className="flex space-x-4">
        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="isLost"
              checked={formData.isLost}
              onChange={handleCheckboxChange}
              className="checkbox"
            />
            <span className="ml-2">Lost Item</span>
          </label>
        </div>
        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="isFound"
              checked={formData.isFound}
              onChange={handleCheckboxChange}
              className="checkbox"
            />
            <span className="ml-2">Found Item</span>
          </label>
        </div>
      </div>
      <button
        type="submit"
        className={`btn ${isCreating ? "btn-disabled loading" : "btn-primary"}`}
        disabled={isCreating}
      >
        {isCreating ? "Creating..." : "Create Post"}
      </button>

      {createPostSuccess && (
        <p style={{ color: "green" }}>Post created successfully!</p>
      )}
      {createPostError && (
        <p style={{ color: "red" }}>Error: {createPostError}</p>
      )}
    </form>
  );
};

export default PostShare;
