import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./Profile.css";
import { useUserStore } from "../../store/useUserStore";
import { useAuthStore } from "../../store/useAuthStore";
const UProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const {
    userData,
    loading,
    error,
    products,
    productsLoading,
    productsError,
    fetchUserData,
    fetchUserProducts,
  } = useUserStore();
  const { fetchBadges, badge } = useAuthStore();

  useEffect(() => {
    if (!badge || badge.length === 0) {
      fetchBadges();
    }
  }, [badge, fetchBadges]);

  const getBadgeNameById = (badges) => {
    const locationId = Number(badges);
    const badgesList = badge.find((p) => p.id === locationId);
    return badgesList ? badgesList.name : "Không xác định";
  };
  useEffect(() => {
    fetchUserData(userId);
    fetchUserProducts(userId);
  }, [userId, fetchUserData, fetchUserProducts]);

  const handleGoBack = () => navigate(-1);

  //   const handleBlockUser = () => {
  //     userData?.isBlocked;
  //   };

  if (loading) return <p>Đang tải thông tin người dùng...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="profile-page max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="banner w-full h-60">
          <img
            src={userData?.profilePic || "/logo512.png"}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="header p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {userData?.username || "TOTO MOBILE"}
              </h1>
              <p className="text-lg text-gray-600">
                {/* {userData?.location.city || "Địa chỉ không khả dụng"} */}
              </p>
              <p className="text-sm text-gray-600">Email: {userData?.email}</p>
              <p className="text-sm text-gray-600">
                Điện thoại: {userData?.contact || "Không khả dụng"}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-xl">&#9736; 4.7</span>
                <span className="text-sm text-gray-500">(115 đánh giá)</span>
              </div>
            </div>

            <div className="flex gap-4">
              <span>Danh hiệu: {getBadgeNameById(userData.badges)}</span>
              <span>
                Yêu thích: {userData?.favoritesCount || "Không khả dụng"}
              </span>
              <span>Bị report: {userData?.reports?.length || 0}</span>
              {/* <button
                onClick={handleBlockUser}
                className={`btn btn-sm ${
                  userData?.isBlocked ? "bg-red-500" : "bg-green-500"
                } text-white`}
              >
                {userData?.isBlocked ? "Bỏ Chặn" : "Chặn"}
              </button> */}
              <button
                onClick={handleGoBack}
                className="btn btn-outline btn-sm text-gray-600 hover:bg-gray-100"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold">Thông tin chi tiết</h2>
          <p>Vai trò: {userData?.role}</p>
          <p>Người theo dõi: {userData?.followers?.length}</p>
          <p>Đang theo dõi: {userData?.following?.length}</p>
          {/* <p>Số sản phẩm đang hoạt động: {userData?.activeListings}</p>
          <p>Tỉ lệ phản hồi: {userData?.responseRate}%</p> */}
          <p>
            Đã xác minh:{" "}
            {userData?.isVerified ? "Đã xác minh" : "Chưa xác minh"}
          </p>
        </div>

        <div className="tabs border-t border-b py-2 flex justify-around text-center">
          <button className="tab text-blue-600 font-semibold">CỬA HÀNG</button>
          <button className="tab text-gray-500 hover:text-blue-600">
            HOẠT ĐỘNG
          </button>
          <button className="tab text-gray-500 hover:text-blue-600">
            ĐÁNH GIÁ
          </button>
        </div>

        <div className="p-6">
          <p>Nội dung thông tin của người dùng sẽ hiển thị tại đây.</p>
        </div>
      </div>

      <UserProducts
        userId={userId}
        products={products}
        loading={productsLoading}
        error={productsError}
      />
    </div>
  );
};

const UserProducts = ({ userId, products, loading, error }) => {
  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (products.length === 0) return <p>Không có sản phẩm nào để hiển thị.</p>;
  const approvedPosts = products.filter(
    (post) => !post.isApproved && post.userId
  );

  return (
    <div className="profile-page max-w-4xl mx-auto bg-white rounded-lg shadow-lg mt-4">
      <h2 className="text-xl font-bold p-4">Sản phẩm của người dùng</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
        {approvedPosts.map((product) => (
          <Link key={product._id} to={`/post/${product._id}?userId=${userId}`}>
            <div className="border rounded-lg p-4 shadow hover:shadow-md">
              <img
                src={product.image[0] || "/logo512.png"}
                alt={product.name}
                className="w-full h-32 object-cover mb-2 rounded"
              />
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {product.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UProfile;
