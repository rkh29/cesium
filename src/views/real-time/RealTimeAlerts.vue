<template>
  <div class="real-time-alerts">
    <h2>异常告警实时推送</h2>
    <el-card class="alerts-card">
      <el-table :data="alerts" stripe>
        <el-table-column prop="time" label="告警时间" />
        <el-table-column prop="satellite" label="卫星名称" />
        <el-table-column prop="type" label="异常类型">
          <template #default="scope">
            <el-tag :type="scope.row.type === 'hardware' ? 'warning' : 'info'">
              {{ scope.row.type === 'hardware' ? '硬件异常' : '软件异常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="紧急程度">
          <template #default="scope">
            <el-tag :type="scope.row.level === 'high' ? 'danger' : scope.row.level === 'medium' ? 'warning' : 'info'">
              {{ scope.row.level === 'high' ? '高' : scope.row.level === 'medium' ? '中' : '低' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="告警信息" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleAlertAction(scope.row)">处理</el-button>
            <el-button type="info" size="small" @click="handleAlertDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 模拟告警数据
const alerts = ref([
  {
    id: 1,
    time: '2025-12-13 10:20:15',
    satellite: '北斗 - 03',
    type: 'hardware',
    level: 'high',
    message: '轨道偏移异常'
  },
  {
    id: 2,
    time: '2025-12-13 10:15:30',
    satellite: '北斗 - 05',
    type: 'software',
    level: 'medium',
    message: '信号强度降低'
  },
  {
    id: 3,
    time: '2025-12-13 10:10:00',
    satellite: '北斗 - 02',
    type: 'software',
    level: 'low',
    message: '数据传输延迟'
  }
])

// 处理告警
const handleAlertAction = (alert: any) => {
  ElMessage.success(`已处理告警：${alert.message}`)
}

// 查看告警详情
const handleAlertDetail = (alert: any) => {
  ElMessage.info(`查看告警详情：${alert.id}`)
}
</script>

<style scoped>
.real-time-alerts {
  padding: 24px; box-sizing: border-box;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.real-time-alerts h2 {
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--vscode-border);
  font-size: 20px;
  font-weight: bold;
  color: var(--vscode-text);
}

.alerts-card {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.alerts-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* 表格样式优化 */
.alerts-card .el-table {
  flex: 1;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.alerts-card .el-table__header-wrapper {
  background-color: var(--vscode-hover);
}

.alerts-card .el-table__header-wrapper th {
  font-weight: bold;
  color: var(--vscode-text);
  background-color: var(--vscode-hover);
  border-bottom: 1px solid var(--vscode-border);
}

.alerts-card .el-table__body-wrapper {
  overflow: auto;
  flex: 1;
}

/* 按钮样式优化 */
.alerts-card .el-button {
  margin-right: 5px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .real-time-alerts h2 {
    font-size: 18px;
  }
  
  .alerts-card .el-button {
    font-size: 12px;
    padding: 4px 8px;
  }
}
</style>