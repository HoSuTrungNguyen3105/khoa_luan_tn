import { create } from "zustand";

export const useAdStore = create((set) => ({
  ads: [],
  isLoading: true,
  error: null,
  formData: {
    ND: "",
    img: "",
  },
  editingAd: null, // Quảng cáo đang được chỉnh sửa

  // Set trạng thái loading
  setLoading: (isLoading) => set({ isLoading }),

  // Set lỗi
  setError: (error) => set({ error }),

  // Cập nhật formData
  setFormData: (newFormData) => set({ formData: newFormData }),

  // Reset formData
  resetFormData: () => set({ formData: { ND: "", img: "" } }),

  // Cập nhật danh sách quảng cáo
  setAds: (newAds) => set({ ads: newAds }),

  // Thêm quảng cáo vào danh sách
  addAd: (newAd) => set((state) => ({ ads: [...state.ads, newAd] })),

  // Chỉnh sửa quảng cáo
  setEditingAd: (ad) => set({ editingAd: ad }),
}));
