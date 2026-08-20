import { create } from "zustand";
import { persist } from "zustand/middleware";

// ⚠️ 테스트용 임시 토큰 (실제 Bag 선택 플로우가 붙기 전까지 임시로 사용)
// bagStore.publicToken이 아직 없을 때(가방을 선택한 적이 없을 때) 이 값으로 폴백한다
export const TEMP_PUBLIC_TOKEN = "11111111-1111-1111-1111-111111111111";

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
