import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import axios from "axios";

export const usePostStore = create((set, get) => ({
  posts: [], // Lưu danh sách bài đăng
  post: null, // A single post
  comments: [],
  provinces: [],
  isCreating: false, // Trạng thái đang tạo bài viết
  createPostError: null,
  createPostSuccess: false,
  approvedPosts: [],
  pendingPosts: [],
  isLoading: false, // Trạng thái đang tải
  loading: false,
  error: null, // Lưu thông báo lỗi nếu có
  setComments: (newComments) => set(() => ({ comments: newComments })), // Không mutate trực tiếp
  // Hàm tạo bài đăng
  createPost: async (formData) => {
    try {
      set({ isCreating: true });
      const response = await axiosInstance.post("/post/posts", formData);
      set((state) => ({
        posts: [response.data, ...state.posts], // Thêm bài viết mới vào danh sách
        createPostSuccess: true,
      }));
      toast.success("Bài viết đã được đăng thành công !");
      set({ isCreating: false });
      return response.data; // Trả về bài viết mới tạo
    } catch (error) {
      set({
        isCreating: false,
        createPostSuccess: false,
      });

      // Kiểm tra và hiển thị tất cả lỗi từ backend
      if (error.response?.data?.errors) {
        // Nếu có mảng lỗi từ backend
        error.response.data.errors.forEach((err) => {
          toast.error(err.message || "Lỗi không xác định từ backend");
        });
      } else {
        // Nếu chỉ có một lỗi đơn lẻ
        const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi";
        toast.error(errorMessage);
      }
      return false; // Trả về false nếu có lỗi
    } finally {
      set({ isCreating: false });
    }
  },

  // Reset createPostSuccess sau khi thông báo đã được xử lý
  resetCreatePostSuccess: () => set({ createPostSuccess: false }),
  // Lấy bài viết theo ID
  getPostById: async (id) => {
    set({ isLoading: true, error: null }); // Bắt đầu loading
    try {
      const response = await axiosInstance.get(`/post/detail/${id}`);
      if (response.data.status === "Success") {
        set({ post: response.data.data }); // Cập nhật bài viết vào state
      }
    } catch (error) {
      set({ error: "Error loading post", post: null }); // Nếu có lỗi
    } finally {
      set({ isLoading: false }); // Kết thúc loading
    }
  },
  getPostByIdWithId: async (id) => {
    set({ isLoading: true, error: null }); // Bắt đầu loading
    try {
      const response = await axiosInstance.get(`/post/posts/detail/${id}`);
      if (response.data.status === "Success") {
        set({ post: response.data.data }); // Cập nhật bài viết vào state
      }
    } catch (error) {
      set({ error: "Error loading post", post: null }); // Nếu có lỗi
    } finally {
      set({ isLoading: false }); // Kết thúc loading
    }
  },
  // Phương thức để fetch bài đăng
  fetchPosts: async () => {
    set({ isLoading: true, error: null }); // Bắt đầu tải, đặt error về null
    try {
      const res = await axiosInstance.get("/post/postsId/allItems");
      set({ posts: res.data.data });
    } catch (error) {
      console.error("Error:", error);
      set({ error: "Có lỗi xảy ra khi tải bài đăng" }); // Lưu lỗi
    } finally {
      set({ isLoading: false }); // Kết thúc quá trình tải
    }
  },
  fetchPostSearch: async () => {
    set({ isLoading: true, error: null }); // Bắt đầu tải, đặt error về null
    try {
      const res = await axiosInstance.get("/post/getPostAp");
      set({ posts: res.data.data });
    } catch (error) {
      console.error("Error:", error);
      set({ error: "Có lỗi xảy ra khi tải bài đăng" }); // Lưu lỗi
    } finally {
      set({ isLoading: false }); // Kết thúc quá trình tải
    }
  },
  fetchComments: async (postId) => {
    try {
      const response = await axiosInstance.get(`/post/comments/${postId}`);
      console.log("Fetched comments from API:", response.data); // Kiểm tra API có trả về dữ liệu đúng không
      set({ comments: response.data });
      console.log("Comments in Zustand store:", get().comments); // Kiểm tra Zustand đã cập nhật chưa
    } catch (error) {
      console.error("Lỗi khi tải bình luận:", error);
    }
  },

  addComment: async (postId, userId, content) => {
    set((state) => ({ loading: true }));

    try {
      const response = await axiosInstance.post("/post/comments", {
        postId,
        userId,
        content,
      });

      set((state) => ({
        comments: [response.data.comment, ...state.comments], // Thêm comment mới lên đầu
        loading: false,
      }));

      toast.success("Bình luận đã được thêm!");
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
      toast.error("Không thể gửi bình luận.");
      set({ loading: false });
    }
  },

  deleteComment: async (commentId) => {
    try {
      await axiosInstance.delete(`/post/comments/${commentId}`);
      set((state) => ({
        comments: state.comments.filter((comment) => comment._id !== commentId),
      })); // Cập nhật ngay lập tức trước khi gọi API
      toast.success("Xóa bình luận thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
      toast.error("Không thể xóa bình luận.");
    }
  },
  // Delete post
  deletePost: async (postId) => {
    try {
      await axiosInstance.delete(`/post/user/${postId}`); // API call to delete the post
      // Cập nhật danh sách bài viết bằng cách lọc ra bài bị xóa
      set((state) => ({
        posts: state.posts.filter((post) => post._id !== postId), // Xóa bài khỏi danh sách
      }));
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error; // Rethrow error to handle it in the component
    }
  },
  fetchPendingPosts: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/admin/pendingPost"); // Lấy bài chưa duyệt
      console.log(response.data); // Kiểm tra dữ liệu trả về từ API
      if (response.data) {
        set({ pendingPosts: response.data, isLoading: false });
      } else {
        console.log("No pending posts found.");
      }
    } catch (error) {
      console.error("Error fetching pending posts:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  // Hàm fetch bài viết đã duyệt
  fetchApprovedPosts: async () => {
    set({ isLoading: true, error: null }); // Đặt trạng thái loading
    try {
      const response = await axiosInstance.get("/admin/approvePost");
      set({ approvedPosts: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching approved posts:", error);
      set({ error: "Error fetching approved posts", isLoading: false });
    }
  },
  toggleApproval: async (postId, currentStatus) => {
    try {
      const response = await axiosInstance.put(`/post/approve/${postId}`, {
        isApproved: !currentStatus, // Đảo ngược trạng thái
      });

      // Cập nhật danh sách bài viết trong state sau khi cập nhật thành công
      if (response.status === 200) {
        set((state) => ({
          posts: state.posts.map((post) =>
            post._id === postId ? { ...post, isApproved: !currentStatus } : post
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating post approval status:", error);
    }
  },
  // Hàm lấy dữ liệu tỉnh thành từ API
  fetchProvinces: async () => {
    set({ isLoading: true, error: null }); // Đặt trạng thái loading
    try {
      const response = await axiosInstance.get("/post/provinces"); // URL API
      set({ provinces: response.data, isLoading: false }); // Cập nhật danh sách tỉnh thành
    } catch (error) {
      set({ error: error.message, isLoading: false }); // Xử lý lỗi
    }
  },

  // Hàm lấy tên tỉnh thành theo ID
  getProvinceNameById: (id) => {
    return (
      get().provinces.find((p) => p.id === id)?.name || "Không có địa điểm"
    );
  },
  // Hàm báo cáo bài viết
  reportPost: async (postId, userId) => {
    set({ isLoading: true, error: null }); // Đặt trạng thái loading khi bắt đầu

    try {
      const response = await axiosInstance.post(`/post/report/${postId}`, {
        userId,
      });

      // Xử lý nếu báo cáo thành công
      set({ isLoading: false });
      toast.success(response.data.message); // Hiển thị thông báo thành công
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Có lỗi xảy ra khi báo cáo.",
      });
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi báo cáo."
      ); // Hiển thị thông báo lỗi
      console.error("Report failed:", error);
    }
  },

  // Action to update the post
  updatePost: async (updatedPost) => {
    set({ isLoading: true, error: null });
    try {
      // Use axiosInstance.put() to update the post
      const response = await axiosInstance.put(
        `/post/update/${updatedPost._id}`,
        updatedPost,
        {
          headers: {
            "Content-Type": "application/json", // Optional, but you can include this if needed
          },
        }
      );

      // If the response is successful, update the store
      if (response.status === 200) {
        set((state) => ({
          posts: state.posts.map((post) =>
            post._id === updatedPost._id ? response.data : post
          ),
          post: response.data, // Update the current post
          isLoading: false,
        }));
        toast.success("Bài viết đã được cập nhật thành công!"); // Success message
      } else {
        set({ error: response.data.message, isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error("Có lỗi xảy ra khi cập nhật bài viết.");
    }
  },
}));
