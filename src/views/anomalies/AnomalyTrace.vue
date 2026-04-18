<template>
  <div class="anomaly-trace">
    <h2>异常溯源</h2>
    <el-card class="trace-card">
      <el-form label-position="top" :model="searchForm">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="searchForm.satelliteId" placeholder="卫星ID" />
          </el-col>
          <el-col :span="6">
            <el-date-picker v-model="searchForm.startTime" type="datetime" placeholder="开始时间" />
          </el-col>
          <el-col :span="6">
            <el-date-picker v-model="searchForm.endTime" type="datetime" placeholder="结束时间" />
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="searchTrace">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      
      <div class="trace-content">
        <h3>异常时间轴</h3>
        <el-timeline>
          <el-timeline-item 
            v-for="(item, index) in timelineData" 
            :key="index"
            :timestamp="item.time"
            :type="item.type === 'anomaly' ? 'danger' : 'success'"
          >
            <el-card :bordered="false">
              <h4>{{ item.title }}</h4>
              <p>{{ item.description }}</p>
              <div class="metrics">
                <el-tag v-for="metric in item.metrics" :key="metric.name" type="info" size="small">
                  {{ metric.name }}: {{ metric.value }}
                </el-tag>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  satelliteId: '',
  startTime: '',
  endTime: ''
})

// 时间轴数据
const timelineData = ref([
  {
    time: '2025-12-13 10:20:15',
    type: 'anomaly',
    title: '轨道偏移异常',
    description: '卫星BD-03出现轨道偏移，超出正常范围',
    metrics: [
      { name: '轨道高度', value: '5480km' },
      { name: '偏差值', value: '25km' }
    ]
  },
  {
    time: '2025-12-13 10:15:30',
    type: 'warning',
    title: '信号强度降低',
    description: '卫星BD-03信号强度开始下降',
    metrics: [
      { name: '信号强度', value: '75%' },
      { name: '正常范围', value: '80%-95%' }
    ]
  },
  {
    time: '2025-12-13 10:10:00',
    type: 'warning',
    title: '温度升高',
    description: '卫星BD-03温度开始升高',
    metrics: [
      { name: '温度', value: '45°C' },
      { name: '正常范围', value: '30°C-40°C' }
    ]
  }
])

// 查询溯源数据
const searchTrace = () => {
  ElMessage.success('查询溯源数据成功')
}

// 重置表单
const resetForm = () => {
  searchForm.satelliteId = ''
  searchForm.startTime = ''
  searchForm.endTime = ''
}
</script>

<style scoped>
.anomaly-trace {
  padding: 24px; box-sizing: border-box;
}

.trace-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.trace-content {
  margin-top: 20px;
}

.trace-content h3 {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: bold;
}

.metrics {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
</style>