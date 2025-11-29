import { defineStore } from "pinia";

export const useNewsStore = defineStore("news", {
  state: () => ({
    current_platform: "bilibili",
    current_platform_zh: "哔哩哔哩",
    current_categories: [
      { category: "文化", text: "文化", checked: true },
      { category: "国际新闻", text: "国际新闻", checked: true },
      { category: "财经新闻", text: "财经新闻", checked: true },
      { category: "体育", text: "体育", checked: true },
      { category: "娱乐", text: "娱乐", checked: true },
      { category: "港澳政治", text: "港澳", checked: true },
      { category: "中国大陆政治", text: "中国大陆", checked: true },
    ],
  }),
  persist: true,
});
