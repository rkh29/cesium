<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import {
  Fold,
  Grid,
  Link,
  Monitor,
  Odometer,
  Operation,
  Position,
  Setting,
  User
} from '@element-plus/icons-vue'
import { useAuthStore } from './stores/auth'
import logoUrl from './assets/logo.svg'

interface NavChild {
  path?: string
  label: string
  icon?: any
}

interface NavGroup {
  id: string
  label: string
  icon: any
  children: NavChild[]
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const collapsed = ref(false)
const isDark = ref(true)
const loginVisible = ref(false)
const loginForm = ref({ username: 'admin', password: 'admin' })

const groups: NavGroup[] = [
  {
    id: 'overview',
    label: '总览',
    icon: Monitor,
    children: [
      { path: '/', label: '仪表盘', icon: Odometer },
      { path: '/earth', label: '卫星群视图', icon: Position },
      { path: '/editor', label: '卫星可视编辑', icon: Operation }
    ]
  },
  {
    id: 'topology',
    label: '节点与链路',
    icon: Grid,
    children: [
      { path: '/instances', label: '节点实例', icon: Grid },
      { path: '/links', label: '链路拓扑', icon: Link }
    ]
  }
]

onMounted(() => {
  authStore.loadAuth()
  if (!authStore.isAuthenticated) {
    loginVisible.value = true
  }
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || savedTheme === null) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }
})

function toggleTheme() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

async function handleLogin() {
  const success = await authStore.login(loginForm.value.username, loginForm.value.password)
  if (success) {
    loginVisible.value = false
    if (route.path === '/login') {
      router.push('/')
    }
  }
}

function handleLogout() {
  authStore.logout()
  loginVisible.value = true
}

function handleNav(path: string | undefined) {
  if (path) {
    router.push(path)
  }
}

function isActive(path: string | undefined) {
  return path && route.path === path
}

const currentTitle = computed(() => {
  for (const group of groups) {
    const match = group.children.find((child) => child.path === route.path)
    if (match) return match.label
  }
  return '仪表盘'
})
</script>

<template>
  <div class="vscode-layout" :class="{ 'is-dark': isDark }">
    <aside class="sidebar" :class="{ collapsed }">
      <div class="sidebar-header">
        <img :src="logoUrl" alt="logo" class="logo" />
        <span v-if="!collapsed" class="title">天马星通控制台</span>
        <el-icon class="collapse-btn" @click="collapsed = !collapsed">
          <Fold />
        </el-icon>
      </div>

      <div class="sidebar-menu">
        <div v-for="group in groups" :key="group.id" class="menu-group">
          <div v-if="!collapsed" class="group-title">{{ group.label }}</div>
          <div
            v-for="child in group.children"
            :key="child.path"
            class="menu-item"
            :class="{ active: isActive(child.path) }"
            :title="collapsed ? child.label : ''"
            @click="handleNav(child.path)"
          >
            <el-icon><component :is="child.icon" /></el-icon>
            <span v-if="!collapsed">{{ child.label }}</span>
          </div>
        </div>
      </div>

      <div class="sidebar-footer">
        <div
          class="menu-item"
          :title="isDark ? '切换为浅色模式' : '切换为深色模式'"
          @click="toggleTheme"
        >
          <el-icon><Setting /></el-icon>
          <span v-if="!collapsed">{{ isDark ? '浅色模式' : '深色模式' }}</span>
        </div>
        <div
          class="menu-item"
          :title="authStore.isAuthenticated ? '退出登录' : '登录'"
          @click="authStore.isAuthenticated ? handleLogout() : (loginVisible = true)"
        >
          <el-icon><User /></el-icon>
          <span v-if="!collapsed" class="truncate">
            {{ authStore.isAuthenticated ? (authStore.user?.username || '退出') : '登录' }}
          </span>
        </div>
      </div>
    </aside>

    <main class="editor-area">
      <header class="editor-header">
        <div class="breadcrumbs">
          <span class="view-title">{{ currentTitle }}</span>
        </div>
      </header>
      <div class="editor-content">
        <RouterView />
      </div>
    </main>

    <el-dialog
      v-model="loginVisible"
      title="系统登录"
      width="380px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
      class="login-dialog"
    >
      <el-form label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-button type="primary" class="w-full mt-4" style="width: 100%" @click="handleLogin">
          登录进入系统
        </el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<style>
