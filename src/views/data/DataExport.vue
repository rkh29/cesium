<template>
  <div class="data-export">
    <h2>数据导出</h2>
    <el-card class="export-card">
      <el-form label-position="top" :model="exportForm">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-select v-model="exportForm.dataType" placeholder="选择数据类型">
              <el-option label="异常数据" value="anomaly" />
              <el-option label="指标数据" value="metric" />
              <el-option label="卫星状态" value="status" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="exportForm.exportFormat" placeholder="选择导出格式">
              <el-option label="CSV" value="csv" />
              <el-option label="Excel" value="excel" />
              <el-option label="JSON" value="json" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-date-picker v-model="exportForm.startTime" type="datetime" placeholder="开始时间" />
          </el-col>
          <el-col :span="6">
            <el-date-picker v-model="exportForm.endTime" type="datetime" placeholder="结束时间" />
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 15px;">
          <el-col :span="24" style="text-align: right;">
            <el-button type="primary" @click="exportData">导出数据</el-button>
          </el-col>
        </el-row>
      </el-form>
      
      <div class="export-history" style="margin-top: 20px;">
        <h3>导出历史</h3>
        <el-table :data="exportHistory" stripe>
          <el-table-column prop="id" label="ID" />
          <el-table-column prop="dataType" label="数据类型" />
          <el-table-column prop="format" label="导出格式" />
          <el-table-column prop="exportTime" label="导出时间" />
          <el-table-column prop="fileSize" label="文件大小" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="primary" size="small" @click="downloadFile(scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 导出表单
const exportForm = reactive({
  dataType: '',
  exportFormat: 'csv',
  startTime: '',
  endTime: ''
})

// 导出历史
const exportHistory = ref([
  {
    id: 1,
    dataType: '异常数据',
    format: 'CSV',
    exportTime: '2025-12-13 10:00:00',
    fileSize: '2.3 MB'
  },
  {
    id: 2,
    dataType: '指标数据',
    format: 'Excel',
    exportTime: '2025-12-12 15:30:00',
    fileSize: '5.6 MB'
  }
])

// 导出数据
const exportData = () => {
  ElMessage.success('数据导出成功')
}

// 下载文件
const downloadFile = (row: any) => {
  ElMessage.success(`下载文件：${row.id}`)
}
</script>

<style scoped>
.data-export {
  padding: 24px; box-sizing: border-box;
}

.export-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.export-history h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: bold;
}
</style>