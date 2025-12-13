<template>
  <div class="quick-start">
    <div class="content-header">
      <h2>快速入门</h2>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a href="/help">帮助中心</a></el-breadcrumb-item>
        <el-breadcrumb-item>快速入门</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentSectionTitle }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <!-- 系统介绍 -->
    <div v-if="currentSection === 'intro'" class="content-section">
      <h3>系统介绍</h3>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <div class="system-overview">
              <h4>卫星异常检测系统</h4>
              <p>专为卫星运维人员设计的实时监控与异常分析平台</p>
              <el-progress :percentage="95" status="success" text-inside :stroke-width="20" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <div class="key-features">
              <h4>核心功能</h4>
              <el-statistic-group :gap="20">
                <el-statistic title="实时监控" :value="6" suffix="颗卫星">
                  <template #prefix>
                    <el-icon><Monitor /></el-icon>
                  </template>
                </el-statistic>
                <el-statistic title="异常检测" :value="12" suffix="条规则">
                  <template #prefix>
                    <el-icon><Warning /></el-icon>
                  </template>
                </el-statistic>
                <el-statistic title="数据分析" :value="24" suffix="小时">
                  <template #prefix>
                    <el-icon><Document /></el-icon>
                  </template>
                </el-statistic>
              </el-statistic-group>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="24">
          <el-card class="feature-grid">
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="feature-item">
                  <el-icon class="feature-icon"><Monitor /></el-icon>
                  <h5>实时监控</h5>
                  <p>卫星状态、轨道位置、关键指标</p>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="feature-item">
                  <el-icon class="feature-icon"><Warning /></el-icon>
                  <h5>异常告警</h5>
                  <p>自动检测、实时推送、分级告警</p>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="feature-item">
                  <el-icon class="feature-icon"><Histogram /></el-icon>
                  <h5>数据分析</h5>
                  <p>趋势分析、异常溯源、统计报表</p>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="feature-item">
                  <el-icon class="feature-icon"><Setting /></el-icon>
                  <h5>系统配置</h5>
                  <p>卫星管理、规则配置、阈值设置</p>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 登录与权限说明 -->
    <div v-else-if="currentSection === 'login'" class="content-section">
      <h3>登录权限</h3>
      <el-card>
        <div class="login-section">
          <h4>用户角色</h4>
          <el-table :data="userRoles" stripe border style="margin-bottom: 20px;">
            <el-table-column prop="role" label="角色" width="120" />
            <el-table-column prop="permissions" label="权限范围" />
          </el-table>
          
          <h4>常见问题</h4>
          <el-collapse>
            <el-collapse-item title="忘记密码">
              <div class="solution-steps">
                <el-steps :active="4" finish-status="success" simple>
                  <el-step title="点击忘记密码" />
                  <el-step title="输入注册邮箱" />
                  <el-step title="查收邮件" />
                  <el-step title="重置密码" />
                  <el-step title="登录系统" />
                </el-steps>
              </div>
            </el-collapse-item>
            <el-collapse-item title="账号锁定">
              <div class="solution-steps">
                <el-alert
                  title="连续登录失败5次，账号锁定15分钟"
                  type="warning"
                  :closable="false"
                  show-icon
                >
                  <template #default>
                    <div>解锁方式：等待15分钟或联系管理员</div>
                  </template>
                </el-alert>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-card>
    </div>
    
    <!-- 核心功能快速浏览 -->
    <div v-else-if="currentSection === 'browse'" class="content-section">
      <h3>功能浏览</h3>
      <el-card>
        <el-timeline>
          <el-timeline-item timestamp="首页仪表盘" placement="top">
            <el-card shadow="hover">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-statistic title="卫星总数" :value="36" />
                </el-col>
                <el-col :span="8">
                  <el-statistic title="今日告警" :value="12" />
                </el-col>
                <el-col :span="8">
                  <el-statistic title="运行正常" :value="95" suffix="%" />
                </el-col>
              </el-row>
            </el-card>
          </el-timeline-item>
          
          <el-timeline-item timestamp="实时监控" placement="top">
            <el-card shadow="hover">
              <div class="monitor-preview">
                <el-skeleton :rows="4" animated>
                  <template #template>
                    <div style="height: 200px; background: #f0f0f0; border-radius: 8px;" />
                  </template>
                </el-skeleton>
              </div>
            </el-card>
          </el-timeline-item>
          
          <el-timeline-item timestamp="异常分析" placement="top">
            <el-card shadow="hover">
              <div class="analysis-preview">
                <el-skeleton :rows="4" animated>
                  <template #template>
                    <div style="height: 200px; background: #f0f0f0; border-radius: 8px;" />
                  </template>
                </el-skeleton>
              </div>
            </el-card>
          </el-timeline-item>
          
          <el-timeline-item timestamp="数据管理" placement="top">
            <el-card shadow="hover">
              <div class="data-preview">
                <el-skeleton :rows="4" animated>
                  <template #template>
                    <div style="height: 200px; background: #f0f0f0; border-radius: 8px;" />
                  </template>
                </el-skeleton>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
    
    <!-- 首次使用配置步骤 -->
    <div v-else-if="currentSection === 'config'" class="content-section">
      <h3>首次配置</h3>
      <el-card>
        <el-steps :active="0" finish-status="success" align-center>
          <el-step title="添加卫星" icon="Plus" />
          <el-step title="配置规则" icon="Setting" />
          <el-step title="调整阈值" icon="Histogram" />
          <el-step title="设置频率" icon="RefreshRight" />
          <el-step title="完成" icon="CircleCheck" />
        </el-steps>
        
        <div class="config-progress" style="margin-top: 40px;">
          <el-progress :percentage="20" :color="'#165DFF'" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Monitor, Warning, Document, Setting, 
  Histogram 
} from '@element-plus/icons-vue'

