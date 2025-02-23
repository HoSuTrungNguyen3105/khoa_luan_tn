import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";

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
    const interval = setInterval(fetchXP, 10000); // Cập nhật mỗi 10 giây
    return () => clearInterval(interval);
  }, [userId]);

  const MAX_XP = level * 500;
  const progressWidth = Math.min((xp / MAX_XP) * 100, 100);

  // 📌 Thêm hàm cập nhật XP khi user hoàn thành nhiệm vụ
  const handleAddXP = async (xpEarned) => {
    try {
      const res = await axiosInstance.put("/user/update-xp", {
        userId,
        xpEarned,
      });
      setXP(res.data.xp);
      setLevel(res.data.level);
    } catch (error) {
      console.error("Lỗi khi cập nhật XP:", error);
    }
  };

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

      {/* Nút test tăng XP */}
      <button
        onClick={() => handleAddXP(200)}
        className="mt-4 px-4 py-2 bg-green-500 text-white font-bold rounded-lg"
      >
        +200 XP
      </button>
    </div>
  );
};

export default XPProgressBar;
