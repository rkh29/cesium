<template>
  <div class="history-data">
    <h2>历史数据查询</h2>
    <el-card class="data-card">
      <el-form label-position="top" :model="searchForm">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="searchForm.satelliteId" placeholder="卫星ID" />
          </el-col>
          <el-col :span="6">
            <el-select v-model="searchForm.metricType" placeholder="指标类型">
              <el-option label="电压" value="voltage" />
              <el-option label="温度" value="temperature" />
              <el-option label="信号强度" value="signal" />
              <el-option label="轨道高度" value="orbit" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-date-picker v-model="searchForm.startTime" type="datetime" placeholder="开始时间" />
          </el-col>
          <el-col :span="6">
            <el-date-picker v-model="searchForm.endTime" type="datetime" placeholder="结束时间" />
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 15px;">
          <el-col :span="24" style="text-align: right;">
            <el-button type="primary" @click="searchData">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      
      <el-table :data="tableData" stripe style="margin-top: 20px;">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="satelliteId" label="卫星ID" />
        <el-table-column prop="metricType" label="指标类型" />
        <el-table-column prop="value" label="指标值" />
        <el-table-column prop="timestamp" label="时间" />
      </el-table>
      
      <div style="margin-top: 20px;">
        <el-pagination 
          layout="total, sizes, prev, pager, next, jumper" 
          :total="1000" 
          :page-size="10" 
        />
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
  metricType: '',
  startTime: '',
  endTime: ''
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    satelliteId: 'BD-07',
    metricType: 'voltage',
    value: 25.5,
    timestamp: '2025-12-13 10:00:00'
  },
  {
    id: 2,
    satelliteId: 'BD-07',
    metricType: 'temperature',
    value: 35.2,
    timestamp: '2025-12-13 10:00:00'
  }
])

// 查询数据
const searchData = () => {
  ElMessage.success('查询数据成功')
}

// 重置表单
const resetForm = () => {
  searchForm.satelliteId = ''
  searchForm.metricType = ''
  searchForm.startTime = ''
  searchForm.endTime = ''
}
</script>

<style scoped>
.history-data {
  padding: 0;
}

.data-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>