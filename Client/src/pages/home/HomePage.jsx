import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Search } from "lucide-react";
import ShareModal from "../../conpoments/ShareModal/ShareModal";

const HomePage = () => {
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      {/* Hero Section */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center p-6">
        <h1 className="text-5xl font-bold mb-4">
          🔍 Lost & Found - Cộng Đồng Tìm Đồ
        </h1>
        <p className="text-lg max-w-2xl">
          Nền tảng giúp bạn tìm lại đồ thất lạc một cách nhanh chóng và dễ dàng.
          Hãy tham gia cộng đồng để hỗ trợ nhau nhé!
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 flex space-x-4">
          <Link
            to="/v1"
            className="flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition"
          >
            <Search className="w-5 h-5 mr-2" />
            Xem Bài Đăng
          </Link>

          <div className="flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition">
            {/* Chỉ hiển thị nút "Thêm Bài Đăng mới" nếu không phải admin */}
            <button onClick={() => setModalOpened(true)}>
              <PlusCircle />
              Thêm Bài Đăng mới
            </button>

            <ShareModal
              modalOpened={modalOpened}
              setModalOpened={setModalOpened}
            />
          </div>
        </div>
      </div>

      {/* Hướng dẫn */}
      <div className="relative z-10 bg-white text-gray-800 p-10 mt-[-50px] shadow-2xl rounded-t-3xl">
        <h2 className="text-3xl font-bold text-center mb-6">
          Cách Nền Tảng Hoạt Động 📌
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-gray-100 rounded-lg shadow">
            <h3 className="text-xl font-semibold">1️⃣ Báo Mất Đồ</h3>
            <p className="text-gray-600">
              Đăng tin về đồ bạn bị mất kèm hình ảnh & địa điểm.
            </p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow">
            <h3 className="text-xl font-semibold">2️⃣ Tìm Kiếm</h3>
            <p className="text-gray-600">
              Duyệt qua danh sách đồ bị mất & đã tìm thấy.
            </p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow">
            <h3 className="text-xl font-semibold">3️⃣ Liên Hệ</h3>
            <p className="text-gray-600">
              Kết nối với người tìm được để lấy lại đồ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
