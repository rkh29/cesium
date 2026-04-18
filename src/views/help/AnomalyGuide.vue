<template>
  <div class="anomaly-guide">
    <div class="content-header">
      <h2>异常处理</h2>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a href="/help">帮助中心</a></el-breadcrumb-item>
        <el-breadcrumb-item>异常处理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentSectionTitle }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <!-- 硬件故障 -->
    <div v-if="currentSection === 'hardware'" class="content-section">
      <h3>硬件故障</h3>
      
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><WarningFilled /></el-icon>
                <span>硬件故障处理流程</span>
              </div>
            </template>
            
            <el-timeline>
              <el-timeline-item timestamp="现象" placement="top">
                <el-alert title="卫星状态异常，硬件指标超出阈值" type="danger" show-icon :closable="false" />
              </el-timeline-item>
              
              <el-timeline-item timestamp="分析" placement="top">
                <el-tag type="warning" v-for="cause in hardwareCauses" :key="cause">{{ cause }}</el-tag>
              </el-timeline-item>
              
              <el-timeline-item timestamp="处理" placement="top">
                <el-steps :active="4" finish-status="success" :align-center="true">
                  <el-step title="查看数据" />
                  <el-step title="联系地面站" />
                  <el-step title="远程复位" />
                  <el-step title="备用模块" />
                  <el-step title="记录结果" />
                </el-steps>
              </el-timeline-item>
              
              <el-timeline-item timestamp="预防" placement="top">
                <el-progress :percentage="85" status="success" text-inside :stroke-width="15" />
                <div style="margin-top: 10px; text-align: center;">定期检查硬件指标趋势，设置预警阈值</div>
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 信号异常 -->
    <div v-else-if="currentSection === 'signal'" class="content-section">
      <h3>信号异常</h3>
      
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Cellphone /></el-icon>
                <span>信号异常处理</span>
              </div>
            </template>
            
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="signal-stats">
                  <h4>信号状态</h4>
                  <el-statistic-group :gap="20">
                    <el-statistic title="信号强度" :value="65" suffix="%">
                      <template #prefix>
                        <el-icon><Signal /></el-icon>
                      </template>
                    </el-statistic>
                    <el-statistic title="传输成功率" :value="80" suffix="%">
                      <template #prefix>
                        <el-icon><Upload /></el-icon>
                      </template>
                    </el-statistic>
                  </el-statistic-group>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="signal-solutions">
                  <h4>解决方案</h4>
                  <el-alert
                    title="信号异常解决方案"
                    type="info"
                    show-icon
                    :closable="false"
                  >
                    <template #default>
                      <div v-for="solution in signalSolutions" :key="solution">
                        <el-divider orientation="left">{{ solution }}</el-divider>
                      </div>
                    </template>
                  </el-alert>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 轨道偏移 -->
    <div v-else-if="currentSection === 'orbit'" class="content-section">
      <h3>轨道偏移</h3>
      
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Location /></el-icon>
                <span>轨道偏移处置</span>
              </div>
            </template>
            
            <div class="orbit-preview">
              <el-skeleton :rows="5" animated>
                <template #template>
                  <div style="height: 300px; background-color: var(--vscode-hover); border-radius: 8px;" />
                </template>
              </el-skeleton>
            </div>
            
            <el-row :gutter="20" style="margin-top: 20px;">
              <el-col :span="12">
                <el-button type="primary" block>计算修正参数</el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="success" block>执行轨道修正</el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 数据传输失败 -->
    <div v-else-if="currentSection === 'data-transmission'" class="content-section">
      <h3>数据传输</h3>
      
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><DocumentRemove /></el-icon>
                <span>数据传输失败</span>
              </div>
            </template>
            
            <el-rate v-model="transmissionRate" disabled show-score />
            
            <el-table :data="transmissionData" border style="margin-top: 20px;">
              <el-table-column prop="time" label="时间" width="180" />
              <el-table-column prop="status" label="状态">
                <template #default="scope">
                  <el-tag :type="scope.row.status === 'success' ? 'success' : 'danger'">
                    {{ scope.row.status === 'success' ? '成功' : '失败' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="error" label="错误信息" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 告警阈值调整 -->
    <div v-else-if="currentSection === 'threshold'" class="content-section">
      <h3>告警阈值</h3>
      
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Histogram /></el-icon>
                <span>告警阈值调整</span>
              </div>
            </template>
            
            <el-tabs v-model="activeTab" type="border-card">
              <el-tab-pane label="电压阈值">
                <el-slider v-model="voltageThreshold" :min="0" :max="50" :marks="{ 0: '0V', 25: '25V', 50: '50V' }" />
              </el-tab-pane>
              <el-tab-pane label="温度阈值">
                <el-slider v-model="temperatureThreshold" :min="-20" :max="80" :marks="{ '-20': '-20°C', '30': '30°C', '80': '80°C' }" />
              </el-tab-pane>
              <el-tab-pane label="信号阈值">
                <el-slider v-model="signalThreshold" :min="0" :max="100" :marks="{ 0: '0%', 50: '50%', 100: '100%' }" />
              </el-tab-pane>
            </el-tabs>
            
            <el-button type="primary" style="margin-top: 20px; width: 100%;">保存阈值设置</el-button>
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
  WarningFilled, Cellphone, Upload, 
  Location, DocumentRemove, Histogram 
} from '@element-plus/icons-vue'

const route = useRoute()

// 获取当前章节
const currentSection = computed(() => {
  return (route.query.section as string) || 'hardware'
})

// 当前章节标题
const currentSectionTitle = computed(() => {
  const titles: Record<string, string> = {
    hardware: '硬件故障',
    signal: '信号异常',
    orbit: '轨道偏移',
    'data-transmission': '数据传输',
    threshold: '告警阈值'
  }
  return titles[currentSection.value] || '硬件故障'
})

// 硬件故障原因
const hardwareCauses = [
  '硬件模块损坏',
  '供电线路故障',
  '传感器异常',
  '温度过高'
]

// 信号解决方案
const signalSolutions = [
  '检查天线',
  '调整功率',
  '切换链路',
  '地面站维护'
]

// 传输成功率
const transmissionRate = ref(2.5)

// 传输数据
const transmissionData = [
  { time: '2025-12-13 10:20:15', status: 'failure', error: '通信链路中断' },
  { time: '2025-12-13 10:15:30', status: 'failure', error: '数据压缩失败' },
  { time: '2025-12-13 10:10:00', status: 'success', error: '' },
  { time: '2025-12-13 10:05:00', status: 'failure', error: '地面站接收超时' },
  { time: '2025-12-13 10:00:00', status: 'success', error: '' }
]

// 标签页
const activeTab = ref('voltage')

// 阈值设置
const voltageThreshold = ref(28)
const temperatureThreshold = ref(45)
const signalThreshold = ref(70)
</script>

<style scoped>
.anomaly-guide {
  height: 100%;
}

.content-header {
  margin-bottom: 20px;
}

.content-header h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: bold;
  color: var(--vscode-text);
}

.content-section {
  margin-bottom: 30px;
}

.content-section h3 {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: bold;
  color: var(--vscode-text);
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

/* 信号统计 */
.signal-stats h4,
.signal-solutions h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: bold;
  color: var(--vscode-text);
}

/* 轨道预览 */
.orbit-preview {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--vscode-sidebar-bg);
  border-radius: 8px;
}
</style>