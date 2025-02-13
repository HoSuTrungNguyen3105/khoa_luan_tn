import React, { useCallback, useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { usePostStore } from "../../store/usePostStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate, useParams } from "react-router-dom";

const Contract = () => {
  const { id } = useParams();
  const { getPostById, post } = usePostStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [finder, setFinder] = useState({ phone: "", address: "", image: [] });
  const [loser, setLoser] = useState({ phone: "", address: "" });

  useEffect(() => {
    if (id) getPostById(id);
  }, [id, getPostById]);

  useEffect(() => {
    if (!post || !authUser) return;
    console.log("post.userId:", post.userId.email); // Kiểm tra dữ liệu userId

    const isFinder = authUser?._id !== post?.userId; // Kiểm tra ai là người tìm được
    setFinder({
      phone: isFinder ? authUser.email || "" : "",
      address: isFinder ? authUser.contact || "" : "",
      image: [],
    });
    setLoser({
      phone: post.userId.email || "Không có email",
      address: post?.contact || "",
    });
  }, [post, authUser]);

  const handleChange = (e, role) => {
    const { name, value } = e.target;
    if (role === "finder") {
      setFinder((prev) => ({ ...prev, [name]: value }));
    } else {
      setLoser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({ file, preview: reader.result });
          reader.readAsDataURL(file);
        });
      })
    ).then((images) => {
      setFinder((prev) => ({
        ...prev,
        image: [...prev.image, ...images],
      }));
    });
  }, []);

  const handleRemoveImage = (indexToRemove) => {
    setFinder((prev) => ({
      ...prev,
      image: prev.image.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const contractData = {
        finder,
        loser,
        postId: post.userId._id,
      };
      console.log("contractData:", contractData); // Kiểm tra dữ liệu trước khi gửi

      await axiosInstance.post("/user/contraction", contractData);
      alert("Hợp đồng đã được gửi để xác nhận!");
      navigate(-1);
    } catch (error) {
      console.error("Lỗi khi gửi hợp đồng:", error);
    }
  };

  if (!post || !authUser) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg text-center">
        <h2 className="text-xl font-bold mb-4 text-red-500">
          Chưa có ID hợp lệ
        </h2>
        <p className="mb-4">
          Vui lòng quay lại và truyền ID hợp lệ để tạo hợp đồng.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Tạo Hợp Đồng</h2>

      {/* Thông tin người tìm được */}
      <div>
        <h3 className="font-semibold">Người tìm được</h3>
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={finder.phone}
          onChange={(e) => handleChange(e, "finder")}
          className="w-full p-2 border rounded mt-2"
          required
          readOnly
        />
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          value={finder.address}
          onChange={(e) => handleChange(e, "finder")}
          className="w-full p-2 border rounded mt-2"
          required
          readOnly
        />
        <div className="space-y-2">
          <label className="block text-sm font-semibold">Chọn ảnh *</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="w-full p-4 bg-white rounded-lg shadow-inner file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            multiple
          />
          <div className="mt-4 flex flex-wrap gap-4">
            {finder.image.map(({ preview }, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`selected-image-${index}`}
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
        </div>
      </div>

      {/* Thông tin người bị mất */}
      <div className="mt-4">
        <h3 className="font-semibold">Người bị mất</h3>
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={loser.phone}
          onChange={(e) => handleChange(e, "loser")}
          className="w-full p-2 border rounded mt-2"
          required
          readOnly
        />
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          value={loser.address}
          onChange={(e) => handleChange(e, "loser")}
          className="w-full p-2 border rounded mt-2"
          required
          readOnly
        />
      </div>

      <button
        onChange={(e) => handleSubmit()}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Gửi hợp đồng
      </button>
    </form>
  );
};

export default Contract;
