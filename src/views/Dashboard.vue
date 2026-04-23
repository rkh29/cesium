<template>
  <div class="dashboard-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">SpaceMAN 智能网络仪表盘</h1>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="navigateToEarth" size="large" class="nav-btn">
          <el-icon class="mr-1"><Position /></el-icon>
          进入三维卫星群视图
        </el-button>
      </div>
    </div>
    
    <!-- 核心运行指标：高级科技感数据卡片 -->
    <div class="dashboard-section top-stats">
      <el-row :gutter="24">
        <el-col :span="6" v-for="(stat, index) in networkStats" :key="index">
          <div class="tech-card" :style="{ borderLeftColor: stat.color }">
            <div class="tech-card-header">
              <span class="tech-card-title">{{ stat.title }}</span>
              <span class="tech-card-status" :style="{ color: stat.color, backgroundColor: stat.color + '15' }">
                {{ stat.status }}
              </span>
            </div>
            <div class="tech-card-name">{{ stat.name }}</div>
            <div class="tech-card-body">
              <div class="tech-card-value">
                <span class="number">{{ stat.value }}</span>
                <span class="unit">{{ stat.unit }}</span>
              </div>
              <div class="tech-card-trend">
                <span class="trend-val" :style="{ color: stat.trendColor }">{{ stat.trend }}</span>
                <span class="trend-label">{{ stat.trendLabel }}</span>
              </div>
            </div>
            <!-- 装饰点阵背景 -->
            <div class="tech-bg-grid" :style="{ backgroundImage: `radial-gradient(${stat.color} 1px, transparent 1px)` }"></div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 监控图表 -->
    <div class="dashboard-section main-charts">
      <el-row :gutter="24">
        <!-- 层级分布 -->
        <el-col :span="7">
          <div class="chart-container">
            <div class="chart-header">
              <div class="title-with-desc">
                <h2 class="section-title">异构层级节点分布</h2>
                <span class="sub-desc">物理节点在轨数量统计</span>
              </div>
            </div>
            <div ref="layerChartRef" class="echart-box"></div>
          </div>
        </el-col>
        
        <!-- 链路趋势 -->
        <el-col :span="10">
          <div class="chart-container">
            <div class="chart-header">
              <div class="title-with-desc">
                <h2 class="section-title">全网多层链路吞吐与控制面时延</h2>
                <span class="sub-desc">业务面 (激光 OISL) 与 控制面 (微波 RF) 性能剖析</span>
              </div>
              <el-radio-group v-model="timeRange" size="small" class="custom-radio">
                <el-radio-button label="1h">1h</el-radio-button>
                <el-radio-button label="24h">24h</el-radio-button>
              </el-radio-group>
            </div>
            <div ref="metricsChartRef" class="echart-box"></div>
          </div>
        </el-col>

        <!-- 健康度 -->
        <el-col :span="7">
          <div class="chart-container">
            <div class="chart-header">
              <div class="title-with-desc">
                <h2 class="section-title">网络健康度评估</h2>
                <span class="sub-desc">基于 L3 Agent 全局诊断</span>
              </div>
            </div>
            <div ref="statusChartRef" class="echart-box"></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { Position } from '@element-plus/icons-vue'

const router = useRouter()

const navigateToEarth = () => {
  router.push('/earth')
}

// 高级重构后的核心运行指标
const networkStats = ref([
  { 
    title: 'SPACE SEGMENT', 
    name: '空间段在轨节点', 
    value: '450', 
    unit: 'Satellites',
    trend: '99.9%',
    trendLabel: '健康在线率',
    trendColor: '#00B42A',
    status: 'HEALTHY',
    color: '#165DFF'
  },
  { 
    title: 'OISL MESH', 
    name: '星间激光互联矩阵', 
    value: '1,240', 
    unit: 'Links',
    trend: '+12', 
    trendLabel: '较前日新增动态链',
    trendColor: '#165DFF',
    status: 'ACTIVE',
    color: '#00B42A'
  },
  { 
    title: 'COMPUTE L3', 
    name: 'GEO 算力集群负载', 
    value: '42.5', 
    unit: '%',
    trend: '-2.1%', 
    trendLabel: '协同调度优化',
    trendColor: '#00B42A',
    status: 'STABLE',
    color: '#722ED1'
  },
  { 
    title: 'RF SIGNALING', 
    name: '微波控制面时延', 
    value: '86', 
    unit: 'ms',
    trend: 'P99 < 100ms', 
    trendLabel: '流表下发服务等级',
    trendColor: '#FF7D00',
    status: 'OPTIMAL',
    color: '#FF7D00'
  },
])

