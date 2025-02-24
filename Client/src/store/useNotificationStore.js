import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  notifications: [],

  addNotification: (message, type = "info") => {
    const id = Date.now();
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id, message, type, timestamp: new Date() },
      ],
    }));

    // Xóa thông báo sau 10 giây
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((notif) => notif.id !== id),
      }));
    }, 10000);
  },
}));
