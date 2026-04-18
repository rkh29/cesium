<template>
  <div class="satellite-status">
    <div class="page-header">
      <h2>卫星状态总览</h2>
      <div class="header-actions">
        <el-select v-model="refreshInterval" placeholder="刷新频率">
          <el-option label="5秒" value="5" />
          <el-option label="10秒" value="10" />
          <el-option label="30秒" value="30" />
        </el-select>
        <el-input v-model="searchSatellite" placeholder="定位卫星" clearable>
          <template #append>
            <el-button icon="Search" type="primary"></el-button>
          </template>
        </el-input>
      </div>
    </div>
    
    <!-- 卫星轨道地图 -->
    <el-card class="map-card">
      <div ref="mapChartRef" class="map-chart"></div>
    </el-card>
    
    <!-- 右侧悬浮告警栏 -->
    <div class="alerts-panel">
      <h3>告警实时推送</h3>
      <div class="alerts-list">
        <div class="alert-item high" v-for="(alert, index) in alerts" :key="index">
          <div class="alert-header">
            <el-tag type="danger">高紧急度</el-tag>
            <span class="alert-time">{{ alert.time }}</span>
          </div>
          <div class="alert-content">
            <p>{{ alert.satellite }} {{ alert.message }}</p>
            <el-button type="primary" size="small" @click="handleAlertAction">处理</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// 刷新频率
const refreshInterval = ref('10')
// 卫星搜索
const searchSatellite = ref('')
// 图表引用
const mapChartRef = ref<HTMLElement>()
let mapChart: echarts.ECharts | null = null

// 模拟告警数据
const alerts = ref([
  {
    time: '2025-12-13 10:20:15',
    satellite: '北斗 - 03',
    message: '轨道偏移异常',
    level: 'high'
  },
  {
    time: '2025-12-13 10:15:30',
    satellite: '北斗 - 05',
    message: '信号强度降低',
    level: 'medium'
  },
  {
    time: '2025-12-13 10:10:00',
    satellite: '北斗 - 02',
    message: '数据传输延迟',
    level: 'low'
  }
])

// 初始化卫星轨道地图
const initMapChart = () => {
  if (mapChartRef.value) {
    mapChart = echarts.init(mapChartRef.value)
    
    // 生成模拟的卫星轨道数据
    const generateOrbitData = (centerX: number, centerY: number, radius: number, points: number) => {
      const data = []
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2
        data.push([
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius
        ])
      }
      return data
    }
    
    // 卫星数据转换为笛卡尔坐标系
    const satelliteData = [
      [120, 30, '北斗 - 07', '#00B42A'],
      [110, 20, '北斗 - 03', '#FF7D00'],
      [130, 40, '北斗 - 05', '#00B42A'],
      [140, 50, '北斗 - 02', '#00B42A'],
      [90, 10, '北斗 - 09', '#F53F3F'],
      [150, 60, '北斗 - 11', '#00B42A']
    ]
    
    // 生成轨道数据
    const orbits = satelliteData.map((satellite, index) => {
      return {
        name: satellite[2],
        type: 'line',
        data: generateOrbitData(Number(satellite[0]), Number(satellite[1]), 10 + index * 2, 100),
        smooth: true,
        lineStyle: {
          color: satellite[3],
          opacity: 0.3,
          width: 1
        },
        symbol: 'none'
      }
    })
    
    const option = {
      backgroundColor: '#0a122a',
      grid: {
        left: '5%',
        right: '5%',
        top: '10%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '经度',
        nameTextStyle: {
          color: '#ffffff'
        },
        axisLine: {
          lineStyle: {
            color: '#555555'
          }
        },
        axisLabel: {
          color: '#cccccc'
        },
        splitLine: {
          lineStyle: {
            color: '#2a3a5a',
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '纬度',
        nameTextStyle: {
          color: '#ffffff'
        },
        axisLine: {
          lineStyle: {
            color: '#555555'
          }
        },
        axisLabel: {
          color: '#cccccc'
        },
        splitLine: {
          lineStyle: {
            color: '#2a3a5a',
            type: 'dashed'
          }
        }
      },
      series: [
        // 卫星轨道
        ...orbits,
        // 卫星位置
        {
          name: '卫星位置',
          type: 'scatter',
          data: satelliteData.map(item => ({
            value: [item[0], item[1], item[2]],
            itemStyle: {
              color: item[3]
            }
          })),
          symbolSize: 12,
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderColor: '#ffffff',
              borderWidth: 2
            }
          },
          tooltip: {
            formatter: function(params: any) {
              return `
                <div style="background: rgba(0, 0, 0, 0.8); padding: 10px; border-radius: 5px; color: white;">
                  <h4 style="margin: 0 0 5px 0;">${params.value[2]}</h4>
                  <p style="margin: 0;">经度：${params.value[0]}°</p>
                  <p style="margin: 0;">纬度：${params.value[1]}°</p>
                </div>
              `
            }
          }
        }
      ]
    }
    
    mapChart.setOption(option)
  }
}

// 处理告警操作
const handleAlertAction = () => {
  // 处理告警逻辑
  console.log('处理告警')
}

// 监听窗口大小变化
const handleResize = () => {
  mapChart?.resize()
}

onMounted(() => {
  // 初始化地图
  initMapChart()
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 销毁图表
  mapChart?.dispose()
  
  // 移除事件监听
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.satellite-status {
  padding: 24px; box-sizing: border-box;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--vscode-border);
}

.header-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

/* 地图卡片 */
.map-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.map-chart {
  height: 100%;
  min-height: 500px;
  width: 100%;
  border-radius: 8px;
  flex: 1;
}

/* 右侧告警面板 */
.alerts-panel {
  position: fixed;
  right: 25px;
  top: 90px;
  width: 320px;
  background-color: var(--vscode-sidebar-bg);
  border-radius: 8px;
  box-shadow: 0 8px 32px var(--vscode-shadow);
  padding: 20px;
  z-index: 1000;
  max-height: calc(100vh - 120px);
}

.alerts-panel h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: bold;
  color: var(--vscode-text);
}

.alerts-list {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding-right: 5px;
}

/* 滚动条样式 */
.alerts-list::-webkit-scrollbar {
  width: 6px;
}

.alerts-list::-webkit-scrollbar-track {
  background: var(--vscode-hover);
  border-radius: 3px;
}

.alerts-list::-webkit-scrollbar-thumb {
  background: var(--vscode-border);
  border-radius: 3px;
}

.alerts-list::-webkit-scrollbar-thumb:hover {
  background: var(--vscode-text-muted);
}

.alert-item {
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
  background-color: var(--vscode-hover);
  border-left: 4px solid;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.alert-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.alert-item.high {
  border-left-color: #F53F3F;
  background-color: rgba(245, 63, 63, 0.1);
}

.alert-item.medium {
  border-left-color: #FF7D00;
  background-color: rgba(255, 125, 0, 0.1);
}

.alert-item.low {
  border-left-color: var(--vscode-primary);
  background-color: rgba(22, 93, 255, 0.1);
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.alert-time {
  font-size: 12px;
  color: #909399;
}

.alert-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.alert-content p {
  margin: 0;
  font-size: 14px;
  flex: 1;
  word-break: break-word;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .alerts-panel {
    width: 280px;
    right: 15px;
  }
  
  .map-chart {
    min-height: 450px;
  }
}

@media (max-width: 992px) {
  .alerts-panel {
    position: static;
    width: 100%;
    max-height: 300px;
    margin-top: 15px;
  }
  
  .map-chart {
    min-height: 400px;
  }
}
</style>