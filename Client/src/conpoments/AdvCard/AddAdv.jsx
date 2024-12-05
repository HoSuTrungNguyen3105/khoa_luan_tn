import React, { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { useFollowStore } from "../../store/useFollowStore"; // Import Zustand store

const AddAdv = () => {
  const [formData, setFormData] = useState({
    ND: "", // Nội dung quảng cáo
    img: "", // Link hình ảnh
  });
  const [ads, setAds] = useState([]); // Danh sách quảng cáo
  const [editId, setEditId] = useState(null); // ID của quảng cáo đang chỉnh sửa
  const addAd = useFollowStore((state) => state.addAd); // Hàm addAd từ store

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        // Chỉnh sửa quảng cáo
        const response = await axiosInstance.put(`/adv/${editId}`, formData);
        if (response.status === 200) {
          setAds(
            ads.map((ad) => (ad._id === editId ? { ...ad, ...formData } : ad))
          );
          toast.success("Đã cập nhật quảng cáo thành công!");
        }
      } else {
        // Thêm mới quảng cáo
        const response = await axiosInstance.post("/adv", formData);
        if (response.status === 201) {
          setAds([...ads, response.data]);
          addAd(response.data);
          toast.success("Đã thêm quảng cáo thành công!");
        }
      }
      setFormData({ ND: "", img: "" });
      setEditId(null);
    } catch (error) {
      console.error("Error in request:", error);
      toast.error("Có lỗi xảy ra khi xử lý quảng cáo.");
    }
  };

  const handleEdit = (id) => {
    const adToEdit = ads.find((ad) => ad._id === id);
    if (adToEdit) {
      setFormData({ ND: adToEdit.ND, img: adToEdit.img });
      setEditId(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/adv/${id}`);
      if (response.status === 200) {
        setAds(ads.filter((ad) => ad._id !== id));
        toast.success("Đã xóa quảng cáo thành công!");
      }
    } catch (error) {
      console.error("Error in delete request:", error);
      toast.error("Có lỗi xảy ra khi xóa quảng cáo.");
    }
  };

  return (
    <div className="add-adv-form">
      <h2>{editId ? "Chỉnh sửa Quảng Cáo" : "Thêm Quảng Cáo"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="ND">Nội dung:</label>
          <textarea
            name="ND"
            value={formData.ND}
            onChange={handleChange}
            placeholder="Nhập nội dung quảng cáo"
          />
        </div>
        <div>
          <label htmlFor="img">Link hình ảnh:</label>
          <input
            type="text"
            name="img"
            value={formData.img}
            onChange={handleChange}
            placeholder="Nhập link hình ảnh"
          />
        </div>
        <button type="submit">{editId ? "Cập nhật" : "Thêm"}</button>
      </form>

      <h3>Danh sách Quảng Cáo</h3>
      <ul>
        {ads.map((ad) => (
          <li key={ad._id}>
            <p>{ad.ND}</p>
            <img src={ad.img} alt="Quảng cáo" width="100" />
            <button onClick={() => handleEdit(ad._id)}>Sửa</button>
            <button onClick={() => handleDelete(ad._id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddAdv;
