<template>
  <div class="mt-3 bg-white w-[95%] container mx-auto shadow-sm p-4">
    <img class="mx-auto w-150 h-150" :src="imageUrl" alt="" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { get_wordcloud_url } from "@/api/wordcloud";

const props = defineProps<{
  selectedValue: string;
}>();
const imageUrl = ref<string>("");

onMounted(() => {
  get_wordcloud_url(props.selectedValue)
    .then((res: any) => {
      console.log("wordcloud res:", res.data);
      imageUrl.value = res.data.url;
    })
    .catch((err: any) => console.error(err));
});

watch(
  () => props.selectedValue,
  (newVal: string) => {
    get_wordcloud_url(newVal)
      .then((res: any) => {
        console.log("wordcloud res:", res.data);
        imageUrl.value = res.data.url;
      })
      .catch((err: any) => console.error(err));
  }
);
</script>
