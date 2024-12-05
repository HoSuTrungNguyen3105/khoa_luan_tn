import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useUserStore = create((set, get) => ({
  userProfile: [],
  isLoading: false,
  users: [], // Danh sách tất cả người dùng
  loggedInUserId: "", // ID người dùng hiện tại
  error: null, // Trạng thái lỗi
  // userProfile: {},
  setLoggedInUserId: (userId) => set({ loggedInUserId: userId }),

  // isFollowing: (targetUserId) => {
  //   return get().following.includes(targetUserId);
  // },

  // followUser: (currentUserId, targetUserId) => {
  //   set((state) => ({
  //     following: {
  //       ...state.following,
  //       [targetUserId]: true, // Mark the target user as followed
  //     },
  //   }));
  // },
  // unfollowUser: (currentUserId, targetUserId) => {
  //   set((state) => ({
  //     following: {
  //       ...state.following,
  //       [targetUserId]: false, // Mark the target user as unfollowed
  //     },
  //   }));
  // },
  // Theo dõi user
  // followUser: async (currentUserId, targetUserId) => {
  //   try {
  //     await axiosInstance.post(`/user/${targetUserId}/follow`, {
  //       userId: currentUserId,
  //     });
  //     set((state) => ({
  //       following: [...state.following, targetUserId],
  //     }));
  //   } catch (error) {
  //     console.error(
  //       "Error following user:",
  //       error.response?.data || error.message
  //     );
  //   }
  // },

  // // Hủy theo dõi user
  // unfollowUser: async (currentUserId, targetUserId) => {
  //   try {
  //     await axiosInstance.post(`/user/${targetUserId}/unfollow`, {
  //       userId: currentUserId,
  //     });
  //     set((state) => ({
  //       following: state.following.filter((id) => id !== targetUserId),
  //     }));
  //   } catch (error) {
  //     console.error(
  //       "Error unfollowing user:",
  //       error.response?.data || error.message
  //     );
  //   }
  // },
  following: {}, // Key-Value pair: userId -> follow status (true/false)

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
}));
