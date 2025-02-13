import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAdminStore = create((set, get) => ({
  users: [],
  isCheckingAuth: true,
  isLoading: false,
  error: null,
  deleteUser: async (id, setUsers) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa user này?")) return;

    try {
      await axiosInstance.delete(`/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Nếu có xác thực
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));

      alert("Xóa user thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa user:", error);
      toast.error("Lỗi khi xóa người dùng!");
    }
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
  fetchAdmins: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/admin/getAdmins");
      console.log("Fetched Admins:", response.data); // Log dữ liệu trả về
      set({
        AdminProfile: response.data,
        following: response.data.following || [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching users:", error.message);
      set({ error: "Failed to fetch users", isLoading: false });
    }
  },
}));
