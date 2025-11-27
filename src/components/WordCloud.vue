<template>
  <span
    v-if="loading"
    class="mx-auto block loading loading-spinner loading-xl mt-3"
  ></span>
  <div v-else class="mt-3 bg-base-100 w-[95%] container mx-auto shadow-sm p-4">
    <div class="text-xs opacity-60 tracking-wide">
      {{ newsStore.current_platform_zh }}今日词云
    </div>
    <img class="mx-auto w-150 h-150" :src="imageUrl" alt="" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { get_wordcloud_url } from "@/api/wordcloud";
import { useNewsStore } from "@/stores/news";

const newsStore = useNewsStore();
const imageUrl = ref<string>("");
const loading = ref<boolean>(true);
const min_loading_time = 250;
interface SourceItem {
  // 同样的，这个也是写出来给别人看看是什么类型的而已，并没有实际作用
  id: number;
  name: string;
  value: string;
}
const props = defineProps<{
  selectedValue: string;
  sourceList: SourceItem[];
}>();

onMounted(() => {
  const start = Date.now();
  get_wordcloud_url(props.selectedValue)
    .then((res: any) => {
      console.log("wordcloud res:", res.data);
      imageUrl.value = res.data.url;
    })
    .finally(async () => {
      const cost = Date.now() - start;
      if (cost < min_loading_time) {
        await new Promise((res) => setTimeout(res, min_loading_time - cost));
      }
      loading.value = false;
    })
    .catch((err: any) => console.error(err));
});

watch(
  () => props.selectedValue,
  (newVal: string) => {
    loading.value = true;
    const start = Date.now();
    get_wordcloud_url(newVal)
      .then((res: any) => {
        console.log("wordcloud res:", res.data);
        imageUrl.value = res.data.url;
      })
      .finally(async () => {
        const cost = Date.now() - start;
        if (cost < min_loading_time) {
          await new Promise((res) => setTimeout(res, min_loading_time - cost));
        }
        loading.value = false;
      })
      .catch((err: any) => console.error(err));
    for (const item of props.sourceList) {
      if (item.value == newVal) {
        newsStore.current_platform_zh = item.name;
      }
    }
  }
);
</script>
