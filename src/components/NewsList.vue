<template>
  <span
    v-if="g_loading"
    class="mx-auto block loading loading-spinner loading-xl mt-3"
  ></span>
  <div v-else>
    <div class="mx-auto w-[95%] mt-3">
      <ul class="list bg-base-100 shadow-sm">
        <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">
          {{ newsStore.current_platform_zh }}今日热榜
        </li>

        <!-- list-row包含flex容器 -->
        <li
          v-if="!loading && newsList.length === 0"
          class="p-4 text-center text-sm opacity-60"
        >
          暂无新闻
        </li>
        <li
          v-else
          v-for="(item, index) in newsList"
          :key="item?.id"
          class="list-row items-center hover:bg-base-300 rounded-none hover:cursor-pointer"
          @click="goToURL(item?.url)"
        >
          <div class="text-4xl font-thin opacity-30 tabular-nums">
            {{ index + (currentPageNumber - 1) * 10 + 1 }}
          </div>
          <div :class="loading ? 'skeleton h-6 w-full' : ''">
            <span class="text-lg" v-show="!loading">{{ item?.title }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="join flex justify-center mt-3">
      <button
        class="text-base-content join-item btn bg-base-100 hover:bg-accent shadow-sm"
        id="prev-btn"
        :disabled="prevPage == null"
        @click="prevPageHandle"
      >
        «
      </button>
      <button class="join-item btn bg-base-100 shadow-sm">
        {{ currentPageNumber }}
      </button>
      <button
        class="text-base-content join-item btn bg-base-100 hover:bg-accent shadow-sm"
        id="next-btn"
        :disabled="nextPage == null"
        @click="nextPageHandle"
      >
        »
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { getHotItems } from "@/api/hotItem";
// import { getSourceList } from "@/api/source";
import request from "@/api/request";
import router from "@/router";
import { useThrottleFn } from "@vueuse/core";
import { useNewsStore } from "@/stores/news";

interface SourceItem {
  // 同样的，这个也是写出来给别人看看是什么类型的而已，并没有实际作用
  id: number;
  name: string;
  value: string;
}
const newsStore = useNewsStore();
const page2category: { path: string; category: string }[] = [
  { path: "/culture", category: "文化" },
  { path: "/internation", category: "国际新闻" },
  { path: "/finance", category: "财经新闻" },
  { path: "/sports", category: "体育" },
  { path: "/entertainment", category: "娱乐" },
  { path: "/gangao", category: "港澳政治" },
  { path: "/mainland", category: "中国大陆政治" },
];
const props = defineProps<{
  selectedValue: string;
  sourceList: SourceItem[];
}>();
const min_loading_time = 250;
const g_loading = ref(true);
const loading = ref(false);
const currentPageNumber = ref(1);
const prevPage = ref("");
const nextPage = ref("");
// const selectedPlatform = ref("哔哩哔哩");
interface NewsItem {
  // 规定出来看的，实际上运行不会做类型检查，直接被覆盖了，不过别人一看代码就知道我这个数组里面要存什么东西
  id: number;
  title: string;
  source: string;
  crawl_time: string;
  url: string;
  rank: number;
  category: string;
}
const tempNewsItem = {
  id: 0,
  title: "",
  source: "",
  crawl_time: "",
  url: "",
  rank: 0,
  category: "",
};
const newsList = ref<NewsItem[]>(
  new Array(10)
    .fill(null as unknown as NewsItem)
    .map(() => ({ ...tempNewsItem }))
);
// const sourceList = ref<SourceItem[]>([]);
let current_category = "";

const setUpNewsList = (res: any) => {
  // 没办法，drf返回的数据太复杂了，只能any了
  newsList.value = res.data.results;
  prevPage.value = res.data.previous;
  nextPage.value = res.data.next;
};

watch(
  () => router.currentRoute.value.path,
  (new_path) => {
    const matched = page2category.find((item) => item.path == new_path);
    if (matched) {
      current_category = matched.category;
    }
  },
  { immediate: true }
);

onMounted(() => {
  const start = Date.now();
  getHotItems(props.selectedValue, current_category)
    .then((res: any) => {
      console.log(res.data.results);
      setUpNewsList(res);
    })
    .finally(async () => {
      const cost = Date.now() - start;
      if (cost < min_loading_time) {
        await new Promise((res) => setTimeout(res, min_loading_time - cost));
      }
      g_loading.value = false;
    })
    .catch((err: any) => console.error(err));
  // getSourceList()
  //   .then((res: any) => {
  //     console.log("source_list:", res.data);
  //     sourceList.value = res.data;
  //   })
  //   .catch((err: any) => console.error(err));
});

watch(
  () => props.selectedValue,
  (newVal: string) => {
    loading.value = true;
    currentPageNumber.value = 1;
    const start = Date.now();
    getHotItems(newVal, current_category)
      .then((res: any) => {
        setUpNewsList(res);
      })
      .finally(async () => {
        const cost = Date.now() - start;
        if (cost < min_loading_time) {
          await new Promise((res) => setTimeout(res, min_loading_time - cost));
        }
        loading.value = false;
      })
      .catch((err: any) => console.error(err));
    // 这里是直接暴力的，因为数据量比较小，所以用map可能常数还比较大的
    for (const item of props.sourceList) {
      if (item.value == newVal) {
        newsStore.current_platform_zh = item.name;
      }
    }
  }
);

const goToURL = (url: string) => {
  window.open(url, "_blank");
};

const prevPageHandle = useThrottleFn(() => {
  if (prevPage.value == "" || prevPage.value == null) {
    return;
  }
  loading.value = true;
  currentPageNumber.value--;
  const start = Date.now();
  request
    .get(prevPage.value)
    .then((res: any) => {
      setUpNewsList(res);
    })
    .finally(async () => {
      const cost = Date.now() - start;
      if (cost < min_loading_time) {
        await new Promise((res) => setTimeout(res, min_loading_time - cost));
      }
      loading.value = false;
    })
    .catch((err: any) => console.error(err));
}, 500);

const nextPageHandle = useThrottleFn(() => {
  if (nextPage.value == null || nextPage.value == "") {
    return;
  }
  loading.value = true;
  const start = Date.now();
  currentPageNumber.value++;
  request
    .get(nextPage.value)
    .then((res: any) => {
      setUpNewsList(res);
    })
    .finally(async () => {
      const cost = Date.now() - start;
      const min_loading_time = 250;
      if (cost < min_loading_time) {
        await new Promise((res) => setTimeout(res, min_loading_time - cost));
      }
      loading.value = false;
    })
    .catch((err: any) => console.error(err));
}, 500);
</script>
