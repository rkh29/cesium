<template>
  <div id="app" class="app-container">
    <!-- 顶部导航栏 -->
    <el-header class="top-header">
      <div class="header-left">
        <div class="logo">
          <el-icon class="logo-icon"><monitor /></el-icon>
          <div class="logo-text">
            <span class="zh-name">卫星异常检测系统</span>
            <span class="en-name">Satellite Anomaly Detection System</span>
          </div>
        </div>
      </div>
      <div class="header-center">
        <el-tag type="success">当前卫星：北斗 - 07</el-tag>
        <el-tag type="success">运行状态：正常</el-tag>
        <el-tag type="info">最后检测时间：2025-12-13 10:25:30</el-tag>
      </div>
      <div class="header-right">
        <el-dropdown>
          <span class="user-info">
            <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            <span>管理员</span>
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>系统设置</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- 主体内容区 -->
    <el-container class="main-container">
      <!-- 左侧侧边栏 -->
      <el-aside class="sidebar" width="220px">
        <el-menu 
          :default-active="activeMenu" 
          mode="vertical" 
          router
          background-color="#165DFF"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon><home-filled /></el-icon>
              <span>首页</span>
            </template>
            <el-menu-item index="/">仪表盘</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><monitor /></el-icon>
              <span>实时监控</span>
            </template>
            <el-menu-item index="/real-time/status">卫星状态总览</el-menu-item>
            <el-menu-item index="/real-time/metrics">关键指标监控</el-menu-item>
            <el-menu-item index="/real-time/alerts">异常告警实时推送</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><warning /></el-icon>
              <span>异常分析</span>
            </template>
            <el-menu-item index="/anomalies">异常列表</el-menu-item>
            <el-menu-item index="/anomalies/trace">异常溯源</el-menu-item>
            <el-menu-item index="/anomalies/trend">趋势分析</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>
              <el-icon><document /></el-icon>
              <span>数据管理</span>
            </template>
            <el-menu-item index="/data/history">历史数据查询</el-menu-item>
            <el-menu-item index="/data/export">数据导出</el-menu-item>
            <el-menu-item index="/data/backup">数据备份</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="5">
            <template #title>
              <el-icon><setting /></el-icon>
              <span>系统配置</span>
            </template>
            <el-menu-item index="/config/satellites">卫星信息管理</el-menu-item>
            <el-menu-item index="/config/rules">检测规则配置</el-menu-item>
            <el-menu-item index="/config/thresholds">告警阈值设置</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/help">
            <template #title>
              <el-icon><question-filled /></el-icon>
              <span>帮助中心</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区域 -->
      <el-main class="content-area">
        <router-view />
      </el-main>
    </el-container>

    <!-- 底部信息栏 -->
    <el-footer class="bottom-footer">
      <div class="footer-content">
        <span>系统版本：v1.0.0</span>
        <span>版权所有 © 2025 卫星异常检测系统</span>
        <span>技术支持：400-123-4567</span>
      </div>
    </el-footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  HomeFilled, 
  Monitor, 
  Warning, 
  Document, 
  Setting, 
  QuestionFilled,
  ArrowDown
} from '@element-plus/icons-vue'

const route = useRoute()

// 计算当前激活的菜单
const activeMenu = computed(() => {
  const path = route.path
  if (path === '/') return '/'
  if (path.startsWith('/real-time')) return '2'
  if (path.startsWith('/anomalies')) return '3'
  if (path.startsWith('/data')) return '4'
  if (path.startsWith('/config')) return '5'
  if (path.startsWith('/help')) return '/help'
  return path
})
</script>

<style scoped>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  font-family: "微软雅黑", "Arial", sans-serif;
  color: #1D2129;
  overflow: hidden;
}

/* 顶部导航栏 */
.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 70px;
  background-color: #165DFF;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 0;
}

.logo-icon {
  font-size: 32px;
  color: #fff;
  animation: pulse 2s infinite;
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.zh-name {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-family: "思源黑体", "微软雅黑", sans-serif;
}

.en-name {
  font-size: 12px;
  opacity: 0.9;
  color: #e0e0e0;
  letter-spacing: 0.5px;
  font-family: "Arial", sans-serif;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.header-center {
  display: flex;
  gap: 15px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 主体内容区 */
.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  background-color: #F2F3F5;
}

/* 左侧侧边栏 */
.sidebar {
  background-color: #165DFF;
  color: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

/* 主内容区域 */
.content-area {
  flex: 1;
  padding: 15px;
  background-color: #F2F3F5;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 底部信息栏 */
.bottom-footer {
  height: 45px;
  background-color: #F8F9FA;
  border-top: 1px solid #E4E7ED;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.footer-content {
  display: flex;
  gap: 30px;
  font-size: 13px;
  color: #909399;
}

/* 滚动条样式优化 */
.content-area::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.content-area::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.content-area::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.content-area::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>