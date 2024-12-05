import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useSearchStore = create((set) => ({
  query: "", // Câu truy vấn tìm kiếm
  results: [], // Kết quả tìm kiếm
  setQuery: (query) => set({ query }), // Cập nhật câu truy vấn
  searchPosts: async () => {
    try {
      const { query } = useSearchStore.getState(); // Lấy câu query từ trạng thái hiện tại
      const response = await axiosInstance.get(`/post/search`, {
        params: { q: query }, // Truyền tham số query vào API
      });
      set({ results: response.data.posts }); // Lưu kết quả vào trạng thái
    } catch (error) {
      console.error("Error searching posts:", error);
    }
  },
}));
