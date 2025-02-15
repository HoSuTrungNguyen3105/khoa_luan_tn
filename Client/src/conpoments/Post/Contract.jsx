import React, { useCallback, useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { usePostStore } from "../../store/usePostStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";

const Contract = () => {
  const { id } = useParams();
  const { getPostById, post } = usePostStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const { contracts, fetchContracts, updateContractStatus, loading } =
    useUserStore();
  const [finderId, setFinderId] = useState(null);
  const [loserId, setLoserId] = useState(null);
  const [finder, setFinder] = useState({ image: [] });
  const hasContract = contracts.some(
    (contract) => contract.postId === post._id
  );

  useEffect(() => {
    fetchContracts();
  }, []);

  useEffect(() => {
    if (id) getPostById(id);
  }, [id, getPostById]);

  useEffect(() => {
    if (!post || !authUser) return;
    const isFinder = authUser?._id !== post?.userId?._id;
    setFinderId(isFinder ? authUser._id : post?.userId?._id);
    setLoserId(isFinder ? post?.userId?._id : authUser._id);
  }, [post, authUser]);

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
        finderId,
        loserId,
        postId: post._id,
        images: finder.image.map((img) => img.preview),
      };

      console.log("contractData:", contractData);
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
    <div className="p-6 bg-white shadow-md rounded-lg">
      {hasContract ? (
        <>
          <h2 className="text-xl font-bold mb-4">Danh sách Hợp Đồng</h2>
          {contracts.map((contract) => (
            <div
              key={contract._id}
              className="border p-4 mb-4 rounded-lg shadow-md"
            >
              <p>
                <b>Finder:</b> {contract.finder.userId.username}
              </p>
              <p>
                <b>Loser:</b> {contract.loser.userId.username}
              </p>
              <p>
                <b>Trạng thái:</b> {contract.status}
              </p>
              <button
                onClick={() => updateContractStatus(contract._id, "confirmed")}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Duyệt
              </button>
              <button
                onClick={() => updateContractStatus(contract._id, "rejected")}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Từ chối
              </button>
            </div>
          ))}
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-4">Tạo Hợp Đồng</h2>

          <div>
            <h3 className="font-semibold">Người tìm được</h3>
            <input
              type="text"
              name="email"
              value={authUser.email}
              className="w-full p-2 border rounded mt-2"
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

          <div className="mt-4">
            <h3 className="font-semibold">Người bị mất</h3>
            <input
              type="text"
              name="email"
              value={post.userId.email}
              className="w-full p-2 border rounded mt-2"
              readOnly
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Gửi hợp đồng
          </button>
        </form>
      )}
    </div>
  );
};

export default Contract;