:root {
  --vscode-bg: #f7f8f8;
  --vscode-sidebar-bg: #ffffff;
  --vscode-border: #e6e6e6;
  --vscode-text: #1d2129;
  --vscode-text-muted: #5a5f68;
  --vscode-hover: rgba(0, 0, 0, 0.03);
  --vscode-active: rgba(0, 0, 0, 0.06);
  --vscode-primary: #5e6ad2;
  --vscode-primary-hover: #7170ff;
  --vscode-shadow: rgba(0, 0, 0, 0.04);
  --vscode-header-bg: #ffffff;
  --el-color-primary: #5e6ad2;
  --el-bg-color: #f7f8f8;
  --el-bg-color-overlay: #ffffff;
  --el-text-color-primary: #1d2129;
  --el-text-color-regular: #5a5f68;
  --el-border-color: #e2e4e7;
  --el-border-color-light: #e2e4e7;
  --el-border-color-lighter: #f0f0f0;
  --el-border-radius-base: 6px;
}

html.dark {
  --vscode-bg: #08090a;
  --vscode-sidebar-bg: #0f1011;
  --vscode-border: rgba(255, 255, 255, 0.06);
  --vscode-text: #f7f8f8;
  --vscode-text-muted: #8a8f98;
  --vscode-hover: rgba(255, 255, 255, 0.04);
  --vscode-active: rgba(255, 255, 255, 0.06);
  --vscode-primary: #5e6ad2;
  --vscode-primary-hover: #828fff;
  --vscode-shadow: rgba(0, 0, 0, 0.4);
  --vscode-header-bg: #0f1011;
  --el-color-primary: #5e6ad2;
  --el-bg-color: #08090a;
  --el-bg-color-overlay: #191a1b;
  --el-text-color-primary: #f7f8f8;
  --el-text-color-regular: #d0d6e0;
  --el-border-color: rgba(255, 255, 255, 0.06);
  --el-border-color-light: rgba(255, 255, 255, 0.08);
  --el-border-color-lighter: rgba(255, 255, 255, 0.04);
}

html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', Roboto, sans-serif;
  background-color: var(--vscode-bg);
  color: var(--vscode-text);
  overflow: hidden;
}

* {
  box-sizing: border-box;
}

.vscode-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: var(--vscode-bg);
  color: var(--vscode-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.sidebar {
  width: 250px;
  background-color: var(--vscode-sidebar-bg);
  border-right: 1px solid var(--vscode-border);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease, border-color 0.3s ease;
  flex-shrink: 0;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--vscode-border);
  transition: border-color 0.3s ease;
}

.sidebar.collapsed .sidebar-header {
  padding: 0;
  justify-content: center;
}

.logo {
  width: 28px;
  height: 28px;
  margin-right: 12px;
}

.sidebar.collapsed .logo {
  margin-right: 0;
  display: none;
}

.title {
  font-weight: 600;
  font-size: 15px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.165px;
}

.collapse-btn {
  cursor: pointer;
  color: var(--vscode-text-muted);
  font-size: 18px;
  transition: color 0.2s;
}

.collapse-btn:hover {
  color: var(--vscode-text);
}

.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.menu-group {
  margin-bottom: 20px;
}

.group-title {
  padding: 0 20px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vscode-text-muted);
  text-transform: uppercase;
  margin-bottom: 8px;
  letter-spacing: 0.04em;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  color: var(--vscode-text-muted);
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
  border-left: 3px solid transparent;
}

.sidebar.collapsed .menu-item {
  justify-content: center;
  padding: 14px 0;
  border-left: none;
}

.menu-item:hover {
  background-color: var(--vscode-hover);
  color: var(--vscode-text);
}

.menu-item.active {
  background-color: var(--vscode-active);
  color: var(--vscode-primary);
  border-left-color: var(--vscode-primary);
}

