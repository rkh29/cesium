<template>
  <div class="monitor-layout">
    <header class="monitor-header glass-panel">
      <div class="header-left">
        <div class="logo">
          <el-icon class="logo-icon"><Monitor /></el-icon>
          <div class="logo-text">
            <span class="zh-name">监控展示端</span>
            <span class="en-name">Monitor Client</span>
          </div>
        </div>
      </div>
      <div class="header-center">
        <div class="status-badge">
          <span class="status-dot"></span>
          <span>监控模式</span>
        </div>
        <div class="time-display">
          <el-icon><Timer /></el-icon>
          <span>{{ currentTime }}</span>
        </div>
      </div>
      <div class="header-right">
        <el-dropdown trigger="click" @command="handleUserCommand">
          <div class="user-info">
            <el-avatar :size="32" />
            <span class="user-name">{{ authStore.user?.username || '观察员' }}</span>
            <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled>
                <div class="user-dropdown-info">
                  <div class="user-role">{{ getRoleName(authStore.user?.role) }}</div>
                  <div class="user-email">{{ authStore.user?.username }}</div>
                </div>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <div class="monitor-main">
      <nav class="monitor-sidebar glass-panel">
        <div class="sidebar-header">
          <span class="sidebar-title">监控菜单</span>
        </div>
        <div class="menu-container">
          <RouterLink
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="menu-item"
            :class="{ active: route.path === item.path }"
          >
            <el-icon class="item-icon"><component :is="item.icon" /></el-icon>
            <span class="item-title">{{ item.title }}</span>
          </RouterLink>
        </div>
      </nav>

      <main class="monitor-content">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Monitor, Position, Warning, TrendCharts, Timer, ArrowDown, SwitchButton } from '@element-plus/icons-vue'
import { useAuthStore } from '../stores/auth'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const currentTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))

// 获取角色名称
const getRoleName = (role?: string) => {
  const roleMap: Record<string, string> = {
    admin: '管理员',
    operator: '操作员',
    viewer: '观察员'
  }
  return roleMap[role || 'viewer'] || '用户'
}

// 处理用户菜单命令
const handleUserCommand = (command: string) => {
  if (command === 'logout') {
    authStore.logout()
    router.push('/login')
  }
}

let timer: any = null

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

// 监控展示端菜单：只读监控功能
const menuItems = [
  { path: '/monitor', title: '监控概览', icon: Monitor },
  { path: '/monitor/status', title: '实时状态', icon: Position },
  { path: '/monitor/metrics', title: '资源指标', icon: Monitor },
  { path: '/monitor/alerts', title: '异常告警', icon: Warning },
  { path: '/monitor/anomalies', title: '异常列表', icon: Warning },
  { path: '/monitor/trend', title: '趋势分析', icon: TrendCharts }
]
</script>

<style scoped>
.monitor-layout {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-dark);
  color: var(--text-primary);
}

.monitor-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid var(--glass-border);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 28px;
  color: var(--secondary-color);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.zh-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.en-name {
  font-size: 10px;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.header-center {
  display: flex;
  align-items: center;
  gap: 20px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 20px;
  font-size: 13px;
  color: var(--secondary-color);
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: var(--secondary-color);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--secondary-color);
  animation: blink 2s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.time-display {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  font-family: 'JetBrains Mono', monospace;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: 24px;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-name {
  font-size: 14px;
  font-weight: 500;
}

.dropdown-icon {
  font-size: 12px;
  color: var(--text-secondary);
  transition: transform var(--transition-fast);
}

.user-info:hover .dropdown-icon {
  transform: translateY(2px);
}

.user-dropdown-info {
  padding: 4px 0;
}

.user-role {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.user-email {
  font-size: 12px;
  color: var(--text-secondary);
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

.monitor-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.monitor-sidebar {
  width: 200px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--glass-border);
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.sidebar-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-secondary);
}

.menu-container {
  flex: 1;
  padding: 8px 0;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.menu-item:hover {
  background: rgba(0, 255, 136, 0.08);
  color: var(--secondary-color);
}

.menu-item.active {
  background: linear-gradient(90deg, rgba(0, 255, 136, 0.15), transparent);
  color: var(--secondary-color);
  border-left-color: var(--secondary-color);
}

.item-icon {
  font-size: 16px;
}

.item-title {
  font-size: 14px;
}

.monitor-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: rgba(10, 14, 39, 0.9);
  backdrop-filter: blur(8px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
