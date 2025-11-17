<template>
  <div class="container mx-auto bg-gray-100 min-h-screen">
    <nav class="px-6 py-4 shadow-sm bg-white">
      <span class="text-3xl font-bold text-blue-500">Trend</span>
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
            class="select m-4 w-[250px]"
            name="source"
            id="source"
          >
            <option
              v-for="item in sourceList"
              :key="item.id"
              :value="item.value"
            >
              {{ item.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <!-- 主要显示部分 -->
    <div class="mx-auto w-[95%] mt-3">
      <ul class="list bg-base-100 shadow-sm">
        <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">
          {{ selectedPlatform }}今日热榜
        </li>

        <!-- list-row包含flex容器 -->
        <li
          v-for="(item, index) in newsList"
          :key="item.id"
          class="list-row items-center hover:bg-gray-100 rounded-none hover:cursor-pointer"
          @click="goToURL(item.url)"
        >
          <div class="text-4xl font-thin opacity-30 tabular-nums">
            {{ index + 1 }}
          </div>
          <div>
            <span class="text-lg">{{ item.title }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { getHotItems } from "../api/hotItem";
import { getSourceList } from "../api/source";

const searchText = ref("");
const selectedValue = ref("bilibili");
const selectedPlatform = ref("哔哩哔哩");
interface NewsItem {
  // 规定出来看的，实际上运行不会做类型检查，直接被覆盖了，不过别人一看代码就知道我这个数组里面要存什么东西
  id: number;
  title: string;
  source: string;
  crawl_time: string;
  url: string;
  rank: number;
}
interface SourceItem {
  // 同样的，这个也是写出来给别人看看是什么类型的而已，并没有实际作用
  id: number;
  name: string;
  value: string;
}
const newsList = ref<NewsItem[]>([]);
const sourceList = ref<SourceItem[]>([]);
onMounted(() => {
  getHotItems(selectedValue.value)
    .then((res) => {
      console.log(res.data);
      newsList.value = res.data;
    })
    .catch((err) => console.error(err));
  getSourceList()
    .then((res) => {
      console.log(res.data);
      sourceList.value = res.data;
    })
    .catch((err) => console.error(err));
});
watch(selectedValue, (newVal: string) => {
  getHotItems(newVal)
    .then((res) => (newsList.value = res.data))
    .catch((err) => console.error(err));
  // 这里是直接暴力的，因为数据量比较小，所以用map可能常数还比较大的
  for (const item of sourceList.value) {
    if (item.value == newVal) {
      selectedPlatform.value = item.name;
    }
  }
});
const goToURL = (url: string) => {
  window.open(url, "_blank");
};
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
</script>
