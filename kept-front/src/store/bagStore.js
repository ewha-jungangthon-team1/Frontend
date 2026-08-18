import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBagStore = create(
  persist(
    (set) => ({
      publicToken: null,
      product: null,

      setSelectedBag: (publicToken, product) => set({ publicToken, product }),

      clearSelectedBag: () => set({ publicToken: null, product: null }),
    }),
    {
      name: "kept_selected_bag", // localStorage에 저장될 때 쓰이는 key 이름
    },
  ),
);

export default useBagStore;
