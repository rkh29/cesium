<template>
  <div class="feedback-page">
    <div class="content-header">
      <h2>问题反馈</h2>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a href="/help">帮助中心</a></el-breadcrumb-item>
        <el-breadcrumb-item>问题反馈</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentSectionTitle }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <!-- 提交新反馈 -->
    <div v-if="currentSection === 'new'" class="feedback-content">
      <div class="content-section">
        <h3>提交新反馈</h3>
        <p class="section-desc">请详细描述您遇到的问题，我们将尽快处理</p>
        
        <el-form
          :model="feedbackForm"
          :rules="rules"
          ref="feedbackFormRef"
          label-position="top"
          class="feedback-form"
        >
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="反馈标题" prop="title" required>
                <el-input
                  v-model="feedbackForm.title"
                  placeholder="请输入反馈标题"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            
            <el-col :xs="24" :sm="12">
              <el-form-item label="问题类型" prop="type" required>
                <el-select
                  v-model="feedbackForm.type"
                  placeholder="请选择问题类型"
                >
                  <el-option label="功能异常" value="function" />
                  <el-option label="操作疑问" value="operation" />
                  <el-option label="优化建议" value="optimization" />
                  <el-option label="其他" value="other" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="所属模块" prop="module" required>
                <el-select
                  v-model="feedbackForm.module"
                  placeholder="请选择所属模块"
                >
                  <el-option label="首页" value="dashboard" />
                  <el-option label="实时监控" value="monitor" />
                  <el-option label="异常分析" value="analysis" />
                  <el-option label="数据管理" value="data" />
                  <el-option label="系统配置" value="config" />
                  <el-option label="帮助中心" value="help" />
                </el-select>
              </el-form-item>
            </el-col>
            
            <el-col :xs="24" :sm="12">
              <el-form-item label="联系方式" prop="contact">
                <el-input
                  v-model="feedbackForm.contact"
                  placeholder="请输入手机号或邮箱（可选）"
                />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="问题描述" prop="description" required>
            <el-input
              v-model="feedbackForm.description"
              type="textarea"
              :rows="6"
              placeholder="请详细描述问题现象、操作步骤、报错信息等"
              maxlength="1000"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="截图上传">
            <el-upload
              v-model:file-list="fileList"
              class="upload-demo"
              drag
              action=""
              multiple
              :auto-upload="false"
              accept=".jpg,.jpeg,.png,.pdf"
            >
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div class="el-upload__text">
                拖拽文件到此处，或 <em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持jpg、jpeg、png、pdf格式，单个文件不超过10MB
                </div>
              </template>
            </el-upload>
          </el-form-item>
          
          <el-form-item>
            <div class="form-actions">
              <el-button type="primary" @click="submitForm" :loading="submitting">提交</el-button>
              <el-button @click="resetForm">重置</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    
    <!-- 我的反馈记录 -->
    <div v-else-if="currentSection === 'my'" class="feedback-content">
      <div class="content-section">
        <h3>我的反馈记录</h3>
        
        <el-table
          :data="feedbackRecords"
          style="width: 100%"
          stripe
          border
        >
          <el-table-column prop="id" label="反馈ID" width="100" />
          <el-table-column prop="title" label="标题" min-width="200" />
          <el-table-column prop="type" label="问题类型" width="120">
            <template #default="scope">
              <el-tag :type="getTypeTagType(scope.row.type)">
                {{ getTypeLabel(scope.row.type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="提交时间" width="180" />
          <el-table-column prop="status" label="处理状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusTagType(scope.row.status)">
                {{ getStatusLabel(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button type="primary" link size="small" @click="viewDetail(scope.row)">
                查看详情
              </el-button>
              <el-button type="success" link size="small" @click="appendRemark(scope.row)">
                追加说明
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="100"
            :page-size="10"
            class="pagination"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 获取当前章节
const currentSection = computed(() => {
  return (route.query.section as string) || 'new'
})

// 当前章节标题
const currentSectionTitle = computed(() => {
  const titles: Record<string, string> = {
    new: '提交新反馈',
    my: '我的反馈记录'
  }
  return titles[currentSection.value] || '提交新反馈'
})

// 反馈表单
const feedbackFormRef = ref<FormInstance>()
const submitting = ref(false)

const feedbackForm = reactive({
  title: '',
  type: '',
  module: '',
  description: '',
  contact: '',
  attachments: []
})

const fileList = ref([])

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入反馈标题', trigger: 'blur' },
    { min: 5, max: 100, message: '标题长度在 5 到 100 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择问题类型', trigger: 'change' }
  ],
  module: [
    { required: true, message: '请选择所属模块', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入问题描述', trigger: 'blur' },
    { min: 10, max: 1000, message: '描述长度在 10 到 1000 个字符', trigger: 'blur' }
  ]
}

// 提交表单
const submitForm = async () => {
  if (!feedbackFormRef.value) return
  
  try {
    await feedbackFormRef.value.validate()
    submitting.value = true
    
    // 模拟提交
    setTimeout(() => {
      submitting.value = false
      ElMessage.success('反馈提交成功')
      resetForm()
      // 跳转到反馈记录页面
      router.push('/help/feedback?section=my')
    }, 1500)
  } catch (error) {
    console.error('表单验证失败', error)
  }
}

// 重置表单
const resetForm = () => {
  if (!feedbackFormRef.value) return
  feedbackFormRef.value.resetFields()
  fileList.value = []
}

// 反馈记录数据
const feedbackRecords = [
  {
    id: 1001,
    title: '图表无法显示卫星的实时指标数据',
    type: 'function',
    module: 'monitor',
    createTime: '2024-01-15 14:30:22',
    status: 'solved'
  },
  {
    id: 1002,
    title: '如何调整异常告警阈值',
    type: 'operation',
    module: 'config',
    createTime: '2024-01-14 09:15:45',
    status: 'processing'
  },
  {
    id: 1003,
    title: '建议增加批量导出数据功能',
    type: 'optimization',
    module: 'data',
    createTime: '2024-01-13 16:45:12',
    status: 'pending'
  },
  {
    id: 1004,
    title: '登录时提示账号或密码错误',
    type: 'function',
    module: 'help',
    createTime: '2024-01-12 11:20:33',
    status: 'closed'
  }
]

// 获取问题类型标签类型
const getTypeTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    function: 'danger',
    operation: 'warning',
    optimization: 'success',
    other: 'info'
  }
  return typeMap[type] || 'info'
}

// 获取问题类型标签文本
const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    function: '功能异常',
    operation: '操作疑问',
    optimization: '优化建议',
    other: '其他'
  }
  return typeMap[type] || '其他'
}

// 获取状态标签类型
const getStatusTagType = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'info',
    processing: 'warning',
    solved: 'success',
    closed: 'default'
  }
  return statusMap[status] || 'default'
}

// 获取状态标签文本
const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    solved: '已解决',
    closed: '已关闭'
  }
  return statusMap[status] || '待处理'
}

// 查看详情
const viewDetail = (_row: any) => {
  ElMessage.info('查看详情功能开发中...')
}

// 追加说明
const appendRemark = (_row: any) => {
  ElMessage.info('追加说明功能开发中...')
}
</script>

<style scoped>
.feedback-page {
  height: 100%;
}

.content-header {
  margin-bottom: 30px;
}

.content-header h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: bold;
  color: var(--vscode-text);
}

.feedback-content {
  margin-top: 30px;
}

.content-section {
  margin-bottom: 40px;
}

.content-section h3 {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: bold;
  color: var(--vscode-text);
  border-bottom: 2px solid #165DFF;
  padding-bottom: 10px;
}

.section-desc {
  color: var(--vscode-text-muted);
  margin-bottom: 30px;
  font-size: 14px;
}

.feedback-form {
  background-color: var(--vscode-sidebar-bg);
  padding: 30px;
  border-radius: 8px;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.form-actions .el-button {
  width: 120px;
}

/* 反馈记录样式 */
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>