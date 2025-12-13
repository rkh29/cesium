<template>
  <div class="key-metrics">
    <h2>关键指标监控</h2>
    
    <!-- 刷新频率设置 -->
    <div class="refresh-settings">
      <span>刷新频率：</span>
      <el-radio-group v-model="refreshRate">
        <el-radio-button label="5s" />
        <el-radio-button label="10s" />
        <el-radio-button label="30s" />
        <el-radio-button label="手动" />
      </el-radio-group>
      <el-button type="primary" size="small" @click="manualRefresh">立即刷新</el-button>
    </div>
    
    <!-- 图表区域 -->
    <el-row :gutter="20">
      <!-- 电压和温度折线图 -->
      <el-col :span="24">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>电压与温度趋势</span>
            </div>
          </template>
          <div ref="voltageTempChartRef" class="chart"></div>
        </el-card>
      </el-col>
      
      <!-- 信号强度和轨道高度 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>信号强度</span>
            </div>
          </template>
          <div ref="signalChartRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>轨道高度</span>
            </div>
          </template>
          <div ref="orbitChartRef" class="chart"></div>
        </el-card>
      </el-col>
      
      <!-- 仪表盘 -->
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>电压</span>
            </div>
          </template>
          <div ref="voltageGaugeRef" class="chart gauge-chart"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>温度</span>
            </div>
          </template>
          <div ref="tempGaugeRef" class="chart gauge-chart"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>信号强度</span>
            </div>
          </template>
          <div ref="signalGaugeRef" class="chart gauge-chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// 刷新频率
const refreshRate = ref('10s')

// 图表引用
const voltageTempChartRef = ref<HTMLElement>()
const signalChartRef = ref<HTMLElement>()
const orbitChartRef = ref<HTMLElement>()
const voltageGaugeRef = ref<HTMLElement>()
const tempGaugeRef = ref<HTMLElement>()
const signalGaugeRef = ref<HTMLElement>()

let voltageTempChart: echarts.ECharts | null = null
let signalChart: echarts.ECharts | null = null
let orbitChart: echarts.ECharts | null = null
let voltageGauge: echarts.ECharts | null = null
let tempGauge: echarts.ECharts | null = null
let signalGauge: echarts.ECharts | null = null

// 生成模拟数据
const generateData = (count: number, min: number, max: number) => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1) + min))
}

// 初始化电压和温度折线图
const initVoltageTempChart = () => {
  if (voltageTempChartRef.value) {
    voltageTempChart = echarts.init(voltageTempChartRef.value)
    
    const dates = Array.from({ length: 24 }, (_, i) => `${i}:00`)
    
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['电压', '温度']
      },
      xAxis: {
        type: 'category',
        data: dates
      },
      yAxis: [
        {
          type: 'value',
          name: '电压 (V)',
          position: 'left'
        },
        {
          type: 'value',
          name: '温度 (°C)',
          position: 'right'
        }
      ],
      series: [
        {
          name: '电压',
          type: 'line',
          data: generateData(24, 20, 30),
          smooth: true,
          itemStyle: { color: '#165DFF' }
        },
        {
          name: '温度',
          type: 'line',
          yAxisIndex: 1,
          data: generateData(24, 25, 45),
          smooth: true,
          itemStyle: { color: '#F53F3F' }
        }
      ]
    }
    
    voltageTempChart.setOption(option)
  }
}

// 初始化信号强度图表
const initSignalChart = () => {
  if (signalChartRef.value) {
    signalChart = echarts.init(signalChartRef.value)
    
    const dates = Array.from({ length: 12 }, (_, i) => `${i * 5}:00`)
    
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: dates
      },
      yAxis: {
        type: 'value',
        name: '信号强度 (%)'
      },
      series: [
        {
          name: '信号强度',
          type: 'bar',
          data: generateData(12, 70, 95),
          itemStyle: { color: '#00B42A' }
        }
      ]
    }
    
    signalChart.setOption(option)
  }
}

