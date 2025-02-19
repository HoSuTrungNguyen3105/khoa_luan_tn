import React from "react";

const MAX_XP = 10000; // XP tối đa trong mỗi level

const XPProgressBar = ({ xp, level, badgeName }) => {
  const progressWidth = Math.min((xp / MAX_XP) * 100, 100); // Giới hạn max 100%

  return (
    <div className="w-full max-w-lg p-5 border rounded-lg shadow-md bg-white">
      {/* Thông tin Level & XP */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-bold text-gray-700">
          🎖 Level: {level}
        </span>
        <span className="text-sm font-medium text-gray-500">
          Cấp độ: {badgeName}
        </span>
      </div>

      {/* Thanh XP */}
      <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-indigo-600 transition-all duration-500"
          style={{ width: `${progressWidth}%` }}
        ></div>

        {/* Hiển thị số phần trăm XP */}
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white">
          {Math.floor(progressWidth)}%
        </span>
      </div>

      {/* Hiển thị XP hiện tại */}
      <p className="text-center text-gray-600 text-sm mt-2">
        {xp} / {MAX_XP} XP
      </p>
    </div>
  );
};

export default XPProgressBar;