const route = useRoute()

// 获取当前章节
const currentSection = computed(() => {
  return (route.query.section as string) || 'intro'
})

// 当前章节标题
const currentSectionTitle = computed(() => {
  const titles: Record<string, string> = {
    intro: '系统介绍',
    login: '登录权限',
    browse: '功能浏览',
    config: '首次配置'
  }
  return titles[currentSection.value] || '系统介绍'
})

// 用户角色数据
const userRoles = [
  {
    role: '管理员',
    permissions: '系统配置、数据管理、权限分配'
  },
  {
    role: '运维人员',
    permissions: '实时监控、异常分析、数据查询'
  },
  {
    role: '查看人员',
    permissions: '只读访问权限'
  }
]
</script>

<style scoped>
.quick-start {
  height: 100%;
}

.content-header {
  margin-bottom: 20px;
}

.content-header h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: bold;
  color: #1d2129;
}

.content-section {
  margin-bottom: 30px;
}

.content-section h3 {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: bold;
  color: #1d2129;
  border-bottom: 2px solid #165DFF;
  padding-bottom: 10px;
}

/* 系统介绍样式 */
.system-overview {
  text-align: center;
  padding: 20px 0;
}

.system-overview h4 {
  margin-bottom: 10px;
  font-size: 18px;
  color: #165DFF;
}

.key-features h4 {
  margin-bottom: 20px;
  font-size: 18px;
  text-align: center;
}

.feature-grid {
  margin-top: 20px;
}

.feature-item {
  text-align: center;
  padding: 20px;
}

.feature-icon {
  font-size: 32px;
  color: #165DFF;
  margin-bottom: 10px;
}

.feature-item h5 {
  margin-bottom: 5px;
  font-size: 16px;
  font-weight: bold;
}

.feature-item p {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

/* 登录权限样式 */
.login-section h4 {
  margin: 20px 0 15px 0;
  font-size: 18px;
  font-weight: bold;
}

.solution-steps {
  padding: 10px 0;
}

/* 功能浏览样式 */
.monitor-preview,
.analysis-preview,
.data-preview {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-radius: 8px;
}

/* 首次配置样式 */
.config-progress {
  padding: 20px 0;
}
</style>