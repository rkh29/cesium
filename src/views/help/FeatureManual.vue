<template>
  <div class="feature-manual">
    <div class="content-header">
      <h2>功能操作</h2>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a href="/help">帮助中心</a></el-breadcrumb-item>
        <el-breadcrumb-item>功能操作</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentSectionTitle }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <!-- 实时监控 -->
    <div v-if="currentSection === 'monitor'" class="content-section">
      <h3>实时监控</h3>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Monitor /></el-icon>
                <span>卫星切换</span>
              </div>
            </template>
            <el-steps :active="3" finish-status="success" :align-center="true">
              <el-step title="选择导航" />
              <el-step title="选择卫星" />
              <el-step title="查看状态" />
              <el-step title="完成" />
            </el-steps>
          </el-card>
        </el-col>
        
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Histogram /></el-icon>
                <span>图表调整</span>
              </div>
            </template>
            <el-steps :active="4" finish-status="success" :align-center="true">
              <el-step title="进入页面" />
              <el-step title="选择时间" />
              <el-step title="选择指标" />
              <el-step title="查看图表" />
              <el-step title="完成" />
            </el-steps>
          </el-card>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="24">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Bell /></el-icon>
                <span>告警设置</span>
              </div>
            </template>
            <div class="settings-grid">
              <el-col :span="8">
                <div class="setting-item">
                  <h5>刷新频率</h5>
                  <el-select style="width: 100%;">
                    <el-option label="5秒" value="5" />
                    <el-option label="10秒" value="10" />
                    <el-option label="30秒" value="30" />
                  </el-select>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="setting-item">
                  <h5>告警级别</h5>
                  <el-select style="width: 100%;">
                    <el-option label="全部" value="all" />
                    <el-option label="高" value="high" />
                    <el-option label="中" value="medium" />
                    <el-option label="低" value="low" />
                  </el-select>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="setting-item">
                  <h5>推送方式</h5>
                  <el-select style="width: 100%;">
                    <el-option label="页面" value="page" />
                    <el-option label="邮件" value="email" />
                    <el-option label="短信" value="sms" />
                  </el-select>
                </div>
              </el-col>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 异常分析 -->
    <div v-else-if="currentSection === 'analysis'" class="content-section">
      <h3>异常分析</h3>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Warning /></el-icon>
                <span>异常列表</span>
              </div>
            </template>
            <el-table :data="anomalyData" border style="width: 100%">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="satellite" label="卫星" width="120" />
              <el-table-column prop="type" label="类型" width="120" />
              <el-table-column prop="time" label="时间" />
            </el-table>
          </el-card>
        </el-col>
        
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><DataAnalysis /></el-icon>
                <span>异常溯源</span>
              </div>
            </template>
            <div class="trace-preview">
              <el-skeleton :rows="5" animated>
                <template #template>
                  <div style="height: 200px; background: #f0f0f0; border-radius: 8px;" />
                </template>
              </el-skeleton>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 数据管理 -->
    <div v-else-if="currentSection === 'data'" class="content-section">
      <h3>数据管理</h3>
      
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Document /></el-icon>
                <span>数据查询与导出</span>
              </div>
            </template>
            <el-tabs v-model="activeTab" type="border-card">
              <el-tab-pane label="查询数据">
                <el-form :model="queryForm" label-position="left" label-width="80px" inline>
                  <el-form-item label="卫星：">
                    <el-select v-model="queryForm.satellite" placeholder="选择卫星">
                      <el-option label="北斗 - 07" value="beidou-07" />
                      <el-option label="北斗 - 03" value="beidou-03" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="时间：">
                    <el-date-picker v-model="queryForm.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
                  </el-form-item>
                  <el-form-item label="指标：">
                    <el-select v-model="queryForm.metric" placeholder="选择指标">
                      <el-option label="电压" value="voltage" />
                      <el-option label="温度" value="temperature" />
                      <el-option label="信号强度" value="signal" />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary">查询</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="导出数据">
                <el-form :model="exportForm" label-position="left" label-width="80px" inline>
                  <el-form-item label="格式：">
                    <el-select v-model="exportForm.format" placeholder="选择格式">
                      <el-option label="Excel" value="excel" />
                      <el-option label="CSV" value="csv" />
                      <el-option label="JSON" value="json" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="范围：">
                    <el-select v-model="exportForm.range" placeholder="选择范围">
                      <el-option label="全部数据" value="all" />
                      <el-option label="当前查询" value="current" />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="success">导出</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 系统配置 -->
    <div v-else-if="currentSection === 'system'" class="content-section">
      <h3>系统配置</h3>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Plus /></el-icon>
                <span>添加卫星</span>
              </div>
            </template>
            <div class="config-form">
              <el-skeleton :rows="6" animated>
                <template #template>
                  <el-input style="margin-bottom: 15px;" placeholder="卫星名称" />
                  <el-input style="margin-bottom: 15px;" placeholder="卫星编号" />
                  <el-select style="margin-bottom: 15px;" placeholder="卫星类型" />
                  <el-button type="primary" style="width: 100%;">保存</el-button>
                </template>
              </el-skeleton>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Setting /></el-icon>
                <span>配置规则</span>
              </div>
            </template>
            <div class="rules-grid">
              <el-checkbox-group v-model="rules">
                <el-checkbox label="电压异常检测" />
                <el-checkbox label="温度异常检测" />
                <el-checkbox label="信号异常检测" />
                <el-checkbox label="轨道偏移检测" />
              </el-checkbox-group>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Monitor, Warning, Document, Setting, 
  Histogram, Bell, DataAnalysis, Plus 
} from '@element-plus/icons-vue'

const route = useRoute()

// 获取当前章节
const currentSection = computed(() => {
  return (route.query.section as string) || 'monitor'
})

// 当前章节标题
const currentSectionTitle = computed(() => {
  const titles: Record<string, string> = {
    monitor: '实时监控',
    analysis: '异常分析',
    data: '数据管理',
    system: '系统配置'
  }
  return titles[currentSection.value] || '实时监控'
})

// 异常数据
const anomalyData = [
  { id: 1, satellite: '北斗 - 03', type: '轨道偏移', time: '2025-12-13 10:20:15' },
  { id: 2, satellite: '北斗 - 05', type: '信号异常', time: '2025-12-13 10:15:30' },
  { id: 3, satellite: '北斗 - 02', type: '数据延迟', time: '2025-12-13 10:10:00' }
]

// 标签页
const activeTab = ref('query')

// 查询表单
const queryForm = ref({
  satellite: '',
  time: [],
  metric: ''
})

// 导出表单
const exportForm = ref({
  format: 'excel',
  range: 'current'
})

// 检测规则
const rules = ref(['voltage', 'temperature'])
</script>

<style scoped>
.feature-manual {
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

/* 卡片样式 */
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 16px;
}

/* 步骤样式 */
.el-steps {
  padding: 20px 0;
}

/* 设置项样式 */
.settings-grid {
  display: flex;
  gap: 20px;
  padding: 20px 0;
  flex-wrap: wrap;
}

.setting-item {
  width: calc(33.333% - 13.333px);
}

.setting-item h5 {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #1d2129;
}

/* 溯源预览 */
.trace-preview {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-radius: 8px;
}

/* 配置表单 */
.config-form {
  padding: 20px 0;
}

/* 规则选择 */
.rules-grid {
  padding: 20px 0;
  display: flex;
  gap: 20px;
  flex-direction: column;
}

@media (max-width: 768px) {
  .setting-item {
    width: 100%;
  }
}
</style>