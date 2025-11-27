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
      {
        path: "/internation",
        name: "Internation",
        component: () => import("@/components/NewsList.vue"),
      },
      {
        path: "/finance",
        name: "Finance",
        component: () => import("@/components/NewsList.vue"),
      },
      {
        path: "/sports",
        name: "Sports",
        component: () => import("@/components/NewsList.vue"),
      },
      {
        path: "/entertainment",
        name: "Entertainment",
        component: () => import("@/components/NewsList.vue"),
      },
      {
        path: "/culture",
        name: "Culture",
        component: () => import("@/components/NewsList.vue"),
      },
      {
        path: "/gangao",
        name: "Gangao",
        component: () => import("@/components/NewsList.vue"),
      },
      {
        path: "/mainland",
        name: "Mainland",
        component: () => import("@/components/NewsList.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
