import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAdminStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  users: [], // Mảng lưu danh sách người dùng
  isLoading: false,
  error: null,
  // Đăng ký admin
  registerAdmin: async (formData) => {
    try {
      set({ isSigningUp: true });
      const response = await axiosInstance.post("/admin/register", formData);

      toast.success("Admin registered successfully!");
      set({ authUser: response.data });
      return true;
    } catch (error) {
      console.error(
        "Admin registration failed:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || "Failed to register admin");
      set({ isSigningUp: false });
      return null;
    }
  },
  // Hàm fetchUsers để lấy danh sách người dùng
  // fetchUsers: async () => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     const response = await axiosInstance.get("/admin/getUsers");
  //     console.log("Fetched Users:", response.data); // Log dữ liệu trả về từ API
  //     set({ users: response.data, isLoading: false }); // Lưu danh sách người dùng vào store
  //     console.log("Users updated in Zustand store:", get().users); // Kiểm tra Zustand store
  //   } catch (error) {
  //     console.error("Error fetching users:", error.message);
  //     set({ error: "Failed to fetch users", isLoading: false });
  //   }
  // },
  // Đăng nhập admin
  loginAdmin: async (email, password) => {
    try {
      set({ isLoggingIn: true });
      const response = await axiosInstance.post("/admin/login", {
        email,
        password,
      });
      if (response.data.success) {
        set({ authUser: response.data });
        toast.success("Đăng nhập Admin thành công!");
        return true;
      }
      return false;
    } catch (error) {
      console.error(
        "Admin login failed:",
        error.response?.data?.message || error.message
      );
      toast.error("Đăng nhập Admin thất bại!");
      set({ isLoggingIn: false });
    }
  },

  // Đăng xuất admin
  logoutAdmin: () => {
    set({ admin: null });
    toast.info("Đã đăng xuất Admin!");
  },

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/admin/getUsers");
      console.log("Fetched Users:", response.data); // Log dữ liệu trả về
      set({
        userProfile: response.data,
        following: response.data.following || [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching users:", error.message);
      set({ error: "Failed to fetch users", isLoading: false });
    }
  },
}));
