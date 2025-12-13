<template>
  <div class="data-backup">
    <h2>数据备份</h2>
    <el-card class="backup-card">
      <div class="backup-actions">
        <el-button type="primary" size="large" @click="createBackup">创建备份</el-button>
        <el-button type="success" size="large" @click="restoreBackup">恢复备份</el-button>
      </div>
      
      <div class="backup-settings" style="margin-top: 20px;">
        <h3>备份设置</h3>
        <el-form label-position="top" :model="backupSettings">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-select v-model="backupSettings.backupFrequency" placeholder="选择备份频率">
                <el-option label="每天" value="daily" />
                <el-option label="每周" value="weekly" />
                <el-option label="每月" value="monthly" />
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-time-picker v-model="backupSettings.backupTime" placeholder="选择备份时间" />
            </el-col>
            <el-col :span="8">
              <el-input v-model="backupSettings.backupPath" placeholder="备份路径" />
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 15px;">
            <el-col :span="24" style="text-align: right;">
              <el-button type="primary" @click="saveSettings">保存设置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      
      <div class="backup-history" style="margin-top: 20px;">
        <h3>备份历史</h3>
        <el-table :data="backupHistory" stripe>
          <el-table-column prop="id" label="ID" />
          <el-table-column prop="backupTime" label="备份时间" />
          <el-table-column prop="backupType" label="备份类型" />
          <el-table-column prop="fileSize" label="文件大小" />
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'success' ? 'success' : 'danger'">
                {{ scope.row.status === 'success' ? '成功' : '失败' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="primary" size="small" @click="downloadBackup(scope.row)">下载</el-button>
              <el-button type="danger" size="small" @click="deleteBackup(scope.row)">删除</el-button>
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

// 备份设置
const backupSettings = reactive({
  backupFrequency: 'daily',
  backupTime: '',
  backupPath: '/backup/satellite-data'
})

// 备份历史
const backupHistory = ref([
  {
    id: 1,
    backupTime: '2025-12-13 00:00:00',
    backupType: '自动备份',
    fileSize: '12.5 MB',
    status: 'success'
  },
  {
    id: 2,
    backupTime: '2025-12-12 00:00:00',
    backupType: '自动备份',
    fileSize: '11.8 MB',
    status: 'success'
  }
])

// 创建备份
const createBackup = () => {
  ElMessage.success('备份创建成功')
}

// 恢复备份
const restoreBackup = () => {
  ElMessage.success('备份恢复成功')
}

// 保存设置
const saveSettings = () => {
  ElMessage.success('设置保存成功')
}

// 下载备份
const downloadBackup = (row: any) => {
  ElMessage.success(`下载备份：${row.id}`)
}

// 删除备份
const deleteBackup = (row: any) => {
  ElMessage.success(`删除备份：${row.id}`)
}
</script>

<style scoped>
.data-backup {
  padding: 0;
}

.backup-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.backup-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  padding: 20px 0;
}

.backup-settings h3,
.backup-history h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: bold;
}
</style>