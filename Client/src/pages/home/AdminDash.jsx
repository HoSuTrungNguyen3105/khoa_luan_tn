import React, { useEffect, useState } from "react";
import { usePostStore } from "../../store/usePostStore";
import { useDeletestore } from "../../store/useDeletestore";
import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx"; // Import thư viện XLSX
import HtmlDocx from "html-docx-js/dist/html-docx"; // Import html-docx-js for Word export

const AdminDash = () => {
  const { posts, fetchPosts, toggleApproval, isLoading, error, setPosts } =
    usePostStore();
  const { deletePost } = useDeletestore();
  const [showBulkApprovalMenu, setShowBulkApprovalMenu] = useState(false); // State to show approval menu
  const [selectedPosts, setSelectedPosts] = useState([]); // Array for selected posts
  const [showCheckbox, setShowCheckbox] = useState(false); // State for checkbox visibility
  const [loadingButtons, setLoadingButtons] = useState({
    bulkDelete: false,
    bulkApproval: false,
  });

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  // Export function for Excel
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new(); // Create a new workbook
    const ws = XLSX.utils.json_to_sheet(posts); // Convert posts array to sheet

    XLSX.utils.book_append_sheet(wb, ws, "Posts"); // Append sheet to workbook

    // Generate Excel file and prompt user to download
    XLSX.writeFile(wb, "posts.xlsx");
  };
  // Word export function
  const downloadWord = () => {
    const postsHtml = `
  <html>
    <head><title>Posts</title></head>
    <body>
      <h1>Posts List</h1>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>#</th> <!-- Column for serial number -->
            <th>Title</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${posts
            .map(
              (post, index) => `
                <tr>
                  <td>${index + 1}</td> <!-- Serial number (index + 1) -->
                  <td>${post.desc}</td>
                  <td>${
                    post.isLost
                      ? "Lost"
                      : post.isFound
                      ? "Found"
                      : "Unspecified"
                  }</td>
                  <td>${post.isApproved ? "Blocked" : "Active"}</td>
                </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </body>
  </html>
`;

    const converted = HtmlDocx.asBlob(postsHtml); // Convert HTML to Word document Blob
    const url = URL.createObjectURL(converted); // Create a URL for the Blob
    const link = document.createElement("a"); // Create a link element
    link.href = url; // Set the link href to the Blob URL
    link.download = "post.docx"; // Set the file name
    link.click(); // Trigger the download
  };
  // Handle bulk delete of selected posts
  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) {
      alert("Vui lòng chọn ít nhất một bài viết!");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa các bài viết đã chọn?")) {
      try {
        setLoadingButtons((prev) => ({ ...prev, bulkDelete: true }));
        await Promise.all(
          selectedPosts.map(async (postId) => {
            await deletePost(postId);
          })
        );
        fetchPosts(); // Refresh posts list after deletion
        setSelectedPosts([]); // Clear selected posts list
      } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
      } finally {
        setLoadingButtons((prev) => ({ ...prev, bulkDelete: false }));
      }
    }
  };

  // Handle individual post deletion
  const handleDelete = async (postId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        setLoadingButtons((prev) => ({ ...prev, [postId]: true }));
        await deletePost(postId);
        fetchPosts(); // Refresh posts list after deletion
      } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
      } finally {
        setLoadingButtons((prev) => ({ ...prev, [postId]: false }));
      }
    }
  };

  // Handle checkbox selection for posts
  const handleCheckboxChange = (postId) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  // Handle approval toggling for individual post
  const handleToggleApproval = async (postId, newStatus) => {
    try {
      setLoadingButtons((prev) => ({ ...prev, [postId]: true }));
      await toggleApproval(postId, newStatus);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    } finally {
      setLoadingButtons((prev) => ({ ...prev, [postId]: false }));
    }
  };

  // Handle bulk approval (approve/unapprove) for selected posts
  const handleBulkApproval = async (action) => {
    if (selectedPosts.length === 0) {
      alert("Vui lòng chọn ít nhất một bài viết để thực hiện hành động!");
      return;
    }

    const newStatus = action === "approve";

    if (
      window.confirm(
        `Bạn có chắc chắn muốn ${
          newStatus ? "bỏ chặn" : "chặn"
        } các bài viết đã chọn?`
      )
    ) {
      try {
        setLoadingButtons((prev) => ({ ...prev, bulkApproval: true }));

        await Promise.all(
          selectedPosts.map(async (postId) => {
            const post = posts.find((post) => post._id === postId);
            if (post) {
              await handleToggleApproval(postId, newStatus); // Perform approval/unapproval
            }
          })
        );

        fetchPosts(); // Refresh posts list after bulk action
        setSelectedPosts([]); // Clear selected posts list
      } catch (error) {
        console.error("Lỗi khi chặn/bỏ chặn bài viết:", error);
      } finally {
        setLoadingButtons((prev) => ({ ...prev, bulkApproval: false }));
        setShowBulkApprovalMenu(false); // Close the menu after completion
      }
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

      {/* Toggle between checkbox and number view */}
      <div className="mb-4 flex justify-start space-x-4">
        <button
          onClick={() => setShowCheckbox((prev) => !prev)}
          className="btn btn-info py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {showCheckbox ? "Hiển thị số thứ tự" : "Hiển thị checkbox"}
        </button>
        {/* Export buttons */}
        <button
          onClick={downloadWord} // Call the function to export posts to Word
          className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Xuất ra Word
        </button>
        <button
          onClick={exportToExcel} // Gọi hàm xuất Excel khi nhấn nút
          className="btn btn-primary bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Xuất ra Excel
        </button>
      </div>

      {/* Bulk action buttons */}
      {selectedPosts.length > 0 && (
        <div className="mb-4 flex justify-start space-x-4">
          <button
            onClick={handleBulkDelete}
            className="btn btn-danger py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:bg-red-300 disabled:cursor-not-allowed"
            disabled={loadingButtons.bulkDelete}
          >
            {loadingButtons.bulkDelete ? "Đang xóa..." : "Xóa"}
          </button>

          <button
            onClick={() => setShowBulkApprovalMenu((prev) => !prev)}
            className="btn btn-warning px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:bg-yellow-300 disabled:cursor-not-allowed"
            disabled={loadingButtons.bulkApproval}
          >
            {loadingButtons.bulkApproval
              ? "Đang thực hiện..."
              : "Chặn / Bỏ chặn"}
          </button>
        </div>
      )}

      {/* Bulk approval menu */}
      {showBulkApprovalMenu && (
        <div className="absolute bg-white shadow-lg rounded-lg mt-2 py-2 w-40">
          <button
            onClick={() => handleBulkApproval("unapprove")}
            className="block w-full text-left px-4 py-2 text-yellow-600 hover:bg-yellow-200"
          >
            Chặn các bài viết đã chọn
          </button>
          <button
            onClick={() => handleBulkApproval("approve")}
            className="block w-full text-left px-4 py-2 text-green-600 hover:bg-green-200"
          >
            Bỏ chặn các bài viết đã chọn
          </button>
        </div>
      )}

      {/* Table displaying posts */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table
          className="table table-zebra w-full border-collapse"
          style={{ tableLayout: "fixed" }}
        >
          <thead className="bg-gray-200">
            <tr>
              <th>
                {showCheckbox ? (
                  <input
                    type="checkbox"
                    checked={selectedPosts.length === posts.length}
                    onChange={() => {
                      if (selectedPosts.length === posts.length) {
                        setSelectedPosts([]);
                      } else {
                        setSelectedPosts(posts.map((post) => post._id));
                      }
                    }}
                  />
                ) : (
                  "STT"
                )}
              </th>
              <th>Tiêu đề</th>
              <th>Loại</th>
              <th>Trạng thái</th>
              <th>Quản lý</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={post._id} className="hover:bg-gray-100">
                <td className="text-center">
                  {showCheckbox ? (
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post._id)}
                      onChange={() => handleCheckboxChange(post._id)}
                    />
                  ) : (
                    index + 1
                  )}
                </td>
                <td className="text-center truncate">
                  <Link to={`/admin-dashboard/admin-post/${post._id}`}>
                    {post.desc}
                  </Link>
                </td>
                <td className="text-center truncate">
                  {post.isLost
                    ? "Đồ bị mất"
                    : post.isFound
                    ? "Đã tìm được đồ"
                    : "Chưa xác định"}
                </td>
                <td className="text-center truncate">
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
                <td className="text-center flex justify-center items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleApproval(post._id, post.isApproved);
                    }}
                    className={`btn btn-sm ${
                      post.isApproved ? "btn-danger" : "btn-success"
                    }`}
                    disabled={loadingButtons[post._id]}
                  >
                    {post.isApproved ? "Bỏ chặn" : "Chặn"}
                  </button>
                </td>
                <td className="text-center justify-center items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(post._id);
                    }}
                    className="text-red-950"
                    disabled={loadingButtons[post._id]}
                  >
                    {loadingButtons[post._id] ? "..." : <FaTrashAlt />}
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
