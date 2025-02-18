import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  setAuthUser: (user) => set({ authUser: user }), // Hàm cập nhật authUser
  isSigningUp: false,
  isLoggingIn: false,
  errorMessage: "",
  resetPasswordSuccess: false,
  setIsLoggingIn: (status) => set({ isLoggingIn: status }),
  setErrorMessage: (message) => set({ errorMessage: message }),
  setResetPasswordSuccess: (status) => set({ resetPasswordSuccess: status }),
  registerError: null,
  isUpdatingProfile: false,
  isDeleting: false,
  isCheckingAuth: true,
  onlineUsers: [],
  badge: [],
  isLoading: false, // Trạng thái đang tải
  loading: false, // Trạng thái đang tải
  error: null,
  socket: null,
  users: [], // Danh sách tất cả người dùng
  user: null, // Thông tin người dùng
  setUser: (user) => set({ user }),

  // fetchUsers: async () => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     const response = await axiosInstance.get("/admin/getUsers");
  //     console.log("Fetched Users from API:", response.data); // Kiểm tra dữ liệu trả về từ API
  //     set({ users: response.data || [], isLoading: false }); // Đảm bảo `users` luôn là một mảng
  //     console.log("Users updated in Zustand store:", get().users); // Kiểm tra Zustand store
  //   } catch (error) {
  //     console.error("Error fetching users:", error.message);
  //     set({ error: "Failed to fetch users", isLoading: false });
  //   }
  // },

  toggleBlockUser: async (userId) => {
    try {
      const response = await axiosInstance.put(`/admin/block/${userId}`);
      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId
            ? { ...user, isBlocked: response.data.isBlocked }
            : user
        ),
      }));
    } catch (error) {
      console.error("Error toggling user block:", error.message);
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true, registerError: null });
    try {
      await axiosInstance.post("/auth/register", data);
      get().connectSocket();
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi";
      set({ registerError: errorMessage }); // Lưu thông báo lỗi
      toast.error(errorMessage);
      set({ isSigningUp: false });
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  verifyEmail: async (email, code) => {
    try {
      await axiosInstance.post("/auth/verify-email", {
        email,
        verificationCode: code,
      });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Xác thực thất bại");
      return false;
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data, isLoggingIn: false });
      toast.success("Đăng nhập thành công");
      get().connectSocket();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi";
      set({ registerError: errorMessage }); // Lưu thông báo lỗi
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  fetchDataByRole: async (role) => {
    // Hàm lấy dữ liệu theo vai trò (role)
    const response = await axiosInstance.get(`/auth/data?role=${role}`);
    return response.data;
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Đăng xuất thành công");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  fetchBadges: async () => {
    set({ error: null, loading: true }); // Đặt trạng thái loading khi bắt đầu gọi API
    try {
      const response = await axiosInstance.get("/auth/badges"); // URL API
      set({ badge: response.data, loading: false }); // Cập nhật danh sách badge và tắt loading
    } catch (error) {
      console.error("Lỗi khi tải badges:", error);
      set({ error: error.message, loading: false }); // Cập nhật lỗi nếu có
    }
  },

  // Hàm lấy tên tỉnh thành theo ID
  getBadgesNameById: (id) => {
    return get().badge.find((p) => p.id === id)?.name || "Không có địa điểm";
  },
  deleteAccount: async () => {
    try {
      set({ isDeleting: true });
      const response = await axiosInstance.delete("/auth/delete"); // Delete API
      set({ authUser: null, isLoggingIn: false }); // Clear Zustand state
      toast.success(response.data.message);
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting your account."
      );
    } finally {
      set({ isDeleting: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Cập nhật thông tin cá nhân thành công!");
    } catch (error) {
      // Xử lý lỗi: Kiểm tra xem error có response từ server hay không
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Đã xảy ra lỗi khi cập nhật!";
        console.error("Error in updateProfile:", errorMessage);
        toast.error(errorMessage);
      } else {
        // Xử lý lỗi không có response (lỗi mạng hoặc khác)
        console.error("Error in updateProfile:", error.message);
        toast.error("Không thể kết nối với máy chủ. Vui lòng thử lại sau.");
      }
    } finally {
      // Đảm bảo tắt trạng thái loading trong mọi trường hợp
      set({ isUpdatingProfile: false });
    }
  },

  updateProfileInfo: async (data) => {
    set((state) => ({
      authUser: { ...state.authUser, ...data }, // Cập nhật tạm thời
      isUpdatingProfile: true,
      errorMessage: "",
    }));

    try {
      const response = await axiosInstance.put(
        "/auth/update-profile-info",
        data
      );
      set({ authUser: response.data }); // Ghi đè bằng dữ liệu từ server
      toast.success("Cập nhật thông tin cá nhân thành công!");
    } catch (error) {
      set((state) => ({ authUser: { ...state.authUser, ...data } })); // Rollback nếu lỗi
      // Xử lý lỗi
      set({ isUpdatingProfile: false });

      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Đã xảy ra lỗi khi cập nhật!";
        console.error("Error in updateProfile:", errorMessage);
        toast.error(errorMessage);
      } else {
        // Xử lý lỗi không có response (lỗi mạng hoặc khác)
        console.error("Error in updateProfile:", error.message);
        toast.error("Không thể kết nối với máy chủ. Vui lòng thử lại sau.");
      }
      return false; // Trả về false nếu có lỗi
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(process.env.BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
  setOnlineUsers: (users) => set({ onlineUsers: users }),
}));