.sidebar.collapsed .menu-item.active {
  border-left: none;
}

.menu-item .el-icon {
  font-size: 18px;
  margin-right: 12px;
}

.sidebar.collapsed .menu-item .el-icon {
  margin-right: 0;
  font-size: 22px;
}

.sidebar-footer {
  border-top: 1px solid var(--vscode-border);
  padding: 12px 0;
  transition: border-color 0.3s ease;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.editor-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.editor-header {
  height: 56px;
  background-color: var(--vscode-header-bg);
  border-bottom: 1px solid var(--vscode-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.breadcrumbs .view-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--vscode-text);
}

.editor-content {
  flex: 1;
  overflow: auto;
  position: relative;
  background-color: var(--vscode-bg);
}

.mt-4 {
  margin-top: 16px;
}

.w-full {
  width: 100%;
}

.login-dialog .el-dialog {
  background-color: var(--vscode-sidebar-bg);
  border-radius: 12px;
  box-shadow: 0 8px 32px var(--vscode-shadow);
}

.login-dialog .el-form-item__label {
  color: var(--vscode-text);
}

html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', Roboto, sans-serif;
  background-color: var(--vscode-bg);
  color: var(--vscode-text);
  overflow: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
}

* {
  box-sizing: border-box;
}

.vscode-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: var(--vscode-bg);
  color: var(--vscode-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.sidebar {
  width: 250px;
  background-color: var(--vscode-sidebar-bg);
  border-right: 1px solid var(--vscode-border);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease, border-color 0.3s ease;
  flex-shrink: 0;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--vscode-border);
  transition: border-color 0.3s ease;
}

.sidebar.collapsed .sidebar-header {
  padding: 0;
  justify-content: center;
}

.logo {
  width: 28px;
  height: 28px;
  margin-right: 12px;
}

.sidebar.collapsed .logo {
  margin-right: 0;
  display: none;
}

.title {
  font-weight: 600;
  font-size: 15px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.5px;
}

.collapse-btn {
  cursor: pointer;
  color: var(--vscode-text-muted);
  font-size: 18px;
  transition: color 0.2s;
}

.collapse-btn:hover {
  color: var(--vscode-primary);
}

.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.menu-group {
  margin-bottom: 20px;
}

.group-title {
  padding: 0 20px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vscode-text-muted);
  text-transform: uppercase;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  color: var(--vscode-text-muted);
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
  border-left: 3px solid transparent;
}

.sidebar.collapsed .menu-item {
  justify-content: center;
  padding: 14px 0;
  border-left: none;
}

.menu-item:hover {
  background-color: var(--vscode-hover);
  color: var(--vscode-text);
}

.menu-item.active {
  background-color: var(--vscode-active);
  color: var(--vscode-primary);
  border-left-color: var(--vscode-primary);
}

.sidebar.collapsed .menu-item.active {
  border-left: none;
}

.menu-item .el-icon {
  font-size: 18px;
  margin-right: 12px;
}

.sidebar.collapsed .menu-item .el-icon {
  margin-right: 0;
  font-size: 22px;
}

.sidebar-footer {
  border-top: 1px solid var(--vscode-border);
  padding: 12px 0;
  transition: border-color 0.3s ease;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.editor-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: flex 0.3s ease, width 0.3s ease;
}

.editor-header {
  height: 56px;
  background-color: var(--vscode-header-bg);
  border-bottom: 1px solid var(--vscode-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.breadcrumbs .view-title {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.editor-content {
  flex: 1;
  overflow: auto;
  position: relative;
  background-color: var(--vscode-bg);
  transition: background-color 0.3s ease;
}

.mt-4 {
  margin-top: 16px;
}

.w-full {
  width: 100%;
}

.login-dialog .el-dialog {
  background-color: var(--vscode-sidebar-bg);
  border-radius: 12px;
  box-shadow: 0 8px 32px var(--vscode-shadow);
}

.login-dialog .el-form-item__label {
  color: var(--vscode-text);
}
</style>
