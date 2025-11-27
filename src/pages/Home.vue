<template>
  <div class="container mx-auto bg-base-200 min-h-screen">
    <nav
      class="overflow-x-auto px-6 py-4 shadow-sm bg-base-100 flex justify-between items-center whitespace-nowrap"
    >
      <div class="flex items-center">
        <span class="text-3xl font-bold text-accent">Trend</span>
        <div class="flex items-center space-x-5 mx-5 text-lg text-base-content">
          <span
            v-for="item in pages"
            :key="item.name"
            class="hover:text-accent hover:font-bold hover:cursor-pointer"
            :class="
              router.currentRoute.value.path == item.value
                ? 'border-b-5 border-accent font-bold'
                : ''
            "
            @click="selectPageHandle(item.value)"
          >
            {{ item.name }}
          </span>
        </div>
      </div>
      <label class="flex items-center gap-2 cursor-pointer">
        <span class="text-sm">{{
          theme === "dark" ? "深色模式" : "浅色模式"
        }}</span>
        <input
          type="checkbox"
          class="toggle toggle-accent"
          :checked="theme === 'dark'"
          @change="toggleTheme"
        />
      </label>
    </nav>
    <!-- 过滤部分 -->
    <div class="mx-auto w-[95%] mt-3 shadow-sm bg-base-100">
      <div>
        <div class="px-4 pt-4">
          <span class="text-md text-base-content">搜索</span>
          <div class="join ml-4">
            <!-- 输入框 -->
            <input
              type="text"
              v-model="searchText"
              placeholder="请输入搜索内容"
              class="input input-bordered join-item grow"
              @keyup.enter="searchHandle"
            />
            <!-- 按钮 -->
            <button
              class="btn btn-accent text-white join-ite"
              @click="searchHandle"
            >
              搜索
            </button>
          </div>
        </div>
        <div class="px-4">
          <span class="text-md text-base-content">平台</span>
          <select
            v-model="newsStore.current_platform"
            class="select m-4 w-auto"
            name="source"
            id="source"
          >
            <option
              v-for="item in sourceList"
              :key="item?.id"
              :value="item?.value"
            >
              {{ item?.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <router-view v-slot="{ Component }">
      <component
        :is="Component"
        :selectedValue="newsStore.current_platform"
        :sourceList="sourceList"
        :key="$route.fullPath"
      ></component>
    </router-view>
    <div class="mt-3 p-4 container mx-auto text-center">
      © 2025 Jason Wong · Vue 3 · DaisyUI · Django REST Framework · Hugging Face
      Transformers · Jieba · Python WordCloud
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { getSourceList } from "../api/source";
import router from "@/router";
import { useNewsStore } from "@/stores/news";

const newsStore = useNewsStore();
const theme = ref(localStorage.getItem("theme") || "light");
interface Page {
  name: string;
  value: string;
}
const pages: Page[] = [
  { name: "总热榜", value: "/newslist" },
  { name: "词云", value: "/wordcloud" },
  { name: "国际新闻", value: "/internation" },
  { name: "财经新闻", value: "/finance" },
  { name: "文化", value: "/culture" },
  { name: "体育", value: "/sports" },
  { name: "娱乐", value: "/entertainment" },
  { name: "中国大陆", value: "/mainland" },
  { name: "港澳", value: "/gangao" },
];
const searchText = ref<string>("");
const selectedPlatform = ref<string>("哔哩哔哩");
interface SourceItem {
  // 同样的，这个也是写出来给别人看看是什么类型的而已，并没有实际作用
  id: number;
  name: string;
  value: string;
}
const sourceList = ref<SourceItem[]>([]);

const toggleTheme = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  theme.value = checked ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme.value);
  localStorage.setItem("theme", theme.value);
};

// 初次载入同步主题
document.documentElement.setAttribute("data-theme", theme.value);

onMounted(() => {
  getSourceList()
    .then((res) => {
      sourceList.value = res.data;
    })
    .catch((err) => console.error(err));
});

watch(
  () => newsStore.current_platform,
  (newVal: string) => {
    // 这里是直接暴力的，因为数据量比较小，所以用map可能常数还比较大的
    for (const item of sourceList.value) {
      if (item.value == newVal) {
        selectedPlatform.value = item.name;
      }
    }
  }
);

const searchHandle = () => {
  if (newsStore.current_platform == "zhihu") {
    window.open(
      `https://www.zhihu.com/search?type=content&q=${searchText.value}`,
      "_blank"
    );
  } else if (newsStore.current_platform == "weibo") {
    window.open(`https://s.weibo.com/weibo?q=${searchText.value}`, "_blank");
  } else if (newsStore.current_platform == "bilibili") {
    window.open(
      `https://search.bilibili.com/all?keyword=${searchText.value}`,
      "_blank"
    );
  } else if (newsStore.current_platform == "tieba") {
    window.open(
      `https://tieba.baidu.com/f?ie=utf-8&kw=${searchText.value}&fr=search`
    );
  }
};

const selectPageHandle = (path: string) => {
  router.push({ path: path }); //push一个无用参数，使得和当前url相同的路径也能跳转
};
</script>
