<template>
  <div class="container mx-auto bg-gray-100 min-h-screen">
    <nav class="px-6 py-4 shadow-sm bg-white flex">
      <span class="text-3xl font-bold text-blue-500">Trend</span>
      <div class="flex items-center space-x-5 mx-5 text-lg text-gray-700">
        <span
          v-for="item in pages"
          :key="item.name"
          class="hover:text-black hover:font-bold hover:cursor-pointer"
          :class="
            router.currentRoute.value.path == item.value
              ? 'border-b-5 border-blue-500 text-black font-bold'
              : ''
          "
          @click="selectPageHandle(item.value)"
        >
          {{ item.name }}
        </span>
      </div>
    </nav>
    <!-- 过滤部分 -->
    <div class="mx-auto w-[95%] mt-3 shadow-sm bg-white">
      <div>
        <div class="px-4 pt-4">
          <span class="text-md text-gray-500">搜索</span>
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
              class="btn btn-info text-white join-ite"
              @click="searchHandle"
            >
              搜索
            </button>
          </div>
        </div>
        <div class="px-4">
          <span class="text-md text-gray-500">平台</span>
          <select
            v-model="selectedValue"
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
      <component :is="Component" :selectedValue="selectedValue"></component>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { getSourceList } from "../api/source";
import router from "@/router";

interface Page {
  name: string;
  value: string;
}
const pages: Page[] = [
  { name: "首页", value: "/newsList" },
  { name: "词云", value: "/wordcloud" },
];
const selectedPage = ref<string>("newsList");
const searchText = ref<string>("");
const selectedValue = ref<string>("bilibili");
const selectedPlatform = ref<string>("哔哩哔哩");
interface SourceItem {
  // 同样的，这个也是写出来给别人看看是什么类型的而已，并没有实际作用
  id: number;
  name: string;
  value: string;
}
const sourceList = ref<SourceItem[]>([]);

onMounted(() => {
  getSourceList()
    .then((res) => (sourceList.value = res.data))
    .catch((err) => console.error(err));
});

watch(selectedValue, (newVal: string) => {
  // 这里是直接暴力的，因为数据量比较小，所以用map可能常数还比较大的
  for (const item of sourceList.value) {
    if (item.value == newVal) {
      selectedPlatform.value = item.name;
    }
  }
});

const searchHandle = () => {
  if (selectedValue.value == "zhihu") {
    window.open(
      `https://www.zhihu.com/search?type=content&q=${searchText.value}`,
      "_blank"
    );
  } else if (selectedValue.value == "weibo") {
    window.open(`https://s.weibo.com/weibo?q=${searchText.value}`, "_blank");
  } else if (selectedValue.value == "bilibili") {
    window.open(
      `https://search.bilibili.com/all?keyword=${searchText.value}`,
      "_blank"
    );
  }
};

const selectPageHandle = (path: string) => {
  selectedPage.value = path;
  router.push(path);
};
</script>
