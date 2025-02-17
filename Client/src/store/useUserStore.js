import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  userProfile: [],
  isLoading: false,
  users: [], // Danh sách tất cả người dùng
  loggedInUserId: "", // ID người dùng hiện tại
  loading: false,
  error: null,
  contracts: [], // Danh sách hợp đồng
  setLoggedInUserId: (userId) => set({ loggedInUserId: userId }),
  following: {}, // Key-Value pair: userId -> follow status (true/false)
  userData: null, // User profile data
  loading: true, // Loading state
  products: [], // User products
  productsLoading: true, // Products loading state
  productsError: null, // Error for products
  setUserData: (data) => set({ userData: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setProducts: (products) => set({ products }),
  setProductsLoading: (loading) => set({ productsLoading: loading }),
  setProductsError: (error) => set({ productsError: error }),

  // Fetch user data
  fetchUserData: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/user/profile/user/${userId}`);
      set({ userData: response.data });
    } catch (error) {
      set({ error: "Không thể tải thông tin người dùng." });
    } finally {
      set({ loading: false });
    }
  },

  // API: Follow a user
  followUser: async (currentUserId, userId) => {
    try {
      const res = await axiosInstance.put(`/user/${userId}/follow`, {
        _id: currentUserId,
      });
      set((state) => ({
        following: {
          ...state.following,
          [userId]: true,
        },
      }));
      console.log("Follow success:", res.data);
    } catch (error) {
      console.error("Follow failed:", error);
    }
  },

  // API: Unfollow a user
  unfollowUser: async (currentUserId, userId) => {
    try {
      const res = await axiosInstance.put(`/user/${userId}/unfollow`, {
        _id: currentUserId,
      });
      set((state) => ({
        following: {
          ...state.following,
          [userId]: false,
        },
      }));
      console.log("Unfollow success:", res.data);
    } catch (error) {
      console.error("Unfollow failed:", error);
    }
  },
  fetchUserProducts: async (userId) => {
    set({ productsLoading: true, productsError: null });
    try {
      const response = await axiosInstance.get(`/post/posts/user/${userId}`);
      set({ products: response.data });
    } catch (error) {
      set({ productsError: "Không thể tải sản phẩm của người dùng." });
    } finally {
      set({ productsLoading: false });
    }
  },
  // Lấy thông tin hồ sơ người dùng
  fetchUserProfile: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/user/profile/${userId}`);
      set({
        userProfile: response.data,
        followersCount: response.data.followers.length, // Cập nhật số lượng followers
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      set({ error: "Error fetching user profile", isLoading: false });
    }
  },
  // Lấy danh sách tất cả người dùng
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/message/users");
      set({ users: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching users:", error.message);
      set({ error: "Failed to fetch users", isLoading: false });
    }
  },
  // Lấy danh sách hợp đồng từ API
  fetchContracts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/user/contraction");
      set({ contracts: response.data });
    } catch (error) {
      set({ error: "Không thể tải hợp đồng." });
    } finally {
      set({ loading: false });
    }
  },

  // Cập nhật trạng thái hợp đồng
  updateContractStatus: async (contractId, newStatus) => {
    try {
      const response = await axiosInstance.put(
        `/user/contraction/${contractId}/status`,
        {
          status: newStatus,
        }
      );

      // Cập nhật trạng thái trong danh sách hợp đồng ngay lập tức
      set((state) => ({
        contracts: state.contracts.map((contract) =>
          contract._id === contractId
            ? { ...contract, status: newStatus }
            : contract
        ),
      }));

      toast.success("Cập nhật trạng thái thành công!");
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error("Không thể cập nhật trạng thái.");
    }
  },
}));