// 初始化轨道高度图表
const initOrbitChart = () => {
  if (orbitChartRef.value) {
    orbitChart = echarts.init(orbitChartRef.value)
    
    const dates = Array.from({ length: 12 }, (_, i) => `${i * 5}:00`)
    
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: dates
      },
      yAxis: {
        type: 'value',
        name: '轨道高度 (km)'
      },
      series: [
        {
          name: '轨道高度',
          type: 'line',
          data: generateData(12, 5400, 5600),
          smooth: true,
          itemStyle: { color: '#722ED1' }
        }
      ]
    }
    
    orbitChart.setOption(option)
  }
}

// 初始化电压仪表盘
const initVoltageGauge = () => {
  if (voltageGaugeRef.value) {
    voltageGauge = echarts.init(voltageGaugeRef.value)
    
    const option = {
      series: [
        {
          type: 'gauge',
          data: [{ value: 25, name: '电压' }],
          min: 0,
          max: 30,
          axisLine: {
            lineStyle: {
              width: 20,
              color: [[0.6, '#F53F3F'], [0.8, '#FF7D00'], [1, '#00B42A']]
            }
          },
          pointer: {
            itemStyle: {
              color: 'auto'
            }
          },
          textStyle: {
            fontSize: 30
          }
        }
      ]
    }
    
    voltageGauge.setOption(option)
  }
}

// 初始化温度仪表盘
const initTempGauge = () => {
  if (tempGaugeRef.value) {
    tempGauge = echarts.init(tempGaugeRef.value)
    
    const option = {
      series: [
        {
          type: 'gauge',
          data: [{ value: 35, name: '温度' }],
          min: 0,
          max: 60,
          axisLine: {
            lineStyle: {
              width: 20,
              color: [[0.6, '#00B42A'], [0.8, '#FF7D00'], [1, '#F53F3F']]
            }
          },
          pointer: {
            itemStyle: {
              color: 'auto'
            }
          },
          textStyle: {
            fontSize: 30
          }
        }
      ]
    }
    
    tempGauge.setOption(option)
  }
}

// 初始化信号强度仪表盘
const initSignalGauge = () => {
  if (signalGaugeRef.value) {
    signalGauge = echarts.init(signalGaugeRef.value)
    
    const option = {
      series: [
        {
          type: 'gauge',
          data: [{ value: 85, name: '信号强度' }],
          min: 0,
          max: 100,
          axisLine: {
            lineStyle: {
              width: 20,
              color: [[0.6, '#F53F3F'], [0.8, '#FF7D00'], [1, '#00B42A']]
            }
          },
          pointer: {
            itemStyle: {
              color: 'auto'
            }
          },
          textStyle: {
            fontSize: 30
          }
        }
      ]
    }
    
    signalGauge.setOption(option)
  }
}

// 手动刷新
const manualRefresh = () => {
  // 重新加载数据逻辑
  console.log('手动刷新数据')
}

// 监听窗口大小变化
const handleResize = () => {
  voltageTempChart?.resize()
  signalChart?.resize()
  orbitChart?.resize()
  voltageGauge?.resize()
  tempGauge?.resize()
  signalGauge?.resize()
}

onMounted(() => {
  // 初始化所有图表
  initVoltageTempChart()
  initSignalChart()
  initOrbitChart()
  initVoltageGauge()
  initTempGauge()
  initSignalGauge()
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 销毁所有图表
  voltageTempChart?.dispose()
  signalChart?.dispose()
  orbitChart?.dispose()
  voltageGauge?.dispose()
  tempGauge?.dispose()
  signalGauge?.dispose()
  
  // 移除事件监听
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.key-metrics {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.refresh-settings {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

/* 图表卡片 */
.chart-card {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 0 0 15px 0;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background-color: #fafafa;
  border-bottom: 1px solid #e0e0e0;
}

.card-header span {
  font-weight: bold;
  font-size: 16px;
  color: #1d2129;
}

/* 图表区域 */
.chart {
  height: 320px;
  width: 100%;
  padding: 15px;
}

.gauge-chart {
  height: 280px;
  width: 100%;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chart {
    height: 280px;
  }
  
  .gauge-chart {
    height: 250px;
  }
  
  .refresh-settings {
    flex-wrap: wrap;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .chart {
    height: 240px;
    padding: 10px;
  }
  
  .gauge-chart {
    height: 200px;
    padding: 10px;
  }
  
  .card-header {
    padding: 10px 15px;
  }
  
  .card-header span {
    font-size: 14px;
  }
}
</style>