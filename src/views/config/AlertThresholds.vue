<template>
  <div class="alert-thresholds">
    <h2>告警阈值设置</h2>
    <el-card class="thresholds-card">
      <el-table :data="thresholds" stripe>
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="metric" label="指标名称" />
        <el-table-column prop="normalMax" label="正常最大值" />
        <el-table-column prop="warningMax" label="预警最大值" />
        <el-table-column prop="anomalyMax" label="异常最大值" />
        <el-table-column prop="unit" label="单位" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editThreshold(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 编辑阈值对话框 -->
      <el-dialog v-model="dialogVisible" title="告警阈值设置" width="600px">
        <el-form label-position="top" :model="thresholdForm" :rules="formRules" ref="formRef">
          <el-form-item label="指标名称" prop="metric">
            <el-select v-model="thresholdForm.metric" placeholder="请选择指标名称" disabled>
              <el-option label="电压" value="voltage" />
              <el-option label="温度" value="temperature" />
              <el-option label="信号强度" value="signal" />
              <el-option label="轨道高度" value="orbit" />
            </el-select>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="正常最大值" prop="normalMax">
                <el-input v-model="thresholdForm.normalMax" type="number" placeholder="正常最大值" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预警最大值" prop="warningMax">
                <el-input v-model="thresholdForm.warningMax" type="number" placeholder="预警最大值" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="异常最大值" prop="anomalyMax">
                <el-input v-model="thresholdForm.anomalyMax" type="number" placeholder="异常最大值" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="单位" prop="unit">
            <el-input v-model="thresholdForm.unit" placeholder="请输入单位" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveThreshold">保存</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'

// 阈值列表
const thresholds = ref([
  {
    id: 1,
    metric: 'voltage',
    normalMax: 25,
    warningMax: 28,
    anomalyMax: 30,
    unit: 'V'
  },
  {
    id: 2,
    metric: 'temperature',
    normalMax: 40,
    warningMax: 45,
    anomalyMax: 50,
    unit: '°C'
  },
  {
    id: 3,
    metric: 'signal',
    normalMax: 100,
    warningMax: 80,
    anomalyMax: 70,
    unit: '%'
  },
  {
    id: 4,
    metric: 'orbit',
    normalMax: 5500,
    warningMax: 5600,
    anomalyMax: 5700,
    unit: 'km'
  }
])

// 对话框可见性
const dialogVisible = ref(false)

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const thresholdForm = reactive({
  id: null,
  metric: '',
  normalMax: null,
  warningMax: null,
  anomalyMax: null,
  unit: ''
})

// 表单验证规则
const formRules = reactive({
  normalMax: [{ required: true, message: '请输入正常最大值', trigger: 'blur' }],
  warningMax: [{ required: true, message: '请输入预警最大值', trigger: 'blur' }],
  anomalyMax: [{ required: true, message: '请输入异常最大值', trigger: 'blur' }],
  unit: [{ required: true, message: '请输入单位', trigger: 'blur' }]
})

// 编辑阈值
const editThreshold = (threshold: any) => {
  Object.assign(thresholdForm, threshold)
  dialogVisible.value = true
}

// 保存阈值
const saveThreshold = () => {
  if (formRef.value) {
    formRef.value.validate((valid) => {
      if (valid) {
        const index = thresholds.value.findIndex(t => t.id === thresholdForm.id)
        if (index !== -1) {
          thresholds.value[index] = { ...thresholdForm } as any
        }
        dialogVisible.value = false
        ElMessage.success('保存成功')
      }
    })
  }
}
</script>

<style scoped>
.alert-thresholds {
  padding: 24px; box-sizing: border-box;
}

.thresholds-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>