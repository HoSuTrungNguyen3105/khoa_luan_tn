import React, { useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import { useFollowStore } from "../../store/useFollowStore";

const AdvList = () => {
  const ads = useFollowStore((state) => state.ads); // Lấy danh sách quảng cáo từ store
  const setAds = useFollowStore((state) => state.setAds); // Hàm cập nhật danh sách quảng cáo trong store

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axiosInstance.get("/adv/ads");
        setAds(response.data); // Cập nhật store với dữ liệu quảng cáo
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAds();
  }, [setAds]);

  return (
    <div>
      <h2>Danh Sách Quảng Cáo</h2>
      <ul>
        {ads.map((ad) => (
          <li key={ad._id}>
            <h3>{ad.ND}</h3>
            <img src={ad.img} alt={ad.ND} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdvList;
