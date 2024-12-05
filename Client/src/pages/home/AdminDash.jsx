import React, { useEffect } from "react";
import { usePostStore } from "../../store/usePostStore";
import { useDeletestore } from "../../store/useDeletestore";
import { FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa"; // Thêm icon

const AdminDash = () => {
  const { posts, fetchPosts, toggleApproval, isLoading, error } =
    usePostStore();
  const { deletePost } = useDeletestore();

  // Lấy danh sách bài viết khi component được render
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Xử lý xóa bài viết và làm mới danh sách
  const handleDelete = async (postId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      await deletePost(postId); // Xóa bài viết
      fetchPosts(); // Làm mới danh sách bài viết sau khi xóa
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Nút load lại danh sách */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Quản lý bài đăng</h2>
        <button
          onClick={fetchPosts}
          className={`btn ${isLoading ? "btn-disabled" : "btn-primary"}`}
          disabled={isLoading}
        >
          {isLoading ? "Đang tải lại..." : "Tải lại danh sách"}
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table
          className="table table-zebra w-full border-collapse"
          style={{ tableLayout: "fixed" }}
        >
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left min-w-[50px]">#</th>
              <th className="px-4 py-2 text-left min-w-[150px]">Tiêu đề</th>
              <th className="px-4 py-2 text-left min-w-[150px]">Loại</th>
              <th className="px-4 py-2 text-left min-w-[120px]">Trạng thái</th>
              <th className="px-4 py-2 text-left min-w-[150px]">
                Số lượng báo cáo
              </th>{" "}
              {/* Thêm cột này */}
              <th className="px-4 py-2 text-left min-w-[100px]">Quản lý</th>
              <th className="px-4 py-2 text-left min-w-[100px]">Xóa</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={post._id} className="hover:bg-gray-100">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 truncate">{post.desc}</td>
                <td className="px-4 py-2">
                  {post.isLost
                    ? "Đồ bị mất"
                    : post.isFound
                    ? "Đã tìm được đồ"
                    : "Chưa xác định"}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${
                      post.isApproved
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {post.isApproved ? "Đã chặn" : "Đang được đăng"}
                  </span>
                </td>
                <td className="px-4 py-2">{post.reportsCount || 0}</td>{" "}
                {/* Hiển thị số lượng báo cáo */}
                <td className="px-4 py-2">
                  <button
                    onClick={() => toggleApproval(post._id, post.isApproved)}
                    className={`btn btn-sm ${
                      post.isApproved ? "btn-danger" : "btn-success"
                    }`}
                  >
                    {post.isApproved ? <FaTimes /> : <FaCheck />}
                  </button>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="btn btn-sm btn-error text-white"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDash;
