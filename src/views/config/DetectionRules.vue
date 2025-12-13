<template>
  <div class="detection-rules">
    <h2>检测规则配置</h2>
    <el-card class="rules-card">
      <div class="card-header">
        <el-button type="primary" @click="dialogVisible = true">添加规则</el-button>
      </div>
      
      <el-table :data="rules" stripe>
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="规则名称" />
        <el-table-column prop="metric" label="监控指标" />
        <el-table-column prop="operator" label="运算符">
          <template #default="scope">
            {{ scope.row.operator === '>' ? '大于' : scope.row.operator === '<' ? '小于' : '等于' }}
          </template>
        </el-table-column>
        <el-table-column prop="threshold" label="阈值" />
        <el-table-column prop="anomalyType" label="异常类型">
          <template #default="scope">
            <el-tag :type="scope.row.anomalyType === 'software' ? 'info' : 'warning'">
              {{ scope.row.anomalyType === 'software' ? '软件异常' : '硬件异常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-switch v-model="scope.row.status" @change="toggleRule(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editRule(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteRule(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 添加/编辑规则对话框 -->
      <el-dialog v-model="dialogVisible" title="检测规则" width="500px">
        <el-form label-position="top" :model="ruleForm" :rules="formRules" ref="formRef">
          <el-form-item label="规则名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入规则名称" />
          </el-form-item>
          <el-form-item label="监控指标" prop="metric">
            <el-select v-model="ruleForm.metric" placeholder="请选择监控指标">
              <el-option label="电压" value="voltage" />
              <el-option label="温度" value="temperature" />
              <el-option label="信号强度" value="signal" />
              <el-option label="轨道高度" value="orbit" />
            </el-select>
          </el-form-item>
          <el-form-item label="运算符" prop="operator">
            <el-select v-model="ruleForm.operator" placeholder="请选择运算符">
              <el-option label="大于">></el-option>
              <el-option label="小于"><</el-option>
              <el-option label="等于">=</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="阈值" prop="threshold">
            <el-input v-model="ruleForm.threshold" type="number" placeholder="请输入阈值" />
          </el-form-item>
          <el-form-item label="异常类型" prop="anomalyType">
            <el-select v-model="ruleForm.anomalyType" placeholder="请选择异常类型">
              <el-option label="软件异常" value="software" />
              <el-option label="硬件异常" value="hardware" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveRule">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'

// 规则列表
const rules = ref([
  {
    id: 1,
    name: '电压超限',
    metric: 'voltage',
    operator: '>',
    threshold: 30,
    anomalyType: 'hardware',
    status: true
  },
  {
    id: 2,
    name: '温度超限',
    metric: 'temperature',
    operator: '>',
    threshold: 50,
    anomalyType: 'hardware',
    status: true
  }
])

// 对话框可见性
const dialogVisible = ref(false)

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const ruleForm = reactive({
  id: null,
  name: '',
  metric: '',
  operator: '',
  threshold: null,
  anomalyType: 'software'
})

// 表单验证规则
const formRules = reactive({
  name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  metric: [{ required: true, message: '请选择监控指标', trigger: 'change' }],
  operator: [{ required: true, message: '请选择运算符', trigger: 'change' }],
  threshold: [{ required: true, message: '请输入阈值', trigger: 'blur' }],
  anomalyType: [{ required: true, message: '请选择异常类型', trigger: 'change' }]
})

// 编辑规则
const editRule = (rule: any) => {
  Object.assign(ruleForm, rule)
  dialogVisible.value = true
}

// 删除规则
const deleteRule = (rule: any) => {
  ElMessage.success(`删除规则：${rule.name}`)
}

// 切换规则状态
const toggleRule = (rule: any) => {
  ElMessage.success(`规则${rule.name}状态已更新`)
}

// 保存规则
const saveRule = () => {
  if (formRef.value) {
    formRef.value.validate((valid) => {
      if (valid) {
        if (ruleForm.id) {
          // 编辑操作
          const index = rules.value.findIndex(r => r.id === ruleForm.id)
          if (index !== -1) {
            rules.value[index] = { ...ruleForm }
          }
        } else {
          // 添加操作
          rules.value.push({
            ...ruleForm,
            id: rules.value.length + 1,
            status: true
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
.detection-rules {
  padding: 0;
}

.rules-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-header {
  margin-bottom: 15px;
  text-align: right;
}
</style>