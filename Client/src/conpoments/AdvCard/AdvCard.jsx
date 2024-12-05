import React, { useState, useEffect } from "react";
import axios from "axios"; // Đảm bảo axios được import đúng
import "./AdvCard.css";
import { axiosInstance } from "../../lib/axios";

const AdvCard = () => {
  const [ads, setAds] = useState([]); // State để lưu trữ quảng cáo
  const [loading, setLoading] = useState(true); // Trạng thái loading

  // Fetch dữ liệu từ API khi component được render
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axiosInstance.get("/adv"); // Thay URL đúng với backend
        setAds(response.data); // Lưu dữ liệu quảng cáo vào state
        setLoading(false); // Dữ liệu đã tải xong
      } catch (error) {
        console.error("Error fetching ads:", error); // In ra lỗi nếu có
        setLoading(false); // Dừng trạng thái loading
      }
    };
    fetchAds();
  }, []);

  return (
    <div className="AdvCard">
      <h3>Quảng cáo</h3>
      {loading ? (
        <p>Đang tải quảng cáo...</p> // Hiển thị khi đang tải dữ liệu
      ) : ads.length > 0 ? (
        ads.map((adv) => {
          return (
            <div key={adv._id} className="adv">
              {" "}
              {/* Thêm key để tránh cảnh báo từ React */}
              <div>
                <img
                  src={adv.img} // Link hình ảnh
                  alt="Quảng cáo"
                  className="advImg"
                />
              </div>
              <div className="advText">
                <span>{adv.ND}</span> {/* Nội dung quảng cáo */}
              </div>
            </div>
          );
        })
      ) : (
        <p>Không có quảng cáo hiện tại.</p> // Nếu không có quảng cáo
      )}
    </div>
  );
};

export default AdvCard;
