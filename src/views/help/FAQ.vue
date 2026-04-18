<template>
  <div class="faq-page">
    <div class="content-header">
      <h2>常见问题</h2>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><a href="/help">帮助中心</a></el-breadcrumb-item>
        <el-breadcrumb-item>常见问题</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="faq-content">
      <!-- FAQ统计 -->
      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :span="24">
          <el-card>
            <el-statistic-group :gap="40" style="justify-content: center;">
              <el-statistic title="总问题数" :value="6" suffix="个">
                <template #prefix>
                  <el-icon><WarningFilled /></el-icon>
                </template>
              </el-statistic>
              <el-statistic title="解决率" :value="100" suffix="%" :precision="0">
                <template #prefix>
                  <el-icon><CheckCircle /></el-icon>
                </template>
              </el-statistic>
              <el-statistic title="平均解决时间" :value="5" suffix="分钟">
                <template #prefix>
                  <el-icon><Clock /></el-icon>
                </template>
              </el-statistic>
            </el-statistic-group>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 分类标签 -->
      <div class="faq-tags">
        <el-tag 
          v-for="tag in faqTags" 
          :key="tag.value"
          :type="selectedTag === tag.value ? 'primary' : ''"
          @click="selectedTag = tag.value"
          class="tag-item"
        >
          <el-icon :size="16">{{ getTagIcon(tag.value) }}</el-icon>
          {{ tag.label }}
        </el-tag>
      </div>
      
      <!-- FAQ列表 -->
      <div class="faq-list">
        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item 
            v-for="(faq, index) in filteredFaqs" 
            :key="index"
            :title="faq.question"
            :name="index.toString()"
          >
            <div class="faq-answer">
              <el-card shadow="hover" class="answer-card">
                <el-alert
                  v-if="faq.answerType === 'text'"
                  :title="'解决方案'"
                  type="success"
                  show-icon
                  :closable="false"
                >
                  <template #default>
                    <p v-html="faq.content"></p>
                  </template>
                </el-alert>
                
                <div v-else-if="faq.answerType === 'list'">
                  <h5>解决方案</h5>
                  <el-timeline>
                    <el-timeline-item v-for="(item, i) in faq.content" :key="i" placement="top">
                      {{ item }}
                    </el-timeline-item>
                  </el-timeline>
                </div>
                
                <el-alert
                  v-else-if="faq.answerType === 'tips'"
                  :title="'提示'"
                  type="warning"
                  show-icon
                  :closable="false"
                >
                  <template #default>
                    <p>{{ faq.content }}</p>
                  </template>
                </el-alert>
              </el-card>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  WarningFilled, Clock, 
  User, DataAnalysis, Picture, Key 
} from '@element-plus/icons-vue'

// FAQ标签
const faqTags = [
  { label: '全部', value: 'all' },
  { label: '登录问题', value: 'login' },
  { label: '数据问题', value: 'data' },
  { label: '图表问题', value: 'chart' },
  { label: '权限问题', value: 'permission' }
]

// 选中的标签
const selectedTag = ref('all')

// 激活的折叠面板
const activeNames = ref([])

// FAQ数据
const faqs = ref([
  {
    id: 1,
    category: 'login',
    question: '为什么无法登录系统？',
    answerType: 'list',
    content: [
      '检查用户名和密码是否正确',
      '确认账号是否已被锁定（连续登录失败5次会锁定15分钟）',
      '检查网络连接是否正常',
      '尝试清除浏览器缓存后重新登录'
    ]
  },
  {
    id: 2,
    category: 'data',
    question: '为什么图表无法显示卫星的实时指标数据？',
    answerType: 'list',
    content: [
      '卫星与地面站的通信中断，数据未上传至系统',
      '该指标的数据源配置错误，需在"系统配置 - 数据来源"中检查',
      '浏览器缓存导致，清除浏览器缓存后刷新页面即可',
      '检查是否有权限查看该卫星的数据'
    ]
  },
  {
    id: 3,
    category: 'chart',
    question: '图表显示异常，如何解决？',
    answerType: 'list',
    content: [
      '刷新页面重试',
      '检查浏览器是否支持WebGL（部分3D图表需要WebGL支持）',
      '尝试使用Chrome或Firefox等主流浏览器',
      '清除浏览器缓存后重新加载'
    ]
  },
  {
    id: 4,
    category: 'permission',
    question: '为什么无法进行某些操作？',
    answerType: 'text',
    content: '这可能是因为您的账号权限不足。请联系系统管理员确认您的权限设置。系统根据用户角色分配不同的操作权限，管理员可以在系统配置中调整用户权限。'
  },
  {
    id: 5,
    category: 'data',
    question: '数据加载缓慢怎么办？',
    answerType: 'list',
    content: [
      '检查网络连接是否稳定',
      '尝试缩小查询时间范围',
      '减少同时查询的指标数量',
      '联系系统管理员优化数据库性能'
    ]
  },
  {
    id: 6,
    category: 'permission',
    question: '如何申请更高的操作权限？',
    answerType: 'text',
    content: '请联系系统管理员提交权限申请，管理员会根据您的工作职责和需要进行权限调整。权限调整后，您需要重新登录系统才能生效。'
  }
])

// 获取标签图标
const getTagIcon = (tag: string) => {
  const iconMap: Record<string, any> = {
    all: WarningFilled,
    login: User,
    data: DataAnalysis,
    chart: Picture,
    permission: Key
  }
  return iconMap[tag] || WarningFilled
}

// 筛选后的FAQ
const filteredFaqs = computed(() => {
  if (selectedTag.value === 'all') {
    return faqs.value
  }
  return faqs.value.filter(faq => faq.category === selectedTag.value)
})
</script>

<style scoped>
.faq-page {
  height: 100%;
}

.content-header {
  margin-bottom: 20px;
}

.content-header h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: bold;
  color: var(--vscode-text);
}

.faq-content {
  margin-top: 0;
}

/* 标签样式 */
.faq-tags {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.tag-item {
  cursor: pointer;
  font-size: 14px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* FAQ列表样式 */
.faq-list {
  background-color: var(--vscode-sidebar-bg);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 16px var(--vscode-shadow);
}

.el-collapse {
  border: none;
}

.el-collapse-item__header {
  font-size: 16px;
  font-weight: bold;
  color: var(--vscode-text);
  border-bottom: 1px solid var(--vscode-border);
  padding: 15px 0;
  transition: all 0.3s ease;
}

.el-collapse-item__header:hover {
  background-color: var(--vscode-active);
  padding-left: 10px;
}

.el-collapse-item__content {
  padding: 20px 0;
}

.answer-card {
  margin-top: 10px;
}

.answer-card h5 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: bold;
  color: var(--vscode-text);
}

/* 时间线样式 */
.el-timeline {
  padding-left: 20px;
}

.el-timeline-item {
  padding-bottom: 15px;
}
</style>