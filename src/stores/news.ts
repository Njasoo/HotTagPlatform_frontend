import { defineStore } from "pinia";

export const useNewsStore = defineStore("news", {
  state: () => ({
    current_platform: "bilibili",
  }),
  persist: true,
});
