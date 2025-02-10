// Posts.js
import React, { useState, useEffect } from "react";
import "./Posts.css";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import { usePostStore } from "../../store/usePostStore";
import { useAuthStore } from "../../store/useAuthStore";

const Posts = () => {
  const { posts, isLoading, fetchPosts, createPostSuccess } = usePostStore();
  const { authUser } = useAuthStore();
  const currentUserId = authUser?._id;

  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const postsPerPage = 10; // Số sản phẩm mỗi trang
  useEffect(() => {
    fetchPosts(); // Lấy danh sách bài viết khi component mount
  }, [fetchPosts]);

  useEffect(() => {
    if (createPostSuccess) {
      // Cuộn lên đầu trang khi có bài viết mới
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [createPostSuccess]); // Chỉ chạy khi createPostSuccess thay đổi
  // Tính toán bài viết hiển thị trên trang hiện tại
  const approvedPosts = posts.filter((post) => !post.isApproved && post.userId);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = approvedPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Tính tổng số trang
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Tạo danh sách các số trang
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  // Lọc danh sách bài viết đã duyệt

  return (
    <div className="Posts">
      {isLoading && <Loader />}
      <div>
        {currentPosts.map((item, i) => (
          <Post
            key={i}
            data={item}
            currentUserId={currentUserId}
            authUserId={authUser._id}
          />
        ))}
        {approvedPosts.length === 0 && !isLoading && (
          <p>Hiện không có bài đăng nào được phê duyệt.</p>
        )}
        {/* Pagination Container */}
        <div className="pagination-container fixed bottom-0 left-0 w-full bg-white py-4 shadow-md z-50">
          <div className="pagination flex justify-center">
            <button
              className="bg-gray-500 text-white py-2 px-4 mx-2 rounded"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Trang trước
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                className={`py-2 px-4 mx-1 rounded ${
                  currentPage === number
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </button>
            ))}
            <button
              className="bg-blue-500 text-white py-2 px-4 mx-2 rounded"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
