<template>
  <div class="dashboard">
    <h2>仪表盘</h2>
    
    <!-- 板块1：卫星概览卡片 -->
    <div class="section">
      <h3>卫星概览</h3>
      <el-row :gutter="20">
        <el-col :span="8" v-for="satellite in satellites" :key="satellite.id">
          <el-card class="satellite-card" :class="`status-${satellite.status}`">
            <div class="satellite-header">
              <h4>{{ satellite.name }}</h4>
              <el-tag 
                :type="satellite.status === 'normal' ? 'success' : satellite.status === 'warning' ? 'warning' : 'danger'"
              >
                {{ satellite.status === 'normal' ? '正常' : satellite.status === 'warning' ? '预警' : '异常' }}
              </el-tag>
            </div>
            <div class="satellite-info">
              <p>编号：{{ satellite.code }}</p>
              <p>在线时长：{{ satellite.onlineTime }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 板块2：关键指标实时图表 -->
    <div class="section">
      <div class="section-header">
        <h3>关键指标实时监控</h3>
        <el-select v-model="timeRange" placeholder="选择时间范围">
          <el-option label="近1小时" value="1h" />
          <el-option label="近24小时" value="24h" />
          <el-option label="近7天" value="7d" />
        </el-select>
      </div>
      <el-card class="chart-card">
        <div ref="metricsChartRef" class="chart"></div>
      </el-card>
    </div>

    <!-- 板块3：异常告警统计 -->
    <div class="section">
      <h3>异常告警统计</h3>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="chart-card">
            <div ref="anomalyTypeChartRef" class="chart"></div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">12</div>
                  <div class="stat-label">今日异常数</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number">86</div>
                  <div class="stat-label">本周异常数</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="stat-card">
                <div class="stat-content">
                  <div class="stat-number danger">5</div>
                  <div class="stat-label">未处理异常数</div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// 卫星数据
const satellites = ref([
  { id: 1, name: '北斗 - 07', code: 'BD-07', status: 'normal', onlineTime: '720 小时' },
  { id: 2, name: '北斗 - 03', code: 'BD-03', status: 'warning', onlineTime: '480 小时' },
  { id: 3, name: '北斗 - 05', code: 'BD-05', status: 'normal', onlineTime: '960 小时' },
  { id: 4, name: '北斗 - 02', code: 'BD-02', status: 'normal', onlineTime: '640 小时' },
  { id: 5, name: '北斗 - 09', code: 'BD-09', status: 'danger', onlineTime: '320 小时' },
  { id: 6, name: '北斗 - 11', code: 'BD-11', status: 'normal', onlineTime: '1200 小时' }
])

// 时间范围
const timeRange = ref('1h')

// 图表引用
const metricsChartRef = ref<HTMLElement>()
const anomalyTypeChartRef = ref<HTMLElement>()
let metricsChart: echarts.ECharts | null = null
let anomalyTypeChart: echarts.ECharts | null = null

// 初始化指标图表
const initMetricsChart = () => {
  if (metricsChartRef.value) {
    metricsChart = echarts.init(metricsChartRef.value)
    
    // 生成近1小时的时间数据
    const dates = Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setMinutes(date.getMinutes() - (60 - i * 5))
      return date.toLocaleTimeString()
    })
    
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['电压', '温度', '信号强度', '轨道高度']
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
          name: '电压',
          type: 'line',
          data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 10 + 20)),
          smooth: true,
          itemStyle: { color: '#165DFF' }
        },
        {
          name: '温度',
          type: 'line',
          data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 20 + 30)),
          smooth: true,
          itemStyle: { color: '#F53F3F' }
        },
        {
          name: '信号强度',
          type: 'line',
          data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 20 + 80)),
          smooth: true,
          itemStyle: { color: '#00B42A' }
        },
        {
          name: '轨道高度',
          type: 'line',
          data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100 + 5500)),
          smooth: true,
          itemStyle: { color: '#722ED1' }
        }
      ]
    }
    
    metricsChart.setOption(option)
  }
}

// 初始化异常类型图表
const initAnomalyTypeChart = () => {
  if (anomalyTypeChartRef.value) {
    anomalyTypeChart = echarts.init(anomalyTypeChartRef.value)
    
    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '异常类型',
          type: 'pie',
          radius: '60%',
          data: [
            { value: 30, name: '硬件故障', itemStyle: { color: '#F53F3F' } },
            { value: 25, name: '信号异常', itemStyle: { color: '#FF7D00' } },
            { value: 20, name: '轨道偏移', itemStyle: { color: '#165DFF' } },
            { value: 25, name: '数据传输失败', itemStyle: { color: '#00B42A' } }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    
    anomalyTypeChart.setOption(option)
  }
}

// 监听窗口大小变化，调整图表大小
const handleResize = () => {
  metricsChart?.resize()
  anomalyTypeChart?.resize()
}

onMounted(() => {
  // 初始化图表
  initMetricsChart()
  initAnomalyTypeChart()
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 销毁图表实例
  metricsChart?.dispose()
  anomalyTypeChart?.dispose()
  
  // 移除事件监听
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: bold;
}

/* 卫星卡片 */
.satellite-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.satellite-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16);
}

.satellite-card.status-normal {
  border-left: 4px solid #00B42A;
}

.satellite-card.status-warning {
  border-left: 4px solid #FF7D00;
}

.satellite-card.status-danger {
  border-left: 4px solid #F53F3F;
}

.satellite-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.satellite-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.satellite-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #606266;
}

/* 图表卡片 */
.chart-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart {
  height: 300px;
}

/* 统计卡片 */
.stat-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background-color: #ECF5FF;
}

.stat-content {
  text-align: center;
  padding: 20px 0;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #165DFF;
  margin-bottom: 8px;
}

.stat-number.danger {
  color: #F53F3F;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}
</style>