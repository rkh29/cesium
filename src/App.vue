<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import {
  ChatLineRound,
  Close,
  Connection,
  Cpu,
  Document,
  Fold,
  Grid,
  Link,
  Monitor,
  Notification,
  Operation,
  Setting,
  User
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from './stores/auth'
import { agentApi } from './api'
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

interface HelperMessage {
  role: 'user' | 'assistant'
  content: string
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const collapsed = ref(false)
const agentDrawerVisible = ref(false)
const isDark = ref(false)
const loginVisible = ref(false)
const loginForm = ref({ username: 'admin', password: 'admin' })
const helperInput = ref('')
const helperSending = ref(false)
const helperMessages = ref<HelperMessage[]>([
  {
    role: 'assistant',
    content:
      '我是右侧快捷助手。这里已经接入真实 agent 接口，你可以直接问我运维问题，例如“今天是星期几”“排查 GEO 骨干链路异常”“怎么看 LLM 状态”。'
  }
])

const groups: NavGroup[] = [
  {
    id: 'overview',
    label: '总览',
    icon: Monitor,
    children: [
      { path: '/', label: '卫星群仿真', icon: Monitor },
      { path: '/earth', label: '卫星群视图', icon: Monitor },
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
  },
  {
    id: 'agent',
    label: '智能协作',
    icon: Connection,
    children: [
      { path: '/agent', label: '协调控制台', icon: ChatLineRound },
      { path: '/dag-pipeline', label: '执行流图', icon: Connection },
      { path: '/blackboard', label: '黑板审计', icon: Document }
    ]
  },
  {
    id: 'ops',
    label: '运行控制',
    icon: Operation,
    children: [
      { path: '/faults', label: '故障注入', icon: Notification },
      { path: '/security', label: '审批审计', icon: Document },
      { path: '/llm', label: 'LLM 配置', icon: Cpu }
    ]
  }
]

onMounted(() => {
  authStore.loadAuth()
  if (!authStore.isAuthenticated) {
    loginVisible.value = true
  }

  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
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

async function sendHelper() {
  const question = helperInput.value.trim()
  if (!question || helperSending.value) return

  helperMessages.value.push({ role: 'user', content: question })
  helperInput.value = ''
  helperSending.value = true

  try {
    const response = await agentApi.chat({
      agent_type: 'coordinator',
      message: question,
      history: helperMessages.value
        .slice(-8)
        .map((item) => ({ role: item.role, content: item.content }))
    })

    const extras = [
      response.response,
      response.suggestions?.length ? `建议：${response.suggestions.join('；')}` : '',
      response.pending_approvals?.length ? `待审批：${response.pending_approvals.length} 项` : ''
    ]
      .filter(Boolean)
      .join('\n\n')

    helperMessages.value.push({
      role: 'assistant',
      content: extras || '已收到，但没有返回可展示内容。'
    })
  } catch (error: any) {
    ElMessage.error(error?.message || '助手请求失败')
    helperMessages.value.push({
      role: 'assistant',
      content: '当前助手请求失败。你可以先进入“协调控制台”页面直接发起任务。'
    })
  } finally {
    helperSending.value = false
  }
}

const currentTitle = computed(() => {
  for (const group of groups) {
    const match = group.children.find((child) => child.path === route.path)
    if (match) return match.label
  }
  return '卫星群仿真'
})
</script>

<template>
  <div class="vscode-layout" :class="{ 'is-dark': isDark }">
    <aside class="sidebar" :class="{ collapsed }">
      <div class="sidebar-header">
        <img :src="logoUrl" alt="logo" class="logo" />
        <span v-if="!collapsed" class="title">星网智控台</span>
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
        <div class="menu-item" :title="isDark ? '切换浅色模式' : '切换深色模式'" @click="toggleTheme">
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
        <div class="actions">
          <el-button type="primary" plain size="small" @click="agentDrawerVisible = true">
            <el-icon><ChatLineRound /></el-icon>
            <span class="ml-1">智能助手</span>
          </el-button>
        </div>
      </header>
      <div class="editor-content">
        <RouterView />
      </div>
    </main>

    <aside class="agent-panel" :class="{ 'is-open': agentDrawerVisible }">
      <div class="agent-header">
        <span class="agent-title">智能协作助手</span>
        <el-icon class="agent-close" @click="agentDrawerVisible = false"><Close /></el-icon>
      </div>
      <div class="drawer-chat">
        <div class="chat-messages">
          <div
            v-for="(msg, index) in helperMessages"
            :key="index"
            class="msg-card"
            :class="msg.role === 'user' ? 'user-msg' : 'bot-msg'"
          >
            <div class="msg-role">{{ msg.role === 'user' ? '你' : '助手' }}</div>
            <div class="msg-content">{{ msg.content }}</div>
          </div>
        </div>
        <div class="chat-input-area">
          <el-input
            v-model="helperInput"
            placeholder="输入运维问题..."
            :disabled="helperSending"
            @keyup.enter="sendHelper"
          />
          <el-button type="primary" class="mt-2 w-full" :loading="helperSending" @click="sendHelper">
            发送
          </el-button>
        </div>
      </div>
    </aside>

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
          <el-input v-model="loginForm.username" placeholder="请输入用户名 (admin)" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码 (admin)"
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
  --vscode-bg: #f8fafc;
  --vscode-sidebar-bg: #ffffff;
  --vscode-border: #e2e8f0;
  --vscode-text: #1e293b;
  --vscode-text-muted: #64748b;
  --vscode-hover: #f1f5f9;
  --vscode-active: #e2e8f0;
  --vscode-primary: #3b82f6;
  --vscode-primary-text: #ffffff;
  --vscode-shadow: rgba(0, 0, 0, 0.04);
  --vscode-header-bg: #ffffff;
  --el-color-primary: var(--vscode-primary);
  --el-bg-color: var(--vscode-bg);
  --el-bg-color-overlay: var(--vscode-sidebar-bg);
  --el-text-color-primary: var(--vscode-text);
  --el-text-color-regular: var(--vscode-text-muted);
  --el-border-color: var(--vscode-border);
  --el-border-color-light: var(--vscode-border);
  --el-border-color-lighter: var(--vscode-hover);
  --el-border-radius-base: 8px;
}

html.dark {
  --vscode-bg: #0f172a;
  --vscode-sidebar-bg: #1e293b;
  --vscode-border: rgba(255, 255, 255, 0.08);
  --vscode-text: #f8fafc;
  --vscode-text-muted: #94a3b8;
  --vscode-hover: rgba(255, 255, 255, 0.06);
  --vscode-active: rgba(255, 255, 255, 0.1);
  --vscode-primary: #38bdf8;
  --vscode-primary-text: #0f172a;
  --vscode-shadow: rgba(0, 0, 0, 0.4);
  --vscode-header-bg: #1e293b;
  --el-bg-color: var(--vscode-bg);
  --el-bg-color-overlay: var(--vscode-sidebar-bg);
  --el-text-color-primary: var(--vscode-text);
  --el-text-color-regular: var(--vscode-text-muted);
  --el-border-color: var(--vscode-border);
  --el-border-color-light: var(--vscode-border);
  --el-border-color-lighter: var(--vscode-hover);
}

html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
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

.agent-panel {
  width: 0;
  background-color: var(--vscode-sidebar-bg);
  border-left: 1px solid transparent;
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease, background-color 0.3s ease;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: -4px 0 16px var(--vscode-shadow);
}

.agent-panel.is-open {
  width: 360px;
  border-left-color: var(--vscode-border);
}

.agent-header {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid var(--vscode-border);
  flex-shrink: 0;
  min-width: 360px;
}

.agent-title {
  font-weight: 600;
  font-size: 15px;
}

.agent-close {
  cursor: pointer;
  font-size: 20px;
  color: var(--vscode-text-muted);
  transition: color 0.2s;
}

.agent-close:hover {
  color: var(--vscode-primary);
}

.drawer-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 360px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.msg-card {
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.6;
}

.msg-role {
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--vscode-primary);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-msg .msg-role {
  color: var(--vscode-text-muted);
}

.msg-content {
  background: var(--vscode-bg);
  border: 1px solid var(--vscode-border);
  padding: 12px 16px;
  border-radius: 8px;
  white-space: pre-wrap;
  box-shadow: 0 2px 8px var(--vscode-shadow);
}

.chat-input-area {
  border-top: 1px solid var(--vscode-border);
  padding: 20px;
  background: var(--vscode-sidebar-bg);
  flex-shrink: 0;
}

.ml-1 {
  margin-left: 4px;
}

.mt-2 {
  margin-top: 8px;
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