const timeRange = ref('1h')
const layerChartRef = ref<HTMLElement>()
const metricsChartRef = ref<HTMLElement>()
const statusChartRef = ref<HTMLElement>()

let layerChart: echarts.ECharts | null = null
let metricsChart: echarts.ECharts | null = null
let statusChart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const initLayerChart = () => {
  if (layerChartRef.value) {
    layerChart = echarts.init(layerChartRef.value)
    const option = {
      tooltip: { 
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: { left: '2%', right: '15%', bottom: '5%', top: '8%', containLabel: true },
      xAxis: { 
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', color: '#F2F3F5' } },
        axisLabel: { color: '#86909C' }
      },
      yAxis: { 
        type: 'category', 
        data: ['地面管控段', 'GEO 算力层', 'MEO 骨干层', 'LEO 接入层'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#4e5969', fontWeight: 600, margin: 12 }
      },
      series: [
        {
          name: '运行实例',
          type: 'bar',
          barWidth: 20,
          label: {
            show: true,
            position: 'right',
            color: '#1d2129',
            fontWeight: 'bold',
            formatter: '{c} 节点',
            padding: [0, 0, 0, 8]
          },
          data: [
            { 
              value: 4, 
              itemStyle: { 
                borderRadius: [0, 6, 6, 0],
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  { offset: 0, color: '#FFA040' }, { offset: 1, color: '#FF7D00' }
                ]),
                shadowColor: 'rgba(255, 125, 0, 0.3)', shadowBlur: 8 
              } 
            },
            { 
              value: 6, 
              itemStyle: { 
                borderRadius: [0, 6, 6, 0],
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  { offset: 0, color: '#9F3BF0' }, { offset: 1, color: '#722ED1' }
                ]),
                shadowColor: 'rgba(114, 46, 209, 0.3)', shadowBlur: 8
              } 
            },
            { 
              value: 24, 
              itemStyle: { 
                borderRadius: [0, 6, 6, 0],
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  { offset: 0, color: '#23C343' }, { offset: 1, color: '#00B42A' }
                ]),
                shadowColor: 'rgba(0, 180, 42, 0.3)', shadowBlur: 8
              } 
            },
            { 
              value: 420, 
              itemStyle: { 
                borderRadius: [0, 6, 6, 0],
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  { offset: 0, color: '#4080FF' }, { offset: 1, color: '#165DFF' }
                ]),
                shadowColor: 'rgba(22, 93, 255, 0.3)', shadowBlur: 8
              } 
            }
          ]
        }
      ]
    }
    layerChart.setOption(option)
  }
}

