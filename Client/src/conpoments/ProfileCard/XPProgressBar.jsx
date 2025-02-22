import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios"; // Giả sử bạn đã có axiosInstance để gọi API

const XPProgressBar = ({ userId }) => {
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const fetchXP = async () => {
      try {
        const res = await axiosInstance.get(`/user/get-xp/${userId}`);
        setXP(res.data.xp);
        setLevel(res.data.level);
      } catch (error) {
        console.error("Lỗi khi tải XP:", error);
      }
    };

    fetchXP();

    // Tự động cập nhật XP mỗi 10 giây (có thể chỉnh sửa)
    const interval = setInterval(fetchXP, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  const MAX_XP = level * 500;
  const progressWidth = Math.min((xp / MAX_XP) * 100, 100);

  return (
    <div className="w-full max-w-lg p-5 border rounded-lg shadow-md bg-white">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-bold text-gray-700">
          🎖 Level: {level}
        </span>
        <span className="text-sm font-medium text-gray-500">XP Progress</span>
      </div>

      <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-indigo-600 transition-all duration-500"
          style={{ width: `${progressWidth}%` }}
        ></div>
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white">
          {Math.floor(progressWidth)}%
        </span>
      </div>

      <p className="text-center text-gray-600 text-sm mt-2">
        {xp} / {MAX_XP} XP
      </p>
    </div>
  );
};

export default XPProgressBar;
