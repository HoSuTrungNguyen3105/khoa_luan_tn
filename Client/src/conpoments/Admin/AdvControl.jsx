import React, { useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import "./Report.css";
import { useAdStore } from "../../store/useAdStore";

const AdvControl = () => {
  const { ads, formData, editingAd, setAds, setFormData, setEditingAd } =
    useAdStore();
  // Lấy danh sách quảng cáo từ backend
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axiosInstance.get("/adv");
        setAds(response.data);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAds();

    // Tải lại sau mỗi 30 giây
    const interval = setInterval(fetchAds, 30000);

    return () => clearInterval(interval);
  }, []);

  // Xử lý thay đổi dữ liệu form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Chỉnh sửa bài viết
  const handleEditPost = (adv) => {
    setEditingAd(adv);
    setFormData({
      ND: adv.ND,
      img: adv.img,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        `/adv/${editingAd._id}`,
        formData
      );
      console.log("Response:", response); // Kiểm tra phản hồi
      setEditingAd(null); // Reset lại trạng thái chỉnh sửa
      alert("Đã lưu thay đổi.");

      // Làm mới danh sách quảng cáo
      const updatedAds = ads.map((ad) =>
        ad._id === editingAd._id ? { ...ad, ...formData } : ad
      );
      setAds(updatedAds); // Cập nhật lại state với danh sách mới
    } catch (error) {
      console.error("Error saving edit:", error);
      alert("Có lỗi xảy ra khi lưu thay đổi.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Danh sách quảng cáo */}
      <div className="ads-section">
        {ads.map((adv) => (
          <div key={adv._id} className="ad-card">
            <div className="ad-card-image">
              <img src={adv.img} alt="Ad" />
            </div>
            <div className="ad-card-content">
              <p>{adv.ND}</p>
              <button
                className="btn btn-edit"
                onClick={() => handleEditPost(adv)}
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form chỉnh sửa (chỉ hiển thị khi có quảng cáo để chỉnh sửa) */}
      {editingAd && (
        <div className="form-overlay">
          <div className="form-section">
            <h3>Chỉnh sửa quảng cáo</h3>
            <form onSubmit={handleSaveEdit}>
              <label htmlFor="ND">Nội dung:</label>
              <textarea
                name="ND"
                value={formData.ND}
                onChange={handleChange}
                placeholder="Nhập nội dung"
              />
              <label htmlFor="img">Link hình ảnh:</label>
              <input
                name="img"
                value={formData.img}
                onChange={handleChange}
                placeholder="Nhập link hình ảnh"
              />
              <button className="btn btn-save" type="submit">
                Lưu
              </button>
              <button
                className="btn btn-cancel"
                onClick={() => setEditingAd(null)}
              >
                Hủy
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvControl;
