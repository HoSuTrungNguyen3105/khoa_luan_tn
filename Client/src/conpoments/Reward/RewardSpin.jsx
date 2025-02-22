import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@mantine/core";
import { axiosInstance } from "../../lib/axios";
import { useAuthStore } from "../../store/useAuthStore.js";

const generateRewardBoard = () => {
  return Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => Math.floor(Math.random() * 451) + 50)
  );
};

export default function RewardSpin() {
  const [board, setBoard] = useState(generateRewardBoard);
  const [selectedCell, setSelectedCell] = useState(null);
  const [earnedXp, setEarnedXp] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const { authUser } = useAuthStore();

  const handleReward = async (row, col) => {
    if (isDisabled) return;
    setSelectedCell([row, col]);
    const xp = board[row][col];
    setEarnedXp(xp);
    setIsDisabled(true);

    try {
      await axiosInstance.post(`/user/rewards/${authUser._id}`, { xp });
    } catch (error) {
      console.error("Lỗi cập nhật XP:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="grid grid-cols-5 gap-2">
        {board.map((row, rowIndex) =>
          row.map((xp, colIndex) => {
            const isFlipped =
              selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
            return (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className="w-16 h-16 flex items-center justify-center rounded-lg text-white text-lg font-bold shadow-md transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: isFlipped ? "#facc15" : "#3b82f6",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
                animate={{
                  rotateY: isFlipped ? 180 : 0,
                }}
                transition={{ duration: 0.3 }}
                onClick={() => handleReward(rowIndex, colIndex)}
              >
                {isFlipped ? xp : "?"}
              </motion.div>
            );
          })
        )}
      </div>
      {earnedXp > 0 && (
        <p className="text-xl font-bold">Bạn nhận được {earnedXp} XP!</p>
      )}
      <Button
        onClick={() => {
          setSelectedCell(null);
          setEarnedXp(0);
          setIsDisabled(false);
          setBoard(generateRewardBoard());
        }}
        disabled={!isDisabled}
      >
        Chơi lại
      </Button>
    </div>
  );
}
