<template>
  <div class="help-center">
    <el-container class="help-container">
      <!-- 左侧导航区 -->
      <el-aside class="help-sidebar">
        <div class="sidebar-header">
          <h3>帮助中心</h3>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索帮助内容"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="help-menu"
          router
        >
          <!-- 快速入门 -->
          <el-sub-menu index="quick-start">
            <template #title>
              <span>快速入门</span>
            </template>
            <el-menu-item index="/help/quick-start?section=intro">系统介绍</el-menu-item>
            <el-menu-item index="/help/quick-start?section=login">登录权限</el-menu-item>
            <el-menu-item index="/help/quick-start?section=browse">功能浏览</el-menu-item>
            <el-menu-item index="/help/quick-start?section=config">首次配置</el-menu-item>
          </el-sub-menu>
          
          <!-- 功能操作 -->
          <el-sub-menu index="feature-manual">
            <template #title>
              <span>功能操作</span>
            </template>
            <el-menu-item index="/help/feature-manual?section=monitor">实时监控</el-menu-item>
            <el-menu-item index="/help/feature-manual?section=analysis">异常分析</el-menu-item>
            <el-menu-item index="/help/feature-manual?section=data">数据管理</el-menu-item>
            <el-menu-item index="/help/feature-manual?section=system">系统配置</el-menu-item>
          </el-sub-menu>
          
          <!-- 异常处理 -->
          <el-sub-menu index="anomaly-guide">
            <template #title>
              <span>异常处理</span>
            </template>
            <el-menu-item index="/help/anomaly-guide?section=hardware">硬件故障</el-menu-item>
            <el-menu-item index="/help/anomaly-guide?section=signal">信号异常</el-menu-item>
            <el-menu-item index="/help/anomaly-guide?section=orbit">轨道偏移</el-menu-item>
            <el-menu-item index="/help/anomaly-guide?section=data-transmission">数据传输</el-menu-item>
            <el-menu-item index="/help/anomaly-guide?section=threshold">告警阈值</el-menu-item>
          </el-sub-menu>
          
          <!-- 常见问题 -->
          <el-sub-menu index="faq">
            <template #title>
              <span>常见问题</span>
            </template>
            <el-menu-item index="/help/faq?section=login">登录问题</el-menu-item>
            <el-menu-item index="/help/faq?section=data">数据问题</el-menu-item>
            <el-menu-item index="/help/faq?section=chart">图表问题</el-menu-item>
            <el-menu-item index="/help/faq?section=permission">权限问题</el-menu-item>
          </el-sub-menu>
          
          <!-- 视频教程 -->
          <el-sub-menu index="video-tutorials">
            <template #title>
              <span>视频教程</span>
            </template>
            <el-menu-item index="/help/video-tutorials?section=overview">系统操作</el-menu-item>
            <el-menu-item index="/help/video-tutorials?section=trace">异常溯源</el-menu-item>
            <el-menu-item index="/help/video-tutorials?section=rules">规则配置</el-menu-item>
          </el-sub-menu>
          
          <!-- 问题反馈 -->
          <el-sub-menu index="feedback">
            <template #title>
              <span>问题反馈</span>
            </template>
            <el-menu-item index="/help/feedback?section=new">提交反馈</el-menu-item>
            <el-menu-item index="/help/feedback?section=my">我的反馈</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      
      <!-- 主内容展示区 -->
      <el-main class="help-content">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

const route = useRoute()
const searchKeyword = ref('')

// 计算当前激活的菜单
const activeMenu = computed(() => {
  const path = route.path
  if (path.startsWith('/help/quick-start')) return 'quick-start'
  if (path.startsWith('/help/feature-manual')) return 'feature-manual'
  if (path.startsWith('/help/anomaly-guide')) return 'anomaly-guide'
  if (path.startsWith('/help/faq')) return 'faq'
  if (path.startsWith('/help/video-tutorials')) return 'video-tutorials'
  if (path.startsWith('/help/feedback')) return 'feedback'
  return 'quick-start'
})
</script>

<style scoped>
.help-center {
  height: 100%;
}

.help-container {
  height: 100%;
}

.help-sidebar {
  width: 240px;
  background-color: var(--vscode-sidebar-bg);
  border-right: 1px solid var(--vscode-border);
  padding: 15px;
  overflow-y: auto;
}

.sidebar-header {
  margin-bottom: 15px;
}

.sidebar-header h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: bold;
  color: var(--vscode-text);
}

.help-menu {
  background-color: transparent;
  border-right: none;
}

.help-content {
  padding: 20px;
  background-color: var(--vscode-sidebar-bg);
  overflow-y: auto;
}
</style>