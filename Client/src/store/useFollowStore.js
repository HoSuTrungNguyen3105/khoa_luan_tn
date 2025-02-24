import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useNotificationStore } from "./useNotificationStore";

export const useFollowStore = create((set) => ({
  following: {},
  ads: [],
  setAds: (ads) => set({ ads }),
  addAd: (ad) => set((state) => ({ ads: [...state.ads, ad] })),
  // ads: [],
  // setAds: (ads) => set({ ads }),
  // addAd: (ad) => set((state) => ({ ads: [...state.ads, ad] })),
  // updateAd: (updatedAd) =>
  //   set((state) => ({
  //     ads: state.ads.map((ad) => (ad._id === updatedAd._id ? updatedAd : ad)),
  //   })),
  fetchFollowingStatus: async (currentUserId, targetUserId) => {
    if (!currentUserId || !targetUserId) {
      console.error("Missing parameters: currentUserId or targetUserId");
      return;
    }
    try {
      const res = await axiosInstance.get(
        `/user/${targetUserId}/is-following`,
        {
          params: { currentUserId: currentUserId }, // Đảm bảo `currentUserId` được truyền
        }
      );

      const isFollowing = res.data.isFollowing; // API trả về trạng thái
      set((state) => ({
        following: { ...state.following, [targetUserId]: isFollowing },
      }));

      return isFollowing;
    } catch (error) {
      console.error("Failed to fetch follow status:", error);
      return false; // Nếu lỗi, mặc định là không theo dõi
    }
  },
  setFollowing: (targetUserId, isFollowing) => {
    set((state) => ({
      following: { ...state.following, [targetUserId]: isFollowing },
    }));
  },
  followUser: async (currentUserId, targetUserId) => {
    try {
      const res = await axiosInstance.put(`/user/${targetUserId}/follow`, {
        _id: currentUserId,
      });
      set((state) => ({
        following: { ...state.following, [targetUserId]: true },
      }));
      toast.success(res.data.message || "Followed successfully!");
      useNotificationStore
        .getState()
        .addNotification(`Bạn đã theo dõi ${res.data.username}.`, "success");
      // toast("Bạn sẽ nhận được thông báo từ người này khi họ đăng bài!", {
      //   duration: 3000,
      //   icon: "🔔",
      // });
    } catch (error) {
      console.error("Failed to follow user:", error);

      // Lấy thông báo lỗi từ API, tránh rendering toàn bộ đối tượng lỗi
      const errorMessage =
        error.response?.data?.message || "Failed to follow the user.";
      toast.error(errorMessage); // Hiển thị thông báo lỗi chính xác
    }
  },

  // Function unfollowUser trong Zustand store
  unfollowUser: async (currentUserId, targetUserId) => {
    try {
      const res = await axiosInstance.put(`/user/${targetUserId}/unfollow`, {
        _id: currentUserId,
      });
      set((state) => ({
        following: { ...state.following, [targetUserId]: false },
      }));
      toast.success(res.data.message || "Unfollowed successfully!");
    } catch (error) {
      console.error("Failed to unfollow user:", error);

      // Lấy thông báo lỗi từ API, tránh rendering toàn bộ đối tượng lỗi
      const errorMessage =
        error.response?.data?.message || "Failed to unfollow the user.";
      toast.error(errorMessage); // Hiển thị thông báo lỗi chính xác
    }
  },
}));
