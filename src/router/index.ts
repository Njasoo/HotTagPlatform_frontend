import { createWebHashHistory, createRouter } from "vue-router";
import Home from "../pages/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    redirect: "/newslist",
    children: [
      {
        path: "newslist",
        name: "NewsList",
        component: () => import("@/components/NewsList.vue"),
      },
      {
        path: "wordcloud",
        name: "WordCloud",
        component: () => import("@/components/WordCloud.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