const initMetricsChart = () => {
  if (metricsChartRef.value) {
    metricsChart = echarts.init(metricsChartRef.value)
    const dates = Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setMinutes(date.getMinutes() - (60 - i * 5))
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    
    const option = {
      tooltip: { 
        trigger: 'axis', 
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: [12, 16],
        textStyle: { color: '#333' },
        axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } }
      },
      legend: { 
        data: ['LEO边缘层 OISL 吞吐', 'GEO-MEO 骨干链路吞吐', '微波控制面下发时延'], 
        bottom: 0,
        icon: 'roundRect',
        itemGap: 16,
        itemWidth: 16,
        itemHeight: 8,
        textStyle: { color: '#4e5969', fontSize: 12, fontWeight: 500 }
      },
      grid: { left: '3%', right: '5%', bottom: '15%', top: '12%', containLabel: true },
      xAxis: { 
        type: 'category', 
        boundaryGap: false, 
        data: dates,
        axisLine: { lineStyle: { color: '#E5E6EB' } },
        axisLabel: { color: '#86909C', margin: 12, fontSize: 11 }
      },
      yAxis: [
        { 
          type: 'value', 
          name: '网络吞吐量 (Gbps)',
          nameTextStyle: { color: '#86909C', align: 'right' },
          splitLine: { lineStyle: { type: 'dashed', color: '#F2F3F5' } },
          axisLabel: { color: '#86909C', fontSize: 11 }
        },
        {
          type: 'value',
          name: '控制信令时延 (ms)',
          nameTextStyle: { color: '#86909C', align: 'left' },
          splitLine: { show: false },
          axisLabel: { color: '#86909C', fontSize: 11 }
        }
      ],
      series: [
        { 
          name: 'LEO边缘层 OISL 吞吐', 
          type: 'line', 
          stack: 'Total',
          smooth: 0.4, 
          symbol: 'none',
          lineStyle: { width: 0 }, 
          areaStyle: { 
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(22,93,255,0.8)' }, 
              { offset: 1, color: 'rgba(22,93,255,0.1)' }
            ]) 
          }, 
          data: Array.from({ length: 12 }, () => +(Math.random() * 20 + 50).toFixed(1))
        },
        { 
          name: 'GEO-MEO 骨干链路吞吐', 
          type: 'line', 
          stack: 'Total',
          smooth: 0.4, 
          symbol: 'none',
          lineStyle: { width: 0 }, 
          areaStyle: { 
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(114,46,209,0.8)' }, 
              { offset: 1, color: 'rgba(114,46,209,0.1)' }
            ]) 
          }, 
          data: Array.from({ length: 12 }, () => +(Math.random() * 30 + 80).toFixed(1))
        },
        { 
          name: '微波控制面下发时延', 
          type: 'line', 
          yAxisIndex: 1,
          smooth: true, 
          symbol: 'emptyCircle',
          symbolSize: 6,
          showSymbol: true,
          itemStyle: { color: '#FF7D00' },
          lineStyle: { width: 3, type: 'dashed', color: '#FF7D00', shadowColor: 'rgba(255,125,0,0.3)', shadowBlur: 10 }, 
          data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 15 + 75)),
          markLine: {
            symbol: ['none', 'none'],
            label: { show: true, position: 'insideStartTop', formatter: '{b}', color: '#F53F3F', fontSize: 11, fontWeight: 'bold' },
            lineStyle: { type: 'dotted', color: '#F53F3F', width: 2 },
            data: [
              { xAxis: dates[3], name: 'SDN流表下发' },
              { xAxis: dates[8], name: '动态网关漂移' }
            ]
          }
        }
      ]
    }
    metricsChart.setOption(option)
  }
}

const initStatusChart = () => {
  if (statusChartRef.value) {
    statusChart = echarts.init(statusChartRef.value)
    const option = {
      tooltip: { 
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 12,
        formatter: '{a} <br/>{b}: {c} 节点 ({d}%)'
      },
      legend: { 
        bottom: 0, 
        icon: 'circle',
        itemGap: 16,
        itemWidth: 10,
        textStyle: { color: '#4e5969', fontSize: 12, fontWeight: 500 } 
      },
      series: [
        {
          name: '节点健康度',
          type: 'pie',
          radius: ['35%', '65%'],
          center: ['50%', '42%'],
          roseType: 'radius',
          itemStyle: { 
            borderRadius: 6, 
            borderColor: '#fff', 
            borderWidth: 2,
            shadowColor: 'rgba(0, 0, 0, 0.05)',
            shadowBlur: 10
          },
          label: { 
            show: true,
            formatter: '{b}\n{c} 节点',
            color: '#4e5969',
            fontSize: 12,
            lineHeight: 18
          },
          labelLine: {
            length: 12,
            length2: 16,
            smooth: true,
            lineStyle: { color: '#C9CDD4' }
          },
          data: [
            { value: 420, name: '运行平稳', itemStyle: { color: '#00B42A' } },
            { value: 24, name: '算力高载', itemStyle: { color: '#165DFF' } },
            { value: 10, name: '路由抖动', itemStyle: { color: '#FF7D00' } },
            { value: 1, name: '链路断联', itemStyle: { color: '#F53F3F' } }
          ].sort((a, b) => a.value - b.value)
        }
      ]
    }
    statusChart.setOption(option)
  }
}

