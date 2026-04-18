<template>
  <div class="satellite-management">
    <h2>卫星信息管理</h2>
    <el-card class="management-card">
      <div class="card-header">
        <el-button type="primary" @click="addSatellite">添加卫星</el-button>
      </div>
      
      <el-table :data="satellites" stripe>
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="卫星名称" />
        <el-table-column prop="code" label="卫星编号" />
        <el-table-column prop="type" label="卫星类型" />
        <el-table-column prop="launchDate" label="发射日期" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
              {{ scope.row.status === 'active' ? '激活' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editSatellite(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteSatellite(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 添加/编辑卫星对话框 -->
      <el-dialog v-model="dialogVisible" title="卫星信息" width="500px">
        <el-form label-position="top" :model="satelliteForm" :rules="formRules" ref="formRef">
          <el-form-item label="卫星名称" prop="name">
            <el-input v-model="satelliteForm.name" placeholder="请输入卫星名称" />
          </el-form-item>
          <el-form-item label="卫星编号" prop="code">
            <el-input v-model="satelliteForm.code" placeholder="请输入卫星编号" />
          </el-form-item>
          <el-form-item label="卫星类型" prop="type">
            <el-select v-model="satelliteForm.type" placeholder="请选择卫星类型">
              <el-option label="通信卫星" value="communication" />
              <el-option label="导航卫星" value="navigation" />
              <el-option label="遥感卫星" value="remote_sensing" />
            </el-select>
          </el-form-item>
          <el-form-item label="发射日期" prop="launchDate">
            <el-date-picker v-model="satelliteForm.launchDate" type="date" placeholder="请选择发射日期" />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="satelliteForm.status">
              <el-radio label="active">激活</el-radio>
              <el-radio label="inactive">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveSatellite">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'

// 卫星列表
const satellites = ref([
  {
    id: 1,
    name: '北斗 - 07',
    code: 'BD-07',
    type: 'navigation',
    launchDate: '2023-01-15',
    status: 'active'
  },
  {
    id: 2,
    name: '北斗 - 03',
    code: 'BD-03',
    type: 'navigation',
    launchDate: '2022-06-20',
    status: 'active'
  }
])

// 对话框可见性
const dialogVisible = ref(false)

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const satelliteForm = reactive({
  id: null,
  name: '',
  code: '',
  type: '',
  launchDate: '',
  status: 'active'
})

// 表单验证规则
const formRules = reactive({
  name: [{ required: true, message: '请输入卫星名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入卫星编号', trigger: 'blur' }],
  type: [{ required: true, message: '请选择卫星类型', trigger: 'change' }],
  launchDate: [{ required: true, message: '请选择发射日期', trigger: 'change' }]
})

// 添加卫星
const addSatellite = () => {
  Object.assign(satelliteForm, {
    id: null,
    name: '',
    code: '',
    type: '',
    launchDate: '',
    status: 'active'
  })
  dialogVisible.value = true
}

// 编辑卫星
const editSatellite = (satellite: any) => {
  Object.assign(satelliteForm, satellite)
  dialogVisible.value = true
}

// 删除卫星
const deleteSatellite = (satellite: any) => {
  ElMessage.success(`删除卫星：${satellite.name}`)
}

// 保存卫星
const saveSatellite = () => {
  if (formRef.value) {
    formRef.value.validate((valid) => {
      if (valid) {
        if (satelliteForm.id) {
          // 编辑操作
          const index = satellites.value.findIndex(s => s.id === satelliteForm.id)
          if (index !== -1) {
            satellites.value[index] = { ...satelliteForm } as any
          }
        } else {
          // 添加操作
          satellites.value.push({
            ...satelliteForm,
            id: satellites.value.length + 1
          })
        }
        dialogVisible.value = false
        ElMessage.success('保存成功')
      }
    })
  }
}
</script>

<style scoped>
.satellite-management {
  padding: 24px; box-sizing: border-box;
}

.management-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-header {
  margin-bottom: 15px;
  text-align: right;
}
</style>t;
}
</style>