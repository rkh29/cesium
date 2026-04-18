<template>
  <div class="anomaly-detail">
    <h2>异常详情</h2>
    
    <el-card v-if="anomaly" class="detail-card">
      <el-form label-position="top">
        <el-form-item label="卫星ID">
          <el-input v-model="anomaly.satellite_id" readonly />
        </el-form-item>
        <el-form-item label="类型">
          <el-tag :type="anomaly.anomaly_type === 'software' ? 'info' : 'warning'">
            {{ anomaly.anomaly_type === 'software' ? '软件异常' : '硬件异常' }}
          </el-tag>
        </el-form-item>
        <el-form-item label="完整描述">
          <el-input v-model="anomaly.description" type="textarea" :rows="4" readonly />
        </el-form-item>
        <el-form-item label="时间">
          <el-input v-model="anomaly.timestamp" readonly />
        </el-form-item>
        <el-form-item label="状态">
          <el-tag :type="anomaly.status === 'pending' ? 'danger' : 'success'">
            {{ anomaly.status === 'pending' ? '待处理' : '已处理' }}
          </el-tag>
        </el-form-item>
        <el-form-item label="可能原因">
          <el-input v-model="possibleCause" type="textarea" :rows="3" readonly />
        </el-form-item>
      </el-form>
      
      <div class="action-buttons">
        <el-button 
          type="primary" 
          :disabled="anomaly.status === 'fixed'"
          @click="handleMarkFixed"
        >
          标记已处理
        </el-button>
        <el-button type="default" @click="handleBack">返回列表</el-button>
      </div>
    </el-card>
    
    <el-empty v-else description="未找到异常信息" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAnomalyStore } from '../store/anomaly'

const route = useRoute()
const router = useRouter()
const anomalyStore = useAnomalyStore()

// 获取URL参数中的异常ID
const anomalyId = computed(() => parseInt(route.params.id as string))

// 获取异常详情
const anomaly = computed(() => anomalyStore.getAnomalyById(anomalyId.value))

// 计算可能原因
const possibleCause = computed(() => {
  if (!anomaly.value) return ''
  if (anomaly.value.anomaly_type === 'software') {
    return '软件异常：可能是程序逻辑错误或内存泄漏导致'
  } else {
    return '硬件异常：可能是设备故障或环境因素导致，例如太阳能板温度超限'
  }
})

// 标记为已处理
const handleMarkFixed = async () => {
  if (!anomaly.value) return
  try {
    await anomalyStore.updateAnomalyStatus(anomaly.value.id, 'fixed')
    ElMessage.success('已标记为已处理')
  } catch (error) {
    ElMessage.error('操作失败，请重试')
  }
}

// 返回列表页
const handleBack = () => {
  router.push('/anomalies')
}

// 监听异常ID变化，重新获取数据
watch(anomalyId, async () => {
  if (anomalyId.value) {
    await anomalyStore.fetchAnomalies()
  }
})

onMounted(async () => {
  // 初始化数据
  await anomalyStore.fetchAnomalies()
})
</script>

<style scoped>
.anomaly-detail {
  padding: 24px; box-sizing: border-box;
}

.detail-card {
  margin-top: 20px;
}

.action-buttons {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 20px;
}
</style>