const handleResize = () => {
  layerChart?.resize()
  metricsChart?.resize()
  statusChart?.resize()
}

onMounted(() => {
  initLayerChart()
  initMetricsChart()
  initStatusChart()
  
  // 使用 ResizeObserver 监听容器大小变化，修复右侧抽屉打开时的图表变形问题
  const container = document.querySelector('.dashboard-container')
  if (container) {
    resizeObserver = new ResizeObserver(() => {
      handleResize()
    })
    resizeObserver.observe(container)
  }
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  layerChart?.dispose()
  metricsChart?.dispose()
  statusChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard-container {
  padding: 24px 32px; 
  box-sizing: border-box;
  /* 确保完美填满一屏，57px是App.vue中顶部Header的高度 */
  height: calc(100vh - 57px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #f7f8fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  min-width: 0; /* 修复 flex 子项挤压溢出问题 */
}

.page-header {
  margin-bottom: 24px;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  margin: 0;
  font-size: 26px;
  font-weight: 600;
  color: #1d2129;
  letter-spacing: 0.5px;
}

.nav-btn {
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.2);
  transition: all 0.3s;
}

.nav-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(22, 93, 255, 0.3);
}

.mr-1 {
  margin-right: 6px;
  font-size: 16px;
}

.dashboard-section {
  margin-bottom: 20px;
  flex-shrink: 0;
}

.main-charts {
  margin-bottom: 0;
  flex: 1;
  min-height: 0;
}

.main-charts .el-row, 
.main-charts .el-col {
  height: 100%;
}

.top-stats {
  margin-bottom: 24px;
}

/* 高级科技感数据卡片 */
.tech-card {
  position: relative;
  background: #ffffff;
  border-radius: 6px;
  padding: 20px 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-left: 4px solid;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  min-width: 0; /* 防止内容挤压溢出 */
}

.tech-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.tech-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  position: relative;
  z-index: 2;
}

.tech-card-title {
  font-size: 12px;
  font-weight: 700;
  color: #86909c;
  letter-spacing: 1px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tech-card-status {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.tech-card-name {
  font-size: 15px;
  color: #1d2129;
  font-weight: 600;
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tech-card-body {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  position: relative;
  z-index: 2;
}

.tech-card-value {
  display: flex;
  align-items: baseline;
  flex-shrink: 0;
}

.tech-card-value .number {
  font-size: 34px;
  font-weight: 700;
  color: #1d2129;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  line-height: 1;
  letter-spacing: -0.5px;
}

.tech-card-value .unit {
  font-size: 13px;
  color: #86909c;
  margin-left: 6px;
  font-weight: 600;
}

.tech-card-trend {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 4px;
  flex-shrink: 0;
}

.trend-val {
  font-size: 13px;
  font-weight: 700;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  margin-bottom: 2px;
}

.trend-label {
  font-size: 11px;
  color: #86909c;
  white-space: nowrap;
}

.tech-bg-grid {
  position: absolute;
  right: -20px;
  top: -20px;
  width: 120px;
  height: 120px;
  background-size: 10px 10px;
  opacity: 0.15;
  transform: rotate(15deg);
  z-index: 1;
  pointer-events: none;
}

/* 图表容器 */
.chart-container {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  height: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.03);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s;
  min-width: 0; /* 防止内容挤压溢出 */
}

.chart-container:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.title-with-desc {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.section-title {
  margin: 0 0 6px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sub-desc {
  font-size: 13px;
  color: #86909c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.echart-box {
  flex: 1;
  width: 100%;
  min-height: 200px;
}

:deep(.el-radio-button__inner) {
  padding: 6px 12px;
  font-size: 12px;
}
</style>
