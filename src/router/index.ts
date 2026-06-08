import { createRouter, createWebHashHistory } from "vue-router";

const EarthView = () => import("../views/EarthView.vue");
const Dashboard = () => import("../views/Dashboard.vue");
const InstanceManagement = () =>
  import("../views/topology/InstanceManagement.vue");
const LinkManagement = () => import("../views/topology/LinkManagement.vue");

const routes = [
  { path: "/", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/earth", component: EarthView, meta: { requiresAuth: true } },
  {
    path: "/instances",
    component: InstanceManagement,
    meta: { requiresAuth: true },
  },
  { path: "/links", component: LinkManagement, meta: { requiresAuth: true } },
  { path: "/topology/instances", redirect: "/instances" },
  { path: "/topology/links", redirect: "/links" },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
