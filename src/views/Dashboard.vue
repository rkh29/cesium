<template>
  <div class="dashboard-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">天马星通——卫星地面站通信仪表盘</h1>
      </div>
      <div class="header-right">
        <el-button @click="navigateToEarth" size="large" class="nav-btn">
          <el-icon class="mr-1"><Position /></el-icon>
          进入三维卫星群视图
        </el-button>
      </div>
    </div>

    <div class="dashboard-section top-stats">
      <el-row :gutter="24">
        <el-col :span="6" v-for="(stat, index) in networkStats" :key="index">
          <div class="tech-card">
            <div class="tech-card-header">
              <span class="tech-card-title">{{ stat.title }}</span>
              <span class="tech-card-status" :style="{ color: stat.color }">
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
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="dashboard-section main-charts">
      <el-row :gutter="24">
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

const networkStats = ref([
  {
    title: 'SPACE SEGMENT',
    name: '空间段在轨节点',
    value: '450',
    unit: 'Satellites',
    trend: '99.9%',
    trendLabel: '健康在线率',
    trendColor: '#10b981',
    status: 'HEALTHY',
    color: '#10b981'
  },
  {
    title: 'OISL MESH',
    name: '星间激光互联矩阵',
    value: '1,240',
    unit: 'Links',
    trend: '+12',
    trendLabel: '较前日新增动态链',
    trendColor: '#5e6ad2',
    status: 'ACTIVE',
    color: '#5e6ad2'
  },
  {
    title: 'COMPUTE L3',
    name: 'GEO 算力集群负载',
    value: '42.5',
    unit: '%',
    trend: '-2.1%',
    trendLabel: '协同调度优化',
    trendColor: '#10b981',
    status: 'STABLE',
    color: '#5a5f68'
  },
  {
    title: 'RF SIGNALING',
    name: '微波控制面时延',
    value: '86',
    unit: 'ms',
    trend: 'P99 < 100ms',
    trendLabel: '流表下发服务等级',
    trendColor: '#7170ff',
    status: 'OPTIMAL',
    color: '#7170ff'
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

function getAxisTheme() {
  const isDark = document.documentElement.classList.contains('dark')
  return {
    text: isDark ? '#8a8f98' : '#5a5f68',
    line: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  }
}

const initLayerChart = () => {
  if (layerChartRef.value) {
    layerChart = echarts.init(layerChartRef.value)
    const axisTheme = getAxisTheme()
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#191a1b',
        borderColor: 'rgba(255,255,255,0.08)',
        textStyle: { color: '#f7f8f8', fontSize: 12 }
      },
      grid: { left: '2%', right: '15%', bottom: '5%', top: '8%', containLabel: true },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', color: axisTheme.line } },
        axisLabel: { color: axisTheme.text, fontSize: 11 }
      },
      yAxis: {
        type: 'category',
        data: ['地面管控段', 'GEO 算力层', 'MEO 骨干层', 'LEO 接入层'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: axisTheme.text, fontWeight: 500, margin: 12, fontSize: 12 }
      },
      series: [
        {
          name: '运行实例',
          type: 'bar',
          barWidth: 20,
          label: {
            show: true,
            position: 'right',
            color: '#8a8f98',
            fontWeight: 500,
            formatter: '{c} 节点',
            padding: [0, 0, 0, 8],
            fontSize: 12
          },
          data: [
            {
              value: 4,
              itemStyle: {
                borderRadius: [0, 6, 6, 0],
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  { offset: 0, color: '#F59E0B' }, { offset: 1, color: '#D97706' }
                ])
              }
            },
            {
              value: 6,
              itemStyle: {
                borderRadius: [0, 6, 6, 0],
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  { offset: 0, color: '#8B5CF6' }, { offset: 1, color: '#7C3AED' }
                ])
              }
            },
            {
              value: 24,
              itemStyle: {
                borderRadius: [0, 6, 6, 0],
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  { offset: 0, color: '#10b981' }, { offset: 1, color: '#059669' }
                ])
              }
            },
            {
              value: 420,
              itemStyle: {
                borderRadius: [0, 6, 6, 0],
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  { offset: 0, color: '#5e6ad2' }, { offset: 1, color: '#4f46e5' }
                ])
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
    const axisTheme = getAxisTheme()
    const dates = Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setMinutes(date.getMinutes() - (60 - i * 5))
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })

    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#191a1b',
        borderColor: 'rgba(255,255,255,0.08)',
        padding: [12, 16],
        textStyle: { color: '#f7f8f8', fontSize: 12 },
        axisPointer: { type: 'cross', label: { backgroundColor: '#28282c' } }
      },
      legend: {
        data: ['LEO边缘层 OISL 吞吐', 'GEO-MEO 骨干链路吞吐', '微波控制面下发时延'],
        bottom: 0,
        icon: 'roundRect',
        itemGap: 16,
        itemWidth: 16,
        itemHeight: 8,
        textStyle: { color: axisTheme.text, fontSize: 12, fontWeight: 400 }
      },
      grid: { left: '3%', right: '5%', bottom: '18%', top: '12%', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        axisLine: { lineStyle: { color: axisTheme.line } },
        axisLabel: { color: axisTheme.text, margin: 12, fontSize: 11 }
      },
      yAxis: [
        {
          type: 'value',
          name: '网络吞吐量 (Gbps)',
          nameTextStyle: { color: axisTheme.text, align: 'right', fontSize: 11, padding: [20, 0, 0, 0] },
          splitLine: { lineStyle: { type: 'dashed', color: axisTheme.line } },
          axisLabel: { color: axisTheme.text, fontSize: 11 }
        },
        {
          type: 'value',
          name: '控制信令时延 (ms)',
          nameTextStyle: { color: axisTheme.text, align: 'left', fontSize: 11, padding: [20, 0, 0, 0] },
          splitLine: { show: false },
          axisLabel: { color: axisTheme.text, fontSize: 11 }
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
              { offset: 0, color: 'rgba(94,106,210,0.6)' },
              { offset: 1, color: 'rgba(94,106,210,0.02)' }
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
              { offset: 0, color: 'rgba(139,92,246,0.6)' },
              { offset: 1, color: 'rgba(139,92,246,0.02)' }
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
          itemStyle: { color: '#7170ff' },
          lineStyle: { width: 2, type: 'dashed', color: '#7170ff' },
          data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 15 + 75)),
          markLine: {
            symbol: ['none', 'none'],
            label: { show: true, position: 'insideStartTop', formatter: '{b}', color: '#F59E0B', fontSize: 11, fontWeight: 500 },
            lineStyle: { type: 'dotted', color: 'rgba(245,158,11,0.5)', width: 2 },
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
    const isDark = document.documentElement.classList.contains('dark')
    const labelColor = isDark ? '#d0d6e0' : '#4a4a4a'
    const axisTheme = getAxisTheme()
    const option = {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#191a1b',
        borderColor: 'rgba(255,255,255,0.08)',
        padding: 12,
        textStyle: { color: '#f7f8f8', fontSize: 12 },
        formatter: '{a} <br/>{b}: {c} 节点 ({d}%)'
      },
      legend: {
        bottom: 0,
        icon: 'circle',
        itemGap: 16,
        itemWidth: 10,
        textStyle: { color: axisTheme.text, fontSize: 12, fontWeight: 400 }
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
            borderColor: '#0f1011',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}\n{c} 节点',
            color: labelColor,
            fontSize: 11,
            lineHeight: 15
          },
          labelLine: {
            length: 8,
            length2: 10,
            smooth: true,
            lineStyle: { color: 'rgba(255,255,255,0.15)' }
          },
          data: [
            { value: 420, name: '运行平稳', itemStyle: { color: '#10b981' } },
            { value: 24, name: '算力高载', itemStyle: { color: '#5e6ad2' } },
            { value: 10, name: '路由抖动', itemStyle: { color: '#F59E0B' } },
            { value: 1, name: '链路断联', itemStyle: { color: '#EF4444' } }
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
  height: calc(100vh - 57px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
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
  font-size: 20px;
  font-weight: 600;
  color: #f7f8f8;
}

.nav-btn {
  font-weight: 500;
  padding: 8px 20px;
  border-radius: 6px;
  background: #3b5d8a;
  border: 1px solid #3b5d8a;
  color: #ffffff;
  transition: background 0.15s, border-color 0.15s;
}

.nav-btn:hover {
  background: #5b8def;
  border-color: #5b8def;
  color: #ffffff;
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

.tech-card {
  position: relative;
  background: rgba(255,255,255,0.02);
  border-radius: 8px;
  padding: 20px 24px;
  border: 1px solid rgba(255,255,255,0.06);
  overflow: hidden;
  transition: background 0.15s;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.tech-card:hover {
  background: rgba(255,255,255,0.035);
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
  font-size: 11px;
  font-weight: 600;
  color: #62666d;
  letter-spacing: 0.06em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tech-card-status {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

.tech-card-name {
  font-size: 14px;
  color: #d0d6e0;
  font-weight: 500;
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
  font-size: 30px;
  font-weight: 600;
  color: #f7f8f8;
  line-height: 1;
  letter-spacing: -0.5px;
}

.tech-card-value .unit {
  font-size: 13px;
  color: #62666d;
  margin-left: 6px;
  font-weight: 500;
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
  font-weight: 600;
  margin-bottom: 2px;
}

.trend-label {
  font-size: 11px;
  color: #62666d;
  white-space: nowrap;
}

.chart-container {
  background: rgba(255,255,255,0.02);
  border-radius: 8px;
  padding: 24px;
  height: 100%;
  border: 1px solid rgba(255,255,255,0.06);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-width: 0;
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
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 500;
  color: #f7f8f8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sub-desc {
  font-size: 13px;
  color: #62666d;
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
  padding: 4px 12px;
  font-size: 12px;
  background: transparent;
  border-color: rgba(255,255,255,0.06);
  color: #8a8f98;
}

:deep(.el-radio-button.is-active .el-radio-button__inner) {
  background: rgba(94,106,210,0.15);
  border-color: rgba(94,106,210,0.3);
  color: #f7f8f8;
  box-shadow: none;
}

:root:not(.dark) .tech-card {
  background: #ffffff;
  border-color: #e2e4e7;
}

:root:not(.dark) .tech-card:hover {
  background: #fafbfc;
}

:root:not(.dark) .tech-card-name {
  color: #1d2129;
}

:root:not(.dark) .tech-card-value .number {
  color: #1d2129;
}

:root:not(.dark) .chart-container {
  background: #ffffff;
  border-color: #e2e4e7;
}

:root:not(.dark) .section-title {
  color: #1d2129;
}

:root:not(.dark) .sub-desc {
  color: #5a5f68;
}

:root:not(.dark) .page-title {
  color: #1d2129;
}

:root:not(.dark) .nav-btn {
  background: #5b8def;
  border-color: #5b8def;
  color: #ffffff;
}

:root:not(.dark) .nav-btn:hover {
  background: #3a7be8;
  border-color: #3a7be8;
  color: #ffffff;
}

:root:not(.dark) :deep(.el-radio-button__inner) {
  border-color: rgba(0,0,0,0.08);
  color: #5a5f68;
}

:root:not(.dark) :deep(.el-radio-button.is-active .el-radio-button__inner) {
  background: rgba(94,106,210,0.1);
  border-color: rgba(94,106,210,0.2);
  color: #1d2129;
}
</style>
