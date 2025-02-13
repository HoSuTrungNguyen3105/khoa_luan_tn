import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import "./UserList.css"; // Thêm nếu cần style
import { useAdminStore } from "../../store/useAdminStore";

const AdminList = () => {
  const [users, setUsers] = useState([]); // Dữ liệu người dùng
  const [searchUser, setSearchUser] = useState(""); // Tìm kiếm người dùng
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải
  const [error, setError] = useState(null); // Trạng thái lỗi
  const [reportCounts, setReportCounts] = useState({}); // Số lần báo cáo của người dùng
  const { deleteUser } = useAdminStore(); // Lấy thông tin người dùng đã đăng nhập

  // Gọi API để lấy danh sách người dùng
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/admin/getAdmins");
        setUsers(response.data); // Cập nhật danh sách người dùng
        fetchReportCounts(response.data); // Fetch báo cáo cho mỗi người dùng
      } catch (err) {
        setError(
          err.response?.data?.error || "Không thể lấy danh sách người dùng"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchReportCounts = async (users) => {
    const counts = {};
    for (const user of users) {
      try {
        const response = await axiosInstance.get(
          `/admin/getReportsByUser/${user._id}`
        );
        // Log the report count response for debugging
        // console.log(
        //   `Report count for ${user.username}:`,
        //   response.data.reportCount
        // );
        // Ensure the response contains a valid report count
        counts[user._id] = response.data.reportCount || 0;
      } catch (err) {
        console.error(
          "Error fetching report count for user",
          user.username,
          err
        );
        counts[user._id] = 0; // Default to 0 if there's an error
      }
    }
    setReportCounts(counts); // Set the fetched report counts into state
  };

  // Hàm xử lý tìm kiếm người dùng
  const handleSearch = (e) => {
    setSearchUser(e.target.value);
  };

  // Lọc người dùng dựa trên từ khóa tìm kiếm
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.firstname.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  // Hàm để toggle trạng thái Block/Unblock người dùng
  const handleBlockToggle = async (userId) => {
    try {
      const response = await axiosInstance.put(`/admin/block/${userId}`);
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId
              ? { ...user, isBlocked: response.data.user.isBlocked }
              : user
          )
        );
      }
    } catch (err) {
      console.error("Error blocking/unblocking user:", err);
      setError("Có lỗi xảy ra khi thay đổi trạng thái người dùng.");
    }
  };

  // Hiển thị trạng thái tải dữ liệu
  if (isLoading) {
    return <p>Loading users...</p>;
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  return (
    <div className="user-list-container">
      <h2 className="header">Danh sách người dùng</h2>
      {/* Ô tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm người dùng..."
        value={searchUser}
        onChange={handleSearch}
        className="search-input"
      />

      {filteredUsers.length === 0 ? (
        <p className="empty-message">Không có người dùng nào phù hợp</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên Chính</th>
              <th>Username</th>
              <th>Email</th>
              <th>Trạng Thái</th>
              <th>Xác thực</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className={user.isBlocked ? "blocked" : ""}>
                <td>
                  <img
                    src={user.profilePic || "/avatar.jpg"}
                    alt={`${user.username}'s avatar`}
                    className="avatar"
                  />
                </td>
                <td>{user.lastname}</td>
                <td>
                  <div>
                    <span
                      title={`Số bài viết bị báo cáo: ${
                        reportCounts[user._id] || 0
                      }`} // Hiển thị tooltip với số bài viết bị báo cáo khi hover
                    >
                      {user.username}
                    </span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  {user.isBlocked ? (
                    <span className="status blocked">Bị chặn</span>
                  ) : (
                    <span className="status active">Đang hoạt động</span>
                  )}
                </td>
                <td>
                  {user.isVerified ? (
                    <span className="status active">Đã xác thực</span>
                  ) : (
                    <span className="status blocked">Chưa xác thực</span>
                  )}
                </td>
                <td>
                  <button
                    className={`btn ${
                      user.isBlocked ? "btn-unblock" : "btn-block"
                    }`}
                    onClick={() => handleBlockToggle(user._id)}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    className="btn bg-black"
                    onClick={() => deleteUser(user._id, setUsers)}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminList;
