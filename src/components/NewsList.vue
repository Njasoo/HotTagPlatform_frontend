<template>
  <span
    v-if="g_loading"
    class="mx-auto block loading loading-spinner loading-xl mt-3"
  ></span>
  <div v-else>
    <div
      class="flex mx-auto space-x-5 bg-base-100 p-4 mt-3 shadow-sm w-[95%] overflow-x-auto flex-nowrap items-center"
    >
      <div
        v-for="item in newsStore.current_categories"
        :key="item.text"
        class="flex flex-row items-center shrink-0 space-x-1"
      >
        <span class="text-sm mx-1">{{ item?.text }}</span>
        <input
          type="checkbox"
          class="checkbox checkbox-sm"
          v-model="item.checked"
        />
      </div>
    </div>
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
      <button
        class="join-item btn shadow-sm"
        v-for="item in page_list"
        :key="item"
        :class="currentPageNumber == item ? 'bg-accent' : 'bg-base-100'"
        @click="pageJumpHandle(item)"
      >
        {{ item }}
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
import { useDebounceFn } from "@vueuse/core";
import { useNewsStore } from "@/stores/news";

interface SourceItem {
  // 同样的，这个也是写出来给别人看看是什么类型的而已，并没有实际作用
  id: number;
  name: string;
  value: string;
}
const page_size = 10;
const page_list = ref<number[]>([]);
const newsStore = useNewsStore();
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
let total_pages = 0;
const source2zh: { key: string; value: string }[] = [
  { key: "weibo", value: "微博" },
  { key: "tieba", value: "贴吧" },
  { key: "bilibili", value: "哔哩哔哩" },
  { key: "zhihu", value: "知乎" },
];
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

const initializeNewsList = () => {
  newsList.value = new Array(10)
    .fill(null as unknown as NewsItem)
    .map(() => ({ ...tempNewsItem }));
};
// const sourceList = ref<SourceItem[]>([]);
let current_categories: string[] = [];

const setUpNewsList = (res: any) => {
  // 没办法，drf返回的数据太复杂了，只能any了
  newsList.value = res.data.results;
  prevPage.value = res.data.previous;
  nextPage.value = res.data.next;
  console.log("当前页码:", currentPageNumber.value);
  console.log("prevPage:", prevPage.value);
  console.log("nextPage:", nextPage);
};

const fetchNews = useDebounceFn((page_number: number = 1) => {
  const arr = newsStore.current_categories;
  currentPageNumber.value = page_number;
  current_categories = [];
  for (const item of arr) {
    if (item.checked) {
      current_categories.push(item.category);
    }
  }
  const start = Date.now();
  loading.value = true;
  initializeNewsList();
  getHotItems(newsStore.current_platform, current_categories, page_number)
    .then((res: any) => {
      console.log(res.data.results);
      const count = res.data.count;
      total_pages = Math.ceil(count / page_size);
      page_list.value = [];
      for (let i = 1; i <= total_pages; i++) {
        page_list.value.push(i);
      }
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
  console.log("current_categories:", current_categories);
}, 300);

watch(
  () => newsStore.current_categories,
  () => {
    fetchNews();
  },
  { deep: true }
);

onMounted(async () => {
  g_loading.value = true;
  await fetchNews(1);
  g_loading.value = false;
});

const changePlatform = (key: string) => {
  for (const item of source2zh) {
    if (item.key == key) {
      newsStore.current_platform_zh = item.value;
    }
  }
};

watch(
  () => props.selectedValue,
  (newVal: string) => {
    console.log("now_平台:", newVal);
    changePlatform(newVal);
    fetchNews();
  }
);

const goToURL = (url: string) => {
  window.open(url, "_blank");
};

const prevPageHandle = () => {
  if (prevPage.value == "" || prevPage.value == null) {
    return;
  }
  if (currentPageNumber.value > 1) {
    currentPageNumber.value--;
  }
};

const nextPageHandle = () => {
  if (nextPage.value == null || nextPage.value == "") {
    return;
  }
  if (currentPageNumber.value < total_pages) {
    currentPageNumber.value++;
  }
};

watch(
  currentPageNumber,
  (page_number: number) => {
    initializeNewsList();
    fetchNews(page_number);
  },
  { immediate: true }
);

const pageJumpHandle = (page_number: number) => {
  currentPageNumber.value = page_number;
};
</script>
