import { defineStore } from "pinia";

export const useNewsStore = defineStore("news", {
  state: () => ({
    current_platform: "bilibili",
    current_platform_zh: "哔哩哔哩",
  }),
  persist: true,
});
