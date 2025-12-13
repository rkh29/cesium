<template>
  <div class="anomaly-trend">
    <h2>异常趋势分析</h2>
    <el-card class="trend-card">
      <div class="chart-header">
        <el-select v-model="chartType" placeholder="选择图表类型">
          <el-option label="折线图" value="line" />
          <el-option label="柱状图" value="bar" />
        </el-select>
        <el-select v-model="timeDimension" placeholder="选择时间维度">
          <el-option label="日" value="day" />
          <el-option label="周" value="week" />
          <el-option label="月" value="month" />
        </el-select>
        <el-button type="primary" @click="exportReport">导出报告</el-button>
      </div>
      
      <div ref="trendChartRef" class="chart"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'

// 图表类型
const chartType = ref('line')
// 时间维度
const timeDimension = ref('day')

// 图表引用
const trendChartRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null

// 初始化趋势图表
const initTrendChart = () => {
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
    
    const dates = Array.from({ length: 12 }, (_, i) => `${i + 1}日`)
    
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['硬件异常', '软件异常', '总异常数']
      },
      xAxis: {
        type: 'category',
        data: dates
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '硬件异常',
          type: chartType.value,
          data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 10 + 5)),
          itemStyle: { color: '#F53F3F' }
        },
        {
          name: '软件异常',
          type: chartType.value,
          data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 10 + 5)),
          itemStyle: { color: '#165DFF' }
        },
        {
          name: '总异常数',
          type: chartType.value,
          data: Array.from({ length: 12 }, (_, i) => {
            return Math.floor(Math.random() * 10 + 10)
          }),
          itemStyle: { color: '#FF7D00' }
        }
      ]
    }
    
    trendChart.setOption(option)
  }
}

// 导出报告
const exportReport = () => {
  ElMessage.success('报告导出成功')
}

// 监听图表类型或时间维度变化
watch([chartType, timeDimension], () => {
  initTrendChart()
})

// 监听窗口大小变化
const handleResize = () => {
  trendChart?.resize()
}

onMounted(() => {
  // 初始化图表
  initTrendChart()
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 销毁图表
  trendChart?.dispose()
  
  // 移除事件监听
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.anomaly-trend {
  padding: 0;
}

.trend-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-header {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.chart {
  height: 400px;
}
</style>