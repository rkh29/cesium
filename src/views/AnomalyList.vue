<template>
  <div class="anomaly-list">
    <h2>异常列表</h2>
    
    <!-- 筛选器 -->
    <el-card class="filter-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select v-model="typeFilter" placeholder="按类型筛选" clearable>
            <el-option label="软件异常" value="software" />
            <el-option label="硬件异常" value="hardware" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="statusFilter" placeholder="按状态筛选" clearable>
            <el-option label="待处理" value="pending" />
            <el-option label="已处理" value="fixed" />
          </el-select>
        </el-col>
      </el-row>
    </el-card>

    <!-- 异常表格 -->
    <el-card class="table-card">
      <el-table :data="filteredAnomalies" stripe>
        <el-table-column prop="satellite_id" label="卫星ID" />
        <el-table-column prop="anomaly_type" label="类型">
          <template #default="scope">
            <el-tag :type="scope.row.anomaly_type === 'software' ? 'info' : 'warning'">
              {{ scope.row.anomaly_type === 'software' ? '软件' : '硬件' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" width="300" />
        <el-table-column prop="timestamp" label="时间" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'pending' ? 'danger' : 'success'">
              {{ scope.row.status === 'pending' ? '待处理' : '已处理' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button 
              type="primary" 
              size="small" 
              :disabled="scope.row.status === 'fixed'"
              @click="handleMarkFixed(scope.row.id)"
            >
              {{ scope.row.status === 'pending' ? '标记已处理' : '已处理' }}
            </el-button>
            <el-button 
              type="info" 
              size="small"
              @click="handleViewDetail(scope.row.id)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAnomalyStore } from '../store/anomaly'
import { Anomaly } from '../types/anomaly'

const router = useRouter()
const anomalyStore = useAnomalyStore()

// 筛选条件
const typeFilter = ref<string>('')
const statusFilter = ref<string>('')

// 过滤后的异常列表
const filteredAnomalies = computed(() => {
  return anomalyStore.anomalies.filter((anomaly: Anomaly) => {
    const typeMatch = typeFilter.value ? anomaly.anomaly_type === typeFilter.value : true
    const statusMatch = statusFilter.value ? anomaly.status === statusFilter.value : true
    return typeMatch && statusMatch
  })
})

// 标记为已处理
const handleMarkFixed = async (id: number) => {
  try {
    await anomalyStore.updateAnomalyStatus(id, 'fixed')
    ElMessage.success('已标记为已处理')
  } catch (error) {
    ElMessage.error('操作失败，请重试')
  }
}

// 查看详情
const handleViewDetail = (id: number) => {
  router.push(`/anomalies/${id}`)
}

// 初始化数据
const initData = async () => {
  await anomalyStore.fetchAnomalies()
}

// 页面加载时获取数据
initData()
</script>

<style scoped>
.anomaly-list {
  padding: 0;
}

.filter-card {
  margin-bottom: 20px;
  padding: 20px;
}

.table-card {
  margin-top: 20px;
}
</style>