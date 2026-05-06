import { createRouter, createWebHashHistory } from 'vue-router'

const Dashboard = () => import('../views/Dashboard.vue')
const EarthView = () => import('../views/EarthView.vue')
const VisualEditor = () => import('../views/VisualEditor.vue')
const InstanceManagement = () => import('../views/topology/InstanceManagement.vue')
const LinkManagement = () => import('../views/topology/LinkManagement.vue')

const routes = [
  { path: '/', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/earth', component: EarthView, meta: { requiresAuth: true } },
  { path: '/editor', component: VisualEditor, meta: { requiresAuth: true } },
  { path: '/instances', component: InstanceManagement, meta: { requiresAuth: true } },
  { path: '/links', component: LinkManagement, meta: { requiresAuth: true } },
  { path: '/topology/instances', redirect: '/instances' },
  { path: '/topology/links', redirect: '/links' },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
