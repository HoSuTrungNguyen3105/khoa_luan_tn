import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const RewardBoard = ({ onRewardSelected }) => {
  const gridSize = 5;
  const [grid, setGrid] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    // Tạo mảng XP ngẫu nhiên
    const newGrid = Array.from(
      { length: gridSize * gridSize },
      () => Math.floor(Math.random() * 500) + 1
    );
    setGrid(newGrid);
  }, []);

  const startRolling = () => {
    setFlipping(true);
    let index = 0;
    const interval = setInterval(() => {
      setSelectedIndex(index);
      index = (index + 1) % (gridSize * gridSize);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const finalIndex = Math.floor(Math.random() * (gridSize * gridSize));
      setSelectedIndex(finalIndex);
      setFlipping(false);
      onRewardSelected(grid[finalIndex]);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-5 gap-2">
        {grid.map((xp, index) => (
          <motion.div
            key={index}
            className={`w-16 h-16 flex items-center justify-center text-white font-bold text-lg rounded-xl shadow-lg 
              ${selectedIndex === index ? "bg-green-500" : "bg-blue-500"}`}
            animate={{ rotateY: selectedIndex === index ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {selectedIndex === index ? xp : "?"}
          </motion.div>
        ))}
      </div>
      <button
        onClick={startRolling}
        className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg shadow-lg font-bold hover:bg-red-600"
        disabled={flipping}
      >
        Quay thưởng
      </button>
    </div>
  );
};

export default RewardBoard;